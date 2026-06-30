import type { Metadata } from "next";
import ArchiveControls from "@/components/blog/ArchiveControls";
import PageShell from "@/components/PageShell";
import PostGrid from "@/components/PostGrid";
import SectionHeading from "@/components/SectionHeading";
import {
  PublishedPostSort,
  getArchiveFilters,
  getPublishedPosts,
} from "@/lib/posts";

type BlogPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    tag?: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Tejaswi Blog",
  description: "Browse all published writing from Tejaswi Blog.",
};

function getSort(value?: string): PublishedPostSort {
  if (
    value === "newest" ||
    value === "oldest" ||
    value === "title" ||
    value === "reading"
  ) {
    return value;
  }

  return "newest";
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const sort = getSort(params.sort);
  const [{ categories, tags }, posts] = await Promise.all([
    getArchiveFilters(),
    getPublishedPosts({
      category: params.category,
      sort,
      tag: params.tag,
    }),
  ]);

  return (
    <PageShell>
      <section className="px-6 py-[clamp(36px,7vw,92px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1250px)]">
          <SectionHeading
            eyebrow="All posts"
            title="Blog"
            description="A visual index of Tejaswi's essays, notes, projects, and reflections."
          />
          <ArchiveControls
            categories={categories.map((category) => ({
              label: category.name,
              value: category.slug,
            }))}
            currentCategory={params.category}
            currentSort={sort}
            currentTag={params.tag}
            tags={tags.map((tag) => ({
              label: tag.name,
              value: tag.slug,
            }))}
          />
          <PostGrid posts={posts} />
        </div>
      </section>
    </PageShell>
  );
}
