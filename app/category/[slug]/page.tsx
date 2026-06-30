import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PostGrid from "@/components/PostGrid";
import SectionHeading from "@/components/SectionHeading";
import { getPostsByCategorySlug } from "@/lib/posts";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPostsByCategorySlug(slug);

  return {
    title: `${category.name} | Tejaswi Blog`,
    description:
      category.description || `Browse ${category.name} posts from Tejaswi Blog.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getPostsByCategorySlug(slug);

  return (
    <PageShell>
      <section className="px-6 py-[clamp(36px,7vw,92px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1250px)]">
          <SectionHeading
            eyebrow="Category"
            title={category.name}
            description={category.description || "Published writing by category."}
          />
          <PostGrid
            emptyDescription="Posts in this category will appear here once published."
            posts={category.posts}
          />
        </div>
      </section>
    </PageShell>
  );
}
