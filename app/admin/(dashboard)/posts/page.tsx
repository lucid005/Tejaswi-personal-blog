import Link from "next/link";
import { formatPostDate } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { deletePostAction } from "./actions";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      category: true,
      series: true,
      tags: { include: { tag: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 max-[640px]:flex-col max-[640px]:items-start">
        <div>
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
            Posts
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-newsreader)] text-[clamp(2.2rem,4vw,3.4rem)] font-normal leading-none tracking-[-0.015em] text-[var(--color-ink)]">
            Library
          </h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="grid h-11 place-items-center bg-[var(--color-ink)] px-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-paper)] transition hover:bg-[var(--color-accent)]"
        >
          New post
        </Link>
      </div>

      <div className="mt-10 border border-[var(--color-hairline)]">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-[family-name:var(--font-newsreader)] text-2xl text-[var(--color-ink)]">
              No posts yet
            </p>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Create the first post to start the library.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="grid grid-cols-[1fr_auto] gap-6 border-b border-[var(--color-hairline)] p-5 last:border-b-0 max-[640px]:grid-cols-1"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                  <span className="text-[var(--color-accent)]">
                    {post.status.toLowerCase()}
                  </span>
                  <span className="text-[var(--color-hairline)]">/</span>
                  <span>{post.category.name}</span>
                  {post.series ? (
                    <>
                      <span className="text-[var(--color-hairline)]">/</span>
                      <span>{post.series.title}</span>
                    </>
                  ) : null}
                </div>
                <h2 className="mt-3 font-[family-name:var(--font-newsreader)] text-[clamp(1.5rem,2.2vw,1.9rem)] font-normal leading-tight tracking-[-0.01em] text-[var(--color-ink)]">
                  {post.title}
                </h2>
                <p className="mt-2 max-w-[64ch] text-[15px] leading-6 text-[var(--color-muted)]">
                  {post.shortDescription}
                </p>
                <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                  Posted {formatPostDate(post.publishedAt)} / Updated{" "}
                  {formatPostDate(post.updatedAt)}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="border border-[var(--color-ink)] px-4 py-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
                >
                  Edit
                </Link>
                <form action={deletePostAction}>
                  <input name="id" type="hidden" value={post.id} />
                  <button
                    type="submit"
                    className="cursor-pointer border border-[var(--color-danger)] px-4 py-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-danger)] transition hover:bg-[var(--color-danger)] hover:text-[var(--color-paper)]"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
