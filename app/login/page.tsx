import type { Metadata } from "next";
import ReaderAuthForms from "@/components/auth/ReaderAuthForms";
import PageShell from "@/components/PageShell";
import ReaderDashboard from "@/components/reader/ReaderDashboard";
import SectionHeading from "@/components/SectionHeading";
import { prisma } from "@/lib/prisma";
import { syncReaderProfile } from "@/lib/reader-auth";
import { safeNext } from "@/lib/safe-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Reader — Tejaswi",
  description: "Your reader account for Tejaswi's writing archive.",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

const postSelect = {
  slug: true,
  title: true,
  shortDescription: true,
  publishedAt: true,
} as const;

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const returnTo = safeNext(next);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const reader = user ? await syncReaderProfile(user) : null;

  const [savedPosts, history, reactions, comments] = reader
    ? await Promise.all([
        prisma.savedPost.findMany({
          where: { userId: reader.id },
          include: { post: { select: postSelect } },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
        prisma.readingHistory.findMany({
          where: { userId: reader.id },
          include: { post: { select: postSelect } },
          orderBy: { lastReadAt: "desc" },
          take: 6,
        }),
        prisma.reaction.findMany({
          where: { userId: reader.id },
          include: { post: { select: postSelect } },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
        prisma.comment.findMany({
          where: { userId: reader.id },
          include: { post: { select: postSelect } },
          orderBy: { createdAt: "desc" },
          take: 6,
        }),
      ])
    : [[], [], [], []];

  return (
    <PageShell>
      <section className="px-6 py-[clamp(48px,7vw,110px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1100px)]">
          <SectionHeading
            eyebrow={reader ? "Reader" : "Sign in"}
            title={reader ? "Your reader space" : "Reader access"}
            description={
              reader
                ? "Everything you saved, reacted to, wrote on, and opened recently."
                : "Save pieces, react, and build a reading history. Reading itself is always free — this is the small door for the rest."
            }
          />
          {reader ? (
            <ReaderDashboard
              comments={comments}
              history={history}
              reactions={reactions}
              savedPosts={savedPosts}
            />
          ) : (
            <ReaderAuthForms next={returnTo} />
          )}
        </div>
      </section>
    </PageShell>
  );
}
