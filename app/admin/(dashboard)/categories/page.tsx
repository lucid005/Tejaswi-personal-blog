import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <section>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
        Categories
      </p>
      <h1 className="mt-3 font-fraunces text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-none tracking-normal">
        Sections
      </h1>
      <div className="mt-10 grid gap-3">
        {categories.map((category) => (
          <article
            className="grid grid-cols-[1fr_auto] gap-4 border border-[#d9cec1] bg-[#fffaf2] p-5 max-[640px]:grid-cols-1"
            key={category.id}
          >
            <div>
              <h2 className="font-fraunces text-3xl font-medium">
                {category.name}
              </h2>
              <p className="mt-2 text-sm font-semibold text-[#6f6962]">
                /{category.slug}
              </p>
              {category.description ? (
                <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#625c52]">
                  {category.description}
                </p>
              ) : null}
            </div>
            <p className="self-center text-sm font-black uppercase tracking-[0.14em] text-[#717a51]">
              {category._count.posts} posts
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
