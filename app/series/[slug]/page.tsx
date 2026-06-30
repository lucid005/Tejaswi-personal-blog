import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PostGrid from "@/components/PostGrid";
import SectionHeading from "@/components/SectionHeading";
import { getSeriesBySlug } from "@/lib/posts";

type SeriesDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: SeriesDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  return {
    title: `${series.title} | Tejaswi Blog`,
    description:
      series.description || `Read the ${series.title} series on Tejaswi Blog.`,
  };
}

export default async function SeriesDetailPage({
  params,
}: SeriesDetailPageProps) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  return (
    <PageShell>
      <section className="px-6 py-[clamp(36px,7vw,92px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1250px)]">
          <SectionHeading
            eyebrow="Series"
            title={series.title}
            description={series.description || "A connected reading journey."}
          />
          <PostGrid
            emptyDescription="Posts in this series will appear here once published."
            posts={series.posts}
          />
        </div>
      </section>
    </PageShell>
  );
}
