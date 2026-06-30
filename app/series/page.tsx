import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/SectionHeading";
import { getSeriesList } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Series | Tejaswi Blog",
  description: "Browse connected writing journeys from Tejaswi Blog.",
};

export default async function SeriesPage() {
  const seriesList = await getSeriesList();

  return (
    <PageShell>
      <section className="px-6 py-[clamp(36px,7vw,92px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1100px)]">
          <SectionHeading
            eyebrow="Journeys"
            title="Series"
            description="Connected posts grouped into slower reading paths."
          />

          <div className="grid gap-4">
            {seriesList.length > 0 ? (
              seriesList.map((series) => (
                <Link
                  className="grid grid-cols-[1fr_auto] gap-6 border-t border-[#d8ccbd] py-6 transition hover:text-[#4f5740] max-[700px]:grid-cols-1"
                  href={`/series/${series.slug}`}
                  key={series.id}
                >
                  <span>
                    <span className="block font-fraunces text-[clamp(1.7rem,3vw,3rem)] font-medium leading-none">
                      {series.title}
                    </span>
                    {series.description ? (
                      <span className="mt-3 block max-w-[720px] font-semibold leading-7 text-[#625c55]">
                        {series.description}
                      </span>
                    ) : null}
                  </span>
                  <span className="self-start text-sm font-extrabold uppercase text-[#717a51]">
                    {series.posts.length} posts
                  </span>
                </Link>
              ))
            ) : (
              <div className="border-y border-[#d8ccbd] py-12 text-center">
                <h2 className="font-fraunces text-3xl font-medium">
                  No series yet
                </h2>
                <p className="mx-auto mt-3 max-w-[520px] font-semibold leading-7 text-[#66605a]">
                  Series will appear here once connected posts are published.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
