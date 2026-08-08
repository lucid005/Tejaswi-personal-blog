"use client";

import { useActionState } from "react";
import {
  ReaderAuthState,
  readerLogoutAction,
  updateReaderPasswordAction,
} from "@/app/login/actions";

const initialState: ReaderAuthState = {
  status: "idle",
  message: "",
};

const inputClass =
  "h-12 border border-[var(--color-hairline)] bg-transparent px-3 text-[15px] text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-soft)]";

const labelClass =
  "grid gap-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]";

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

export default function ReaderSettingsForms({
  userEmail,
}: {
  userEmail?: string | null;
}) {
  const [passwordState, passwordAction, isUpdatingPassword] = useActionState(
    updateReaderPasswordAction,
    initialState,
  );
  const [logoutState, logoutAction, isLoggingOut] = useActionState(
    readerLogoutAction,
    initialState,
  );

  return (
    <div className="grid gap-6">
      <section className="border border-[var(--color-hairline)] bg-[var(--color-paper)] p-6">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
          Profile
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-newsreader)] text-[clamp(1.6rem,2.4vw,2rem)] font-normal leading-[1.1] tracking-[-0.01em] text-[var(--color-ink)]">
          Signed in as {userEmail}
        </h2>
        <form action={logoutAction} className="mt-5">
          <button
            type="submit"
            disabled={isLoggingOut}
            className="h-11 cursor-pointer border border-[var(--color-ink)] px-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] disabled:cursor-wait disabled:opacity-70"
          >
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </button>
        </form>
        <Message state={logoutState} />
      </section>

      <section className="border border-[var(--color-hairline)] bg-[var(--color-paper)] p-6">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
          Password
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-newsreader)] text-[clamp(1.6rem,2.4vw,2rem)] font-normal leading-[1.1] tracking-[-0.01em] text-[var(--color-ink)]">
          Update password
        </h2>
        <form
          action={passwordAction}
          className="mt-5 grid grid-cols-[1fr_auto] gap-3 max-[640px]:grid-cols-1"
        >
          <label className={labelClass}>
            New password
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
            disabled={isUpdatingPassword}
            className="mt-auto h-12 cursor-pointer bg-[var(--color-ink)] px-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-paper)] transition hover:bg-[var(--color-accent)] disabled:cursor-wait disabled:opacity-70"
          >
            {isUpdatingPassword ? "Updating…" : "Update"}
          </button>
        </form>
        <Message state={passwordState} />
      </section>
    </div>
  );
}
