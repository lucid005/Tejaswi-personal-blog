import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function syncReaderProfile(authUser: {
  id: string;
  email?: string | null;
  user_metadata?: {
    name?: string;
  };
}) {
  if (!authUser.email) {
    return null;
  }

  return prisma.user.upsert({
    where: {
      email: authUser.email.toLowerCase(),
    },
    update: {
      name: authUser.user_metadata?.name ?? undefined,
    },
    create: {
      id: authUser.id,
      email: authUser.email.toLowerCase(),
      name: authUser.user_metadata?.name ?? null,
      role: UserRole.READER,
    },
  });
}

export async function getCurrentReader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return syncReaderProfile(user);
}
