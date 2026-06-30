import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? process.env.ADMIN_SEED_EMAIL ?? "admin@gamil.com";

export const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ?? process.env.ADMIN_SEED_PASSWORD ?? "Admin@123";

function isConfiguredAdmin(email: string | undefined | null) {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export async function bootstrapAdminUser(password: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      ok: false,
      message: "Supabase service role key is missing.",
    };
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await adminClient.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password,
    email_confirm: true,
    user_metadata: {
      name: "Tejaswi Admin",
      role: "admin",
    },
  });

  if (error && !error.message.toLowerCase().includes("already")) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: null,
  };
}

export async function syncAdminProfile(authUser: {
  id: string;
  email?: string | null;
}) {
  if (!isConfiguredAdmin(authUser.email)) {
    return null;
  }

  return prisma.user.upsert({
    where: {
      email: ADMIN_EMAIL,
    },
    update: {
      role: UserRole.ADMIN,
      name: "Tejaswi Admin",
    },
    create: {
      id: authUser.id,
      email: ADMIN_EMAIL,
      name: "Tejaswi Admin",
      username: "tejaswi-admin",
      role: UserRole.ADMIN,
    },
  });
}

export async function getCurrentAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isConfiguredAdmin(user.email)) {
    return null;
  }

  return syncAdminProfile(user);
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
