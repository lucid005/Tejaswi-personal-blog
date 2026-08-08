import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PostGrid from "@/components/PostGrid";
import SectionHeading from "@/components/SectionHeading";
import { searchPosts } from "@/lib/posts";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search — Tejaswi",
  description: "Search essays, notes, categories, and tags.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const posts = await searchPosts(query);

  return (
    <PageShell>
      <section className="px-6 py-[clamp(40px,6vw,84px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1200px)]">
          <SectionHeading
            eyebrow="Search"
            title={query ? `Results for “${query}”` : "Search the archive"}
            description="Find essays and notes by title, description, category, or tag."
          />

          <form
            action="/search"
            role="search"
            className="mb-[clamp(36px,5vw,64px)] grid max-w-[720px] grid-cols-[1fr_auto] gap-2 border-b border-[var(--color-ink)] pb-3 max-[560px]:grid-cols-1"
          >
            <label className="sr-only" htmlFor="search-page-input">
              Search posts
            </label>
            <input
              id="search-page-input"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Essays, notes, tags…"
              className="h-12 border-0 bg-transparent font-[family-name:var(--font-newsreader)] text-[clamp(1.4rem,2.4vw,1.8rem)] tracking-[-0.01em] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-subtle)]"
            />
            <button
              type="submit"
              className="h-12 cursor-pointer bg-[var(--color-ink)] px-6 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-paper)] transition hover:bg-[var(--color-accent)]"
            >
              Search
            </button>
          </form>

          <PostGrid
            posts={posts}
            emptyTitle={query ? "No matching posts" : "Nothing searched yet"}
            emptyDescription={
              query
                ? "Try a different title, category, or tag."
                : "Enter a search term to explore the archive."
            }
          />
        </div>
      </section>
    </PageShell>
  );
}
