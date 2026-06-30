"use server";

import { prisma } from "@/lib/prisma";

export type NewsletterState = {
  message: string;
  status: "idle" | "success" | "error";
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function subscribeNewsletterAction(
  _previousState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();

  if (!name || !email) {
    return {
      status: "error",
      message: "Enter your name and email address.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      status: "error",
      message: "Enter a valid email address.",
    };
  }

  await prisma.newsletterSubscriber.upsert({
    where: {
      email,
    },
    update: {
      name,
      active: true,
    },
    create: {
      name,
      email,
    },
  });

  return {
    status: "success",
    message: "You are signed up for updates.",
  };
}
