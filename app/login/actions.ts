"use server";

import { revalidatePath } from "next/cache";
import { syncReaderProfile } from "@/lib/reader-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ReaderAuthState = {
  message: string;
  status: "idle" | "success" | "error";
};

const success = (message: string): ReaderAuthState => ({
  status: "success",
  message,
});

const error = (message: string): ReaderAuthState => ({
  status: "error",
  message,
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function readerSignupAction(
  _previousState: ReaderAuthState,
  formData: FormData,
): Promise<ReaderAuthState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!name || !email || password.length < 6) {
    return error("Enter a name, email, and password with at least 6 characters.");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (signUpError) {
    return error(signUpError.message);
  }

  if (data.user) {
    await syncReaderProfile({
      ...data.user,
      user_metadata: {
        name,
      },
    });
  }

  revalidatePath("/login");
  return success("Account created. You can update your password from this page.");
}

export async function readerLoginAction(
  _previousState: ReaderAuthState,
  formData: FormData,
): Promise<ReaderAuthState> {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!email || !password) {
    return error("Enter email and password.");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    return error(loginError.message);
  }

  if (data.user) {
    await syncReaderProfile(data.user);
  }

  revalidatePath("/login");
  return success("Signed in.");
}

export async function updateReaderPasswordAction(
  _previousState: ReaderAuthState,
  formData: FormData,
): Promise<ReaderAuthState> {
  const password = getString(formData, "password");

  if (password.length < 6) {
    return error("Use a password with at least 6 characters.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return error("Sign in before updating your password.");
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password,
  });

  if (updateError) {
    return error(updateError.message);
  }

  return success("Password updated.");
}

export async function readerLogoutAction(
  previousState: ReaderAuthState,
): Promise<ReaderAuthState> {
  void previousState;

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/login");
  return success("Signed out.");
}
