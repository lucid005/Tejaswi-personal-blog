"use server";

import { redirect } from "next/navigation";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  bootstrapAdminUser,
  syncAdminProfile,
} from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function adminLoginAction(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (email !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    redirect("/admin/login?error=invalid");
  }

  const supabase = await createSupabaseServerClient();
  let result = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password,
  });

  if (result.error) {
    const bootstrap = await bootstrapAdminUser(password);

    if (!bootstrap.ok) {
      redirect("/admin/login?error=setup");
    }

    result = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });
  }

  if (result.error || !result.data.user) {
    redirect("/admin/login?error=auth");
  }

  await syncAdminProfile(result.data.user);
  redirect("/admin");
}
