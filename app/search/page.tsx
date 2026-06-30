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
  title: "Search | Tejaswi Blog",
  description: "Search Tejaswi Blog by title, description, category, or tag.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const posts = await searchPosts(query);

  return (
    <PageShell>
      <section className="px-6 py-[clamp(36px,7vw,92px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1250px)]">
          <SectionHeading
            eyebrow="Search"
            title={query ? `Results for "${query}"` : "Search the archive"}
            description="Search by title, short description, category, or tag."
          />

          <form
            action="/search"
            className="mb-[clamp(36px,5vw,64px)] grid max-w-[760px] grid-cols-[1fr_auto] gap-2.5 max-[640px]:grid-cols-1"
            role="search"
          >
            <label className="sr-only" htmlFor="search-page-input">
              Search posts
            </label>
            <input
              className="min-h-[54px] border border-[#a89f93] bg-transparent px-4 text-[#191817] outline-none placeholder:text-[#827970] focus:border-[#5f6944] focus:shadow-[0_0_0_3px_rgba(113,122,81,0.18)]"
              defaultValue={query}
              id="search-page-input"
              name="q"
              placeholder="Search essays, tags, categories"
              type="search"
            />
            <button
              className="min-h-[54px] cursor-pointer bg-[#717a51] px-6 text-sm font-extrabold uppercase text-[#fffdf9] transition hover:bg-[#5f6944] active:translate-y-px"
              type="submit"
            >
              Search
            </button>
          </form>

          <PostGrid
            emptyDescription={
              query
                ? "Try a different title, category, or tag."
                : "Enter a search term to explore the archive."
            }
            emptyTitle={query ? "No matching posts" : "No search yet"}
            posts={posts}
          />
        </div>
      </section>
    </PageShell>
  );
}
