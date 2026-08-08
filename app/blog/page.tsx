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
  title: "Archive — Tejaswi",
  description: "Every published essay, note, and observation.",
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
      <section className="px-6 py-[clamp(40px,6vw,84px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1200px)]">
          <SectionHeading
            eyebrow="Full archive"
            title="Every piece of writing, in one place."
            description="Filter by category, tag, or reading time. Sorted newest first by default."
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
