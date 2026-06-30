import type { Metadata } from "next";
import Link from "next/link";
import { ADMIN_EMAIL } from "@/lib/admin-auth";
import { adminLoginAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin Login | Tejaswi Blog",
  description: "Admin access for Tejaswi Blog.",
};

const errorMessages = {
  invalid: "Use the configured admin email and password.",
  setup:
    "Admin Auth setup failed. Check Supabase URL, anon key, and service role key.",
  auth: "Supabase rejected the login. Check the admin auth user.",
} as const;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: keyof typeof errorMessages }>;
}) {
  const params = await searchParams;
  const error =
    params.error && params.error in errorMessages
      ? errorMessages[params.error]
      : null;

  return (
    <main className="min-h-screen bg-[#f6efe6] px-6 py-8 text-[#191817] max-[640px]:px-4">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-[min(100%,520px)] flex-col justify-center">
        <Link
          className="mb-12 font-fraunces text-4xl font-medium tracking-normal"
          href="/"
        >
          Tejaswi
        </Link>
        <section className="border border-[#d9cec1] bg-[#fffaf2] p-8 shadow-[0_18px_60px_rgba(25,24,23,0.08)] max-[520px]:p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
            Admin
          </p>
          <h1 className="mt-3 font-fraunces text-[clamp(2.4rem,9vw,4.8rem)] font-medium leading-none tracking-normal">
            Sign in
          </h1>
          <p className="mt-4 max-w-md text-base font-semibold leading-7 text-[#625c52]">
            Manage posts, categories, series, and subscribers for the blog.
          </p>

          {error ? (
            <p className="mt-6 border border-[#b95742] bg-[#fff1eb] px-4 py-3 text-sm font-bold text-[#82331f]">
              {error}
            </p>
          ) : null}

          <form action={adminLoginAction} className="mt-8 grid gap-4">
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
              Email
              <input
                className="min-h-[56px] border border-[#8a8277] bg-transparent px-4 text-base font-semibold normal-case tracking-normal outline-none focus:border-[#717a51] focus:shadow-[0_0_0_3px_rgba(113,122,81,0.16)]"
                defaultValue={ADMIN_EMAIL}
                name="email"
                required
                type="email"
              />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
              Password
              <input
                className="min-h-[56px] border border-[#8a8277] bg-transparent px-4 text-base font-semibold normal-case tracking-normal outline-none focus:border-[#717a51] focus:shadow-[0_0_0_3px_rgba(113,122,81,0.16)]"
                name="password"
                required
                type="password"
              />
            </label>
            <button
              className="mt-2 min-h-[58px] cursor-pointer bg-[#191817] px-6 text-sm font-black uppercase tracking-[0.14em] text-[#fffdf9] transition hover:bg-[#717a51]"
              type="submit"
            >
              Enter Admin
            </button>
          </form> 
        </section>
      </div>
    </main>
  );
}
