import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PostGrid from "@/components/PostGrid";
import SectionHeading from "@/components/SectionHeading";
import { getPostsByTagSlug } from "@/lib/posts";

type TagPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getPostsByTagSlug(slug);

  return {
    title: `${tag.name} | Tejaswi Blog`,
    description: `Browse posts tagged ${tag.name} from Tejaswi Blog.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getPostsByTagSlug(slug);

  return (
    <PageShell>
      <section className="px-6 py-[clamp(36px,7vw,92px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1250px)]">
          <SectionHeading
            eyebrow="Tag"
            title={tag.name}
            description="A focused view of posts connected by this tag."
          />
          <PostGrid
            emptyDescription="Posts with this tag will appear here once published."
            posts={tag.posts}
          />
        </div>
      </section>
    </PageShell>
  );
}
