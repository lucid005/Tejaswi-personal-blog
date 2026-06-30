import type { Metadata } from "next";
import ReaderAuthForms from "@/components/auth/ReaderAuthForms";
import PageShell from "@/components/PageShell";
import ReaderDashboard from "@/components/reader/ReaderDashboard";
import SectionHeading from "@/components/SectionHeading";
import { prisma } from "@/lib/prisma";
import { syncReaderProfile } from "@/lib/reader-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign Up | Tejaswi Blog",
  description: "Reader account access for Tejaswi Blog.",
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
          where: {
            userId: reader.id,
          },
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
          orderBy: {
            createdAt: "desc",
          },
          take: 6,
        }),
        prisma.readingHistory.findMany({
          where: {
            userId: reader.id,
          },
          include: {
            post: {
              select: {
                slug: true,
                title: true,
                shortDescription: true,
              },
            },
          },
          orderBy: {
            lastReadAt: "desc",
          },
          take: 6,
        }),
      ])
    : [[], []];

  return (
    <PageShell>
      <section className="px-6 py-[clamp(48px,8vw,120px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1120px)]">
          <SectionHeading
            eyebrow="Reader account"
            title="Profile"
            description={
              user
                ? "Your saved posts, recent reads, and account controls."
                : "Create a reader profile, sign in, or update your password."
            }
          />
          {reader ? (
            <ReaderDashboard history={history} savedPosts={savedPosts} />
          ) : null}
          <ReaderAuthForms isSignedIn={!!user} userEmail={user?.email} />
        </div>
      </section>
    </PageShell>
  );
}
