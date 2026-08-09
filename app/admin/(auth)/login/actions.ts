"use server";

import { redirect } from "next/navigation";
import {
  ADMIN_EMAIL,
  isConfiguredAdmin,
  syncAdminProfile,
} from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function adminLoginAction(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  // The password is never compared here — Supabase verifies it. The only check
  // this app makes is that the address is the configured admin.
  if (!isConfiguredAdmin(email) || !password) {
    redirect("/admin/login?error=invalid");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password,
  });

  // One error code for every failure, so the form never reveals whether the
  // address was the right one.
  if (error || !data.user) {
    redirect("/admin/login?error=invalid");
  }

  await syncAdminProfile(data.user);
  redirect("/admin");
}
