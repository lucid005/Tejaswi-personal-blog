import type { Metadata } from "next";
import Link from "next/link";
import ArchiveControls from "@/components/blog/ArchiveControls";
import FormattedContent from "@/components/FormattedContent";
import PageShell from "@/components/PageShell";
import PostGrid from "@/components/PostGrid";
import PostMeta from "@/components/PostMeta";
import PostInteractions from "@/components/reader/PostInteractions";
import { CommentStatus } from "@/generated/prisma/client";
import {
  trackReadingHistory,
} from "@/app/blog/[slug]/actions";
import {
  getArchiveFilters,
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
      title: "Post not found | Tejaswi Blog",
    };
  }

  return {
    title: `${post.metaTitle || post.title} | Tejaswi Blog`,
    description: post.metaDescription || post.shortDescription,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlugOrNotFound(slug);
  const currentReader = await getCurrentReader();

  if (currentReader) {
    await trackReadingHistory(post.id);
  }

  const [
    relatedPosts,
    { categories, tags },
    comments,
    reactionCounts,
    currentReaction,
    savedPost,
  ] = await Promise.all([
    getRelatedPosts(post),
    getArchiveFilters(),
    prisma.comment.findMany({
      where: {
        postId: post.id,
        parentId: null,
        status: CommentStatus.APPROVED,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            role: true,
          },
        },
        replies: {
          where: {
            status: CommentStatus.APPROVED,
          },
          include: {
            user: {
              select: {
                email: true,
                name: true,
                role: true,
              },
            },
            replies: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.reaction.groupBy({
      by: ["type"],
      where: {
        postId: post.id,
      },
      _count: {
        type: true,
      },
    }),
    currentReader
      ? prisma.reaction.findFirst({
          where: {
            postId: post.id,
            userId: currentReader.id,
          },
          select: {
            type: true,
          },
        })
      : null,
    currentReader
      ? prisma.savedPost.findUnique({
          where: {
            postId_userId: {
              postId: post.id,
              userId: currentReader.id,
            },
          },
        })
      : null,
  ]);
  return (
    <PageShell>
      <article className="px-6 pb-[clamp(72px,10vw,140px)] pt-[clamp(30px,6vw,76px)] max-[640px]:px-4">
        <div className="mx-auto grid w-[min(100%,1180px)] grid-cols-[minmax(0,760px)_minmax(230px,1fr)] gap-[clamp(34px,6vw,82px)] max-[920px]:grid-cols-1">
          <div>
            <PostMeta post={post} />
            <h1 className="mt-5 font-fraunces text-[clamp(2.7rem,7vw,6.9rem)] font-medium leading-[0.95] tracking-normal">
              {post.title}
            </h1>
            <p className="mt-6 max-w-[720px] text-[clamp(1.08rem,1.5vw,1.32rem)] font-semibold leading-[1.55] text-[#625c55]">
              {post.shortDescription}
            </p>
          </div>

          <aside className="border-l border-[#d8ccbd] pl-6 text-[0.95rem] font-semibold leading-7 text-[#625c55] max-[920px]:border-l-0 max-[920px]:border-t max-[920px]:pl-0 max-[920px]:pt-5">
            <p className="text-[0.78rem] font-extrabold uppercase text-[#717a51]">
              Written by
            </p>
            <p className="mt-2 text-[#191817]">{post.author.name || "Tejaswi"}</p>
            {post.series ? (
              <Link
                className="mt-5 block border-b border-[#c6b9a8] pb-4 text-[#4f5740] hover:text-[#191817]"
                href={`/series/${post.series.slug}`}
              >
                Part of {post.series.title}
              </Link>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <Link
                  className="border border-[#c6b9a8] px-2.5 py-1 text-[0.74rem] font-bold uppercase text-[#6f685f] transition hover:border-[#717a51] hover:text-[#4f5740]"
                  href={`/tag/${tag.slug}`}
                  key={tag.id}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </aside>
        </div>

        <div className="mx-auto mt-[clamp(44px,7vw,88px)] grid w-[min(100%,1180px)] grid-cols-[minmax(0,760px)_minmax(230px,1fr)] gap-[clamp(34px,6vw,82px)] max-[920px]:grid-cols-1">
          <FormattedContent content={post.content} />

          <aside className="grid content-start gap-6">
            {post.authorNote ? (
              <section className="border-t border-[#d8ccbd] pt-5">
                <h2 className="font-fraunces text-2xl font-medium">
                  Author note
                </h2>
                <p className="mt-3 font-semibold leading-7 text-[#625c55]">
                  {post.authorNote}
                </p>
              </section>
            ) : null}
            {post.behindThePost ? (
              <section className="border-t border-[#d8ccbd] pt-5">
                <h2 className="font-fraunces text-2xl font-medium">
                  Behind the post
                </h2>
                <p className="mt-3 font-semibold leading-7 text-[#625c55]">
                  {post.behindThePost}
                </p>
              </section>
            ) : null}
          </aside>
        </div>
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

      <section className="border-t border-[#d9cec1] px-6 py-[clamp(58px,8vw,110px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1250px)]">
          <div className="mb-7">
            <p className="mb-2 text-[0.78rem] font-extrabold uppercase text-[#717a51]">
              Browse archive
            </p>
            <h2 className="font-fraunces text-[clamp(2rem,4vw,4rem)] font-medium leading-none">
              Filter and sort
            </h2>
          </div>
          <ArchiveControls
            categories={categories.map((category) => ({
              label: category.name,
              value: category.slug,
            }))}
            currentCategory={post.category.slug}
            currentTag={post.tags[0]?.tag.slug}
            tags={tags.map((tag) => ({
              label: tag.name,
              value: tag.slug,
            }))}
          />

          <div className="mb-7">
            <p className="mb-2 text-[0.78rem] font-extrabold uppercase text-[#717a51]">
              Continue reading
            </p>
            <h2 className="font-fraunces text-[clamp(2rem,4vw,4rem)] font-medium leading-none">
              Related posts
            </h2>
          </div>
          <PostGrid
            emptyDescription="More related writing will appear here as the archive grows."
            emptyTitle="No related posts yet"
            posts={relatedPosts}
          />
        </div>
      </section>
    </PageShell>
  );
}
