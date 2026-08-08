import Link from "next/link";
import PageShell from "@/components/PageShell";
import PostCard from "@/components/PostCard";
import PostGrid from "@/components/PostGrid";
import {
  getCategoriesWithPosts,
  getFeaturedPost,
  getPublishedPosts,
  getSeriesList,
} from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [posts, featuredPost, categories, seriesList] = await Promise.all([
    getPublishedPosts(),
    getFeaturedPost(),
    getCategoriesWithPosts(),
    getSeriesList(),
  ]);

  const heroPost = featuredPost ?? posts[0];
  const remainingPosts = heroPost
    ? posts.filter((post) => post.id !== heroPost.id)
    : posts;

  const nowLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <PageShell>
      <section
        aria-label="Masthead"
        className="border-b border-[var(--color-hairline)] px-6 max-[640px]:px-4"
      >
        <div className="mx-auto grid w-[min(100%,1200px)] grid-cols-[1fr_auto] items-end gap-4 py-8 max-[640px]:grid-cols-1 max-[640px]:py-6">
          <div>
            <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">
              A personal archive
            </p>
            <h1 className="mt-3 max-w-[24ch] font-[family-name:var(--font-newsreader)] text-[clamp(1.75rem,3vw,2.6rem)] font-normal leading-[1.1] tracking-[-0.015em] text-[var(--color-ink)]">
              Notes on attention, work, and slow mornings.
            </h1>
          </div>
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-subtle)] max-[640px]:mt-2">
            {nowLabel} · {posts.length} pieces
          </p>
        </div>
      </section>

      {heroPost ? (
        <section className="border-b border-[var(--color-hairline)] px-6 max-[640px]:px-4">
          <div className="mx-auto w-[min(100%,1200px)]">
            <PostCard post={heroPost} priority variant="feature" />
          </div>
        </section>
      ) : null}

      <section className="px-6 py-[clamp(56px,8vw,110px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1200px)]">
          <div className="mb-10 flex items-end justify-between gap-4 max-[640px]:flex-col max-[640px]:items-start">
            <h2 className="font-[family-name:var(--font-newsreader)] text-[clamp(1.75rem,3vw,2.4rem)] font-normal leading-none tracking-[-0.015em] text-[var(--color-ink)]">
              Recent writing
            </h2>
            <Link
              href="/blog"
              className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
            >
              View the full archive →
            </Link>
          </div>
          <PostGrid
            posts={remainingPosts}
            emptyTitle="No essays yet"
            emptyDescription="Recent writing will appear here as it is published."
          />
        </div>
      </section>

      <section className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] px-6 py-[clamp(56px,7vw,96px)] max-[640px]:px-4">
        <div className="mx-auto grid w-[min(100%,1200px)] grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-[clamp(32px,5vw,72px)] max-[900px]:grid-cols-1">
          <div>
            <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Wander
            </p>
            <h2 className="mt-4 max-w-[20ch] font-[family-name:var(--font-newsreader)] text-[clamp(1.9rem,3.2vw,2.8rem)] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--color-ink)]">
              By category, or as a longer journey.
            </h2>
            <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.65] text-[var(--color-muted)]">
              Pieces group naturally by topic. When several belong to the same
              thread of thinking, they become a series you can read slowly.
            </p>
          </div>
          <div className="grid gap-8">
            <div>
              <p className="mb-4 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                Categories
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="group flex items-baseline gap-2 text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
                  >
                    <span className="font-[family-name:var(--font-newsreader)] text-xl leading-none">
                      {category.name}
                    </span>
                    <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[var(--color-subtle)]">
                      {category.posts.length}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                Series
              </p>
              {seriesList.length > 0 ? (
                <ul className="grid gap-2">
                  {seriesList.map((series) => (
                    <li key={series.id}>
                      <Link
                        href={`/series/${series.slug}`}
                        className="group grid grid-cols-[1fr_auto] items-baseline gap-4 border-t border-[var(--color-hairline)] py-3 text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
                      >
                        <span className="font-[family-name:var(--font-newsreader)] text-lg leading-tight">
                          {series.title}
                        </span>
                        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                          {series.posts.length} pieces
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--color-muted)]">
                  Series will appear here as connected posts are published.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
