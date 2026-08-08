import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import ReaderSettingsForms from "@/components/auth/ReaderSettingsForms";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/SectionHeading";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Account — Tejaswi",
  description: "Manage your reader account.",
};

export default async function ReaderSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <PageShell>
      <section className="px-6 py-[clamp(48px,7vw,110px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,900px)]">
          <Link
            href="/login"
            className="inline-flex items-baseline gap-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
          >
            ← Back to reader space
          </Link>
          <div className="mt-6">
            <SectionHeading
              eyebrow="Account"
              title="Settings"
              description="Manage sign-out and password updates."
            />
          </div>
          <ReaderSettingsForms userEmail={user.email} />
        </div>
      </section>
    </PageShell>
  );
}
