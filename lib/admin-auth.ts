import { redirect } from "next/navigation";
import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function readAdminEmail() {
  const email = process.env.ADMIN_EMAIL?.trim();

  if (!email) {
    throw new Error(
      "ADMIN_EMAIL is not set. Refusing to start with an unprotected admin account.",
    );
  }

  return email.toLowerCase();
}

// Evaluated on first import, so a misconfigured deployment fails loudly at
// startup instead of quietly falling back to a known account.
export const ADMIN_EMAIL = readAdminEmail();

export function isConfiguredAdmin(email: string | undefined | null) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
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
    },
    create: {
      id: authUser.id,
      email: ADMIN_EMAIL,
      name: "Tejaswi",
      username: "tejaswi",
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
