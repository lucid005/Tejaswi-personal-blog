import Link from "next/link";
import { PostStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { formatPostDate } from "@/lib/posts";

export default async function AdminDashboardPage() {
  const [postCount, draftCount, publishedCount, subscriberCount, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: PostStatus.DRAFT } }),
      prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
      prisma.newsletterSubscriber.count(),
      prisma.post.findMany({
        include: { category: true },
        orderBy: { updatedAt: "desc" },
        take: 6,
      }),
    ]);

  const stats = [
    { label: "All posts", value: postCount },
    { label: "Published", value: publishedCount },
    { label: "Drafts", value: draftCount },
    { label: "Subscribers", value: subscriberCount },
  ];

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 max-[640px]:flex-col max-[640px]:items-start">
        <div>
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
            Overview
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-newsreader)] text-[clamp(2.2rem,4vw,3.4rem)] font-normal leading-none tracking-[-0.015em] text-[var(--color-ink)]">
            Content desk
          </h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="grid h-11 place-items-center bg-[var(--color-ink)] px-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-paper)] transition hover:bg-[var(--color-accent)]"
        >
          New post
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="border border-[var(--color-hairline)] bg-[var(--color-surface)] p-5"
          >
            <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
              {stat.label}
            </p>
            <p className="mt-4 font-[family-name:var(--font-newsreader)] text-[clamp(2rem,4vw,2.8rem)] font-normal leading-none tracking-[-0.01em] text-[var(--color-ink)]">
              {stat.value}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-[family-name:var(--font-newsreader)] text-[clamp(1.6rem,2.5vw,2rem)] font-normal leading-none tracking-[-0.01em] text-[var(--color-ink)]">
            Recent posts
          </h2>
          <Link
            href="/admin/posts"
            className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
          >
            Manage all →
          </Link>
        </div>
        <div className="border border-[var(--color-hairline)]">
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--color-hairline)] px-5 py-4 last:border-b-0 max-[640px]:grid-cols-1"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                  <span className="text-[var(--color-accent)]">
                    {post.status.toLowerCase()}
                  </span>
                  <span className="text-[var(--color-hairline)]">/</span>
                  <span>{post.category.name}</span>
                  <span className="text-[var(--color-hairline)]">/</span>
                  <span>Updated {formatPostDate(post.updatedAt)}</span>
                </div>
                <p className="mt-2 font-[family-name:var(--font-newsreader)] text-xl leading-tight text-[var(--color-ink)]">
                  {post.title}
                </p>
              </div>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="self-center border border-[var(--color-ink)] px-4 py-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
              >
                Edit
              </Link>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
