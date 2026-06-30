import { prisma } from "@/lib/prisma";

export default async function AdminSeriesPage() {
  const seriesList = await prisma.series.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  return (
    <section>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
        Series
      </p>
      <h1 className="mt-3 font-fraunces text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-none tracking-normal">
        Collections
      </h1>
      <div className="mt-10 grid gap-3">
        {seriesList.map((series) => (
          <article
            className="grid grid-cols-[1fr_auto] gap-4 border border-[#d9cec1] bg-[#fffaf2] p-5 max-[640px]:grid-cols-1"
            key={series.id}
          >
            <div>
              <h2 className="font-fraunces text-3xl font-medium">
                {series.title}
              </h2>
              <p className="mt-2 text-sm font-semibold text-[#6f6962]">
                /{series.slug}
              </p>
              {series.description ? (
                <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#625c52]">
                  {series.description}
                </p>
              ) : null}
            </div>
            <p className="self-center text-sm font-black uppercase tracking-[0.14em] text-[#717a51]">
              {series._count.posts} posts
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
