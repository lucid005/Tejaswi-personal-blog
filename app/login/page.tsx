import type { Metadata } from "next";
import ReaderAuthForms from "@/components/auth/ReaderAuthForms";
import PageShell from "@/components/PageShell";
import ReaderDashboard from "@/components/reader/ReaderDashboard";
import SectionHeading from "@/components/SectionHeading";
import { prisma } from "@/lib/prisma";
import { syncReaderProfile } from "@/lib/reader-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Reader — Tejaswi",
  description: "Your reader account for Tejaswi's writing archive.",
};

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const reader = user ? await syncReaderProfile(user) : null;
  const [savedPosts, history] = reader
    ? await Promise.all([
        prisma.savedPost.findMany({
          where: { userId: reader.id },
          include: {
            post: {
              select: {
                slug: true,
                title: true,
                shortDescription: true,
                publishedAt: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
        prisma.readingHistory.findMany({
          where: { userId: reader.id },
          include: {
            post: {
              select: {
                slug: true,
                title: true,
                shortDescription: true,
              },
            },
          },
          orderBy: { lastReadAt: "desc" },
          take: 6,
        }),
      ])
    : [[], []];

  return (
    <PageShell>
      <section className="px-6 py-[clamp(48px,7vw,110px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1100px)]">
          <SectionHeading
            eyebrow={reader ? "Reader" : "Sign in"}
            title={reader ? "Your reader space" : "Reader access"}
            description={
              reader
                ? "Return to what you saved, or continue reading where you left off."
                : "Save pieces, react, and build a reading history. Reading itself is always free — this is the small door for the rest."
            }
          />
          {reader ? (
            <ReaderDashboard history={history} savedPosts={savedPosts} />
          ) : (
            <ReaderAuthForms />
          )}
        </div>
      </section>
    </PageShell>
  );
}
