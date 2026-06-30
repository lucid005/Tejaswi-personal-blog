"use client";

import { useActionState } from "react";
import {
  ReaderAuthState,
  readerLoginAction,
  readerLogoutAction,
  readerSignupAction,
  updateReaderPasswordAction,
} from "@/app/login/actions";

const initialState: ReaderAuthState = {
  status: "idle",
  message: "",
};

function Message({ state }: { state: ReaderAuthState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={`mt-4 border px-4 py-3 text-sm font-bold ${
        state.status === "success"
          ? "border-[#717a51] bg-[#f2f5e9] text-[#4f5740]"
          : "border-[#b95742] bg-[#fff1eb] text-[#82331f]"
      }`}
    >
      {state.message}
    </p>
  );
}

const inputClass =
  "min-h-[56px] border border-[#8a8277] bg-transparent px-4 text-base font-semibold normal-case tracking-normal outline-none focus:border-[#717a51] focus:shadow-[0_0_0_3px_rgba(113,122,81,0.16)]";

function AuthCard({
  children,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="border border-[#d9cec1] bg-[#fffaf2] p-6">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-fraunces text-4xl font-medium">{title}</h2>
      {children}
    </section>
  );
}

export default function ReaderAuthForms({
  isSignedIn,
  userEmail,
}: {
  isSignedIn: boolean;
  userEmail?: string | null;
}) {
  const [signupState, signupAction, isSigningUp] = useActionState(
    readerSignupAction,
    initialState,
  );
  const [loginState, loginAction, isLoggingIn] = useActionState(
    readerLoginAction,
    initialState,
  );
  const [passwordState, passwordAction, isUpdatingPassword] = useActionState(
    updateReaderPasswordAction,
    initialState,
  );
  const [logoutState, logoutAction, isLoggingOut] = useActionState(
    readerLogoutAction,
    initialState,
  );

  return (
    <div className="grid gap-5">
      {isSignedIn ? (
        <AuthCard eyebrow="Profile" title="Account">
          <p className="mt-3 font-semibold leading-7 text-[#625c52]">
            Signed in as {userEmail}.
          </p>
          <form action={logoutAction} className="mt-5">
            <button
              className="min-h-[52px] cursor-pointer border border-[#191817] px-6 text-sm font-black uppercase tracking-[0.14em] transition hover:bg-[#191817] hover:text-[#fffdf9] disabled:cursor-wait disabled:opacity-70"
              disabled={isLoggingOut}
              type="submit"
            >
              {isLoggingOut ? "Signing Out" : "Sign Out"}
            </button>
          </form>
          <Message state={logoutState} />
        </AuthCard>
      ) : null}

      <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
        <AuthCard eyebrow="New Reader" title="Create profile">
          <form action={signupAction} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
              Name
              <input className={inputClass} name="name" required />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
              Email
              <input className={inputClass} name="email" required type="email" />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
              Password
              <input
                className={inputClass}
                minLength={6}
                name="password"
                required
                type="password"
              />
            </label>
            <button
              className="min-h-[54px] cursor-pointer bg-[#191817] px-6 text-sm font-black uppercase tracking-[0.14em] text-[#fffdf9] transition hover:bg-[#717a51] disabled:cursor-wait disabled:opacity-70"
              disabled={isSigningUp}
              type="submit"
            >
              {isSigningUp ? "Creating" : "Create Account"}
            </button>
          </form>
          <Message state={signupState} />
        </AuthCard>

        <AuthCard eyebrow="Reader Login" title="Sign in">
          <form action={loginAction} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
              Email
              <input className={inputClass} name="email" required type="email" />
            </label>
            <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
              Password
              <input className={inputClass} name="password" required type="password" />
            </label>
            <button
              className="min-h-[54px] cursor-pointer bg-[#717a51] px-6 text-sm font-black uppercase tracking-[0.14em] text-[#fffdf9] transition hover:bg-[#5f6944] disabled:cursor-wait disabled:opacity-70"
              disabled={isLoggingIn}
              type="submit"
            >
              {isLoggingIn ? "Signing In" : "Sign In"}
            </button>
          </form>
          <Message state={loginState} />
        </AuthCard>
      </div>

      <AuthCard eyebrow="Password" title="Update password">
        <form action={passwordAction} className="mt-6 grid grid-cols-[1fr_auto] gap-3 max-[700px]:grid-cols-1">
          <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
            New Password
            <input
              className={inputClass}
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>
          <button
            className="self-end min-h-[56px] cursor-pointer bg-[#191817] px-6 text-sm font-black uppercase tracking-[0.14em] text-[#fffdf9] transition hover:bg-[#717a51] disabled:cursor-wait disabled:opacity-70"
            disabled={isUpdatingPassword || !isSignedIn}
            type="submit"
          >
            {isUpdatingPassword ? "Updating" : "Update"}
          </button>
        </form>
        <Message state={passwordState} />
      </AuthCard>
    </div>
  );
}
