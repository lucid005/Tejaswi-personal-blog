import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import SectionHeading from "@/components/SectionHeading";
import { getSeriesList } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Series — Tejaswi",
  description: "Connected writing grouped into slower reading paths.",
};

export default async function SeriesPage() {
  const seriesList = await getSeriesList();

  return (
    <PageShell>
      <section className="px-6 py-[clamp(40px,6vw,84px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,960px)]">
          <SectionHeading
            eyebrow="Reading journeys"
            title="Series"
            description="Connected posts, grouped when they belong to the same thread of thinking."
          />

          {seriesList.length > 0 ? (
            <ul>
              {seriesList.map((series) => (
                <li key={series.id}>
                  <Link
                    href={`/series/${series.slug}`}
                    className="group grid grid-cols-[1fr_auto] items-baseline gap-8 border-t border-[var(--color-hairline)] py-6 transition hover:text-[var(--color-accent)] last:border-b max-[640px]:grid-cols-1"
                  >
                    <div>
                      <span className="block font-[family-name:var(--font-newsreader)] text-[clamp(1.5rem,2.4vw,2rem)] font-normal leading-tight tracking-[-0.01em] text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                        {series.title}
                      </span>
                      {series.description ? (
                        <span className="mt-3 block max-w-[62ch] text-[15px] leading-[1.6] text-[var(--color-muted)]">
                          {series.description}
                        </span>
                      ) : null}
                    </div>
                    <span className="self-start font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                      {series.posts.length} pieces
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-y border-[var(--color-hairline)] py-16 text-center">
              <h2 className="font-[family-name:var(--font-newsreader)] text-3xl text-[var(--color-ink)]">
                No series yet
              </h2>
              <p className="mx-auto mt-3 max-w-[42ch] text-[15px] leading-7 text-[var(--color-muted)]">
                Series appear here once connected posts are published.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
