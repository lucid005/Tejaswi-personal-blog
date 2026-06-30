import { prisma } from "@/lib/prisma";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
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
        Tags
      </p>
      <h1 className="mt-3 font-fraunces text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-none tracking-normal">
        Index
      </h1>
      <div className="mt-10 flex flex-wrap gap-3">
        {tags.map((tag) => (
          <article
            className="border border-[#d9cec1] bg-[#fffaf2] px-5 py-4"
            key={tag.id}
          >
            <h2 className="font-fraunces text-2xl font-medium">{tag.name}</h2>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.14em] text-[#717a51]">
              {tag._count.posts} posts
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
