"use client";

import { useActionState } from "react";
import {
  NewsletterState,
  subscribeNewsletterAction,
} from "@/app/newsletter-actions";

const initialState: NewsletterState = {
  status: "idle",
  message: "",
};

export default function NewsletterSignup() {
  const [state, formAction, isPending] = useActionState(
    subscribeNewsletterAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-10 grid w-full grid-cols-[1fr_1fr_auto] gap-2.5 max-[820px]:grid-cols-1"
    >
      <label className="block">
        <span className="sr-only">Full Name</span>
        <input
          className="min-h-[63px] w-full border border-[#6d675f] bg-transparent px-5 text-[0.98rem] font-semibold text-[#191817] outline-none placeholder:text-[#6f6962] focus:border-[#717a51] focus:shadow-[0_0_0_3px_rgba(113,122,81,0.16)]"
          name="name"
          placeholder="Full Name"
          required
          type="text"
        />
      </label>
      <label className="block">
        <span className="sr-only">Email Address</span>
        <input
          className="min-h-[63px] w-full border border-[#6d675f] bg-transparent px-5 text-[0.98rem] font-semibold text-[#191817] outline-none placeholder:text-[#6f6962] focus:border-[#717a51] focus:shadow-[0_0_0_3px_rgba(113,122,81,0.16)]"
          name="email"
          placeholder="Email Address"
          required
          type="email"
        />
      </label>
      <button
        className="min-h-[63px] cursor-pointer bg-[#717a51] px-8 text-sm font-bold uppercase text-[#fffdf9] transition hover:bg-[#5f6944] active:translate-y-px disabled:cursor-wait disabled:opacity-70 max-[820px]:w-full"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving" : "Sign Up"}
      </button>
      {state.message ? (
        <p
          className={`col-span-full mt-2 text-sm font-bold ${
            state.status === "success" ? "text-[#4f5740]" : "text-[#82331f]"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
