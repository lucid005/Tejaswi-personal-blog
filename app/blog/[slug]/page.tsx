import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FormattedContent from "@/components/FormattedContent";
import PageShell from "@/components/PageShell";
import PostCard from "@/components/PostCard";
import PostInteractions from "@/components/reader/PostInteractions";
import ReadingProgress from "@/components/reader/ReadingProgress";
import { CommentStatus } from "@/generated/prisma/client";
import { trackReadingHistory } from "@/app/blog/[slug]/actions";
import {
  formatPostDate,
  getPostBySlug,
  getPostBySlugOrNotFound,
  getRelatedPosts,
} from "@/lib/posts";
import { getCurrentReader } from "@/lib/reader-auth";
import { prisma } from "@/lib/prisma";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found — Tejaswi",
    };
  }

  return {
    title: `${post.metaTitle || post.title} — Tejaswi`,
    description: post.metaDescription || post.shortDescription,
  };
}

function coverImageFor(slug: string, existing?: string | null) {
  if (existing) return existing;
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/1600/900`;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlugOrNotFound(slug);
  const currentReader = await getCurrentReader();

  if (currentReader) {
    await trackReadingHistory(post.id);
  }

  // Everyone sees approved comments. A reader additionally sees their own
  // pending one, so they can tell it was received rather than swallowed.
  const commentVisibility = currentReader
    ? {
        OR: [
          { status: CommentStatus.APPROVED },
          { status: CommentStatus.PENDING, userId: currentReader.id },
        ],
      }
    : { status: CommentStatus.APPROVED };

  const [relatedPosts, comments, reactionCounts, currentReaction, savedPost] =
    await Promise.all([
      getRelatedPosts(post),
      prisma.comment.findMany({
        where: {
          postId: post.id,
          parentId: null,
          ...commentVisibility,
        },
        include: {
          user: {
            select: { email: true, name: true, role: true },
          },
          replies: {
            where: commentVisibility,
            include: {
              user: {
                select: { email: true, name: true, role: true },
              },
              replies: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.reaction.groupBy({
        by: ["type"],
        where: { postId: post.id },
        _count: { type: true },
      }),
      currentReader
        ? prisma.reaction.findFirst({
            where: { postId: post.id, userId: currentReader.id },
            select: { type: true },
          })
        : null,
      currentReader
        ? prisma.savedPost.findUnique({
            where: {
              postId_userId: { postId: post.id, userId: currentReader.id },
            },
          })
        : null,
    ]);

  return (
    <PageShell>
      <ReadingProgress />

      <article>
        <header className="border-b border-[var(--color-hairline)] px-6 pt-[clamp(48px,7vw,96px)] pb-[clamp(36px,5vw,72px)] max-[640px]:px-4">
          <div className="mx-auto w-[min(100%,860px)]">
            <div className="mb-6 flex items-baseline gap-3 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em]">
              <Link
                href={`/category/${post.category.slug}`}
                className="text-[var(--color-accent)] transition hover:text-[var(--color-ink)]"
              >
                {post.category.name}
              </Link>
              {post.series ? (
                <>
                  <span className="text-[var(--color-hairline)]">/</span>
                  <Link
                    href={`/series/${post.series.slug}`}
                    className="text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
                  >
                    {post.series.title}
                  </Link>
                </>
              ) : null}
            </div>
            <h1 className="max-w-[22ch] font-[family-name:var(--font-newsreader)] text-[clamp(2.4rem,5.5vw,4.6rem)] font-normal leading-[1.04] tracking-[-0.02em] text-[var(--color-ink)]">
              {post.title}
            </h1>
            <p className="mt-6 max-w-[62ch] font-[family-name:var(--font-newsreader)] text-[clamp(1.15rem,1.6vw,1.4rem)] italic leading-[1.55] text-[var(--color-muted)]">
              {post.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
              <span className="text-[var(--color-ink)]">
                {post.author.name || "Tejaswi"}
              </span>
              <span className="text-[var(--color-hairline)]">/</span>
              <time dateTime={post.publishedAt?.toISOString()}>
                {formatPostDate(post.publishedAt)}
              </time>
              <span className="text-[var(--color-hairline)]">/</span>
              <span>{post.readingTimeMinutes} min read</span>
            </div>
          </div>
        </header>

        <figure className="px-6 pt-[clamp(28px,4vw,52px)] max-[640px]:px-4">
          <div className="mx-auto w-[min(100%,1100px)]">
            <div className="relative aspect-[1.9] w-full overflow-hidden bg-[var(--color-surface)]">
              <Image
                src={coverImageFor(post.slug, post.coverImageUrl)}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1100px) 100vw, 1100px"
              />
            </div>
          </div>
        </figure>

        <div className="px-6 pt-[clamp(48px,7vw,96px)] pb-[clamp(48px,7vw,96px)] max-[640px]:px-4">
          <FormattedContent content={post.content} />
        </div>

        {post.tags.length > 0 ? (
          <div className="mx-auto w-[min(100%,720px)] px-6 pb-8 max-[640px]:px-4">
            <div className="flex flex-wrap gap-2 border-t border-[var(--color-hairline)] pt-6">
              {post.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="border border-[var(--color-hairline)] px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {(post.authorNote || post.behindThePost) ? (
          <aside className="mx-auto w-[min(100%,720px)] px-6 pb-[clamp(48px,7vw,80px)] max-[640px]:px-4">
            <div className="grid gap-8 border-t border-[var(--color-hairline)] pt-8">
              {post.authorNote ? (
                <section>
                  <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
                    Author note
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-newsreader)] text-[1.1rem] italic leading-[1.7] text-[var(--color-ink)]">
                    {post.authorNote}
                  </p>
                </section>
              ) : null}
              {post.behindThePost ? (
                <section>
                  <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    Behind the post
                  </p>
                  <p className="mt-3 text-[15px] leading-[1.75] text-[var(--color-muted)]">
                    {post.behindThePost}
                  </p>
                </section>
              ) : null}
            </div>
          </aside>
        ) : null}
      </article>

      <PostInteractions
        comments={comments}
        currentReaction={currentReaction?.type}
        currentUserId={currentReader?.id}
        isSaved={!!savedPost}
        postId={post.id}
        reactionCounts={reactionCounts.map((reaction) => ({
          type: reaction.type,
          count: reaction._count.type,
        }))}
        slug={post.slug}
      />

      {relatedPosts.length > 0 ? (
        <section className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] px-6 py-[clamp(56px,8vw,110px)] max-[640px]:px-4">
          <div className="mx-auto w-[min(100%,1100px)]">
            <div className="mb-10 flex items-end justify-between gap-4 max-[640px]:flex-col max-[640px]:items-start">
              <h2 className="font-[family-name:var(--font-newsreader)] text-[clamp(1.7rem,3vw,2.4rem)] font-normal leading-none tracking-[-0.015em] text-[var(--color-ink)]">
                Keep reading
              </h2>
              <Link
                href="/blog"
                className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
              >
                Full archive →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-x-[clamp(24px,3vw,40px)] gap-y-12 max-[1000px]:grid-cols-2 max-[680px]:grid-cols-1">
              {relatedPosts.slice(0, 3).map((related) => (
                <PostCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
