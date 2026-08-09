"use client";

import { useActionState } from "react";
import {
  ReaderAuthState,
  readerLoginAction,
  readerSignupAction,
} from "@/app/login/actions";

const initialState: ReaderAuthState = {
  status: "idle",
  message: "",
};

function Message({ state }: { state: ReaderAuthState }) {
  if (!state.message) return null;

  return (
    <p
      className={`mt-4 border px-4 py-3 text-sm leading-6 ${
        state.status === "success"
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
          : "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]"
      }`}
      role={state.status === "error" ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}

const inputClass =
  "h-12 border border-[var(--color-hairline)] bg-transparent px-3 text-[15px] text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-soft)]";

const labelClass =
  "grid gap-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]";

function AuthCard({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border border-[var(--color-hairline)] bg-[var(--color-paper)] p-6">
      <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-newsreader)] text-[clamp(1.6rem,2.4vw,2rem)] font-normal leading-[1.1] tracking-[-0.01em] text-[var(--color-ink)]">
        {title}
      </h2>
      <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.65] text-[var(--color-muted)]">
        {description}
      </p>
      {children}
    </section>
  );
}

export default function ReaderAuthForms({ next }: { next: string }) {
  const [signupState, signupAction, isSigningUp] = useActionState(
    readerSignupAction,
    initialState,
  );
  const [loginState, loginAction, isLoggingIn] = useActionState(
    readerLoginAction,
    initialState,
  );

  return (
    <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
      <AuthCard
        eyebrow="New reader"
        title="Create a profile"
        description="Save pieces, react, and leave notes. Takes about 30 seconds."
      >
        <form action={signupAction} className="mt-6 grid gap-4">
          <input name="next" type="hidden" value={next} />
          <label className={labelClass}>
            Name
            <input className={inputClass} name="name" required />
          </label>
          <label className={labelClass}>
            Email
            <input
              className={inputClass}
              name="email"
              required
              type="email"
              autoComplete="email"
            />
          </label>
          <label className={labelClass}>
            Password
            <input
              className={inputClass}
              minLength={6}
              name="password"
              required
              type="password"
              autoComplete="new-password"
            />
          </label>
          <button
            type="submit"
            disabled={isSigningUp}
            className="mt-2 h-12 cursor-pointer bg-[var(--color-ink)] px-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-paper)] transition hover:bg-[var(--color-accent)] disabled:cursor-wait disabled:opacity-70"
          >
            {isSigningUp ? "Creating…" : "Create account"}
          </button>
        </form>
        <Message state={signupState} />
      </AuthCard>

      <AuthCard
        eyebrow="Returning reader"
        title="Sign in"
        description="Pick up where you left off."
      >
        <form action={loginAction} className="mt-6 grid gap-4">
          <input name="next" type="hidden" value={next} />
          <label className={labelClass}>
            Email
            <input
              className={inputClass}
              name="email"
              required
              type="email"
              autoComplete="email"
            />
          </label>
          <label className={labelClass}>
            Password
            <input
              className={inputClass}
              name="password"
              required
              type="password"
              autoComplete="current-password"
            />
          </label>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="mt-2 h-12 cursor-pointer border border-[var(--color-ink)] bg-transparent px-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] disabled:cursor-wait disabled:opacity-70"
          >
            {isLoggingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <Message state={loginState} />
      </AuthCard>
    </div>
  );
}
