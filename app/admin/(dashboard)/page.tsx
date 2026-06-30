import Link from "next/link";
import { PostStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [postCount, draftCount, publishedCount, subscriberCount, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: PostStatus.DRAFT } }),
      prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
      prisma.newsletterSubscriber.count(),
      prisma.post.findMany({
        include: {
          category: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
      }),
    ]);

  const stats = [
    { label: "All Posts", value: postCount },
    { label: "Published", value: publishedCount },
    { label: "Drafts", value: draftCount },
    { label: "Subscribers", value: subscriberCount },
  ];

  return (
    <section>
      <div className="flex items-start justify-between gap-6 max-[700px]:grid">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
            Dashboard
          </p>
          <h1 className="mt-3 font-fraunces text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-none tracking-normal">
            Content desk
          </h1>
        </div>
        <Link
          className="bg-[#191817] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#fffdf9] transition hover:bg-[#717a51]"
          href="/admin/posts/new"
        >
          New Post
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-4 gap-3 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
        {stats.map((stat) => (
          <article
            className="border border-[#d9cec1] bg-[#fffaf2] p-5"
            key={stat.label}
          >
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6f6962]">
              {stat.label}
            </p>
            <p className="mt-5 font-fraunces text-5xl font-medium">
              {stat.value}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-10 border border-[#d9cec1] bg-[#fffaf2]">
        <div className="flex items-center justify-between border-b border-[#d9cec1] px-5 py-4">
          <h2 className="font-fraunces text-3xl font-medium">Recent posts</h2>
          <Link
            className="text-sm font-black uppercase tracking-[0.14em] text-[#717a51] hover:text-[#191817]"
            href="/admin/posts"
          >
            Manage
          </Link>
        </div>
        <div className="divide-y divide-[#d9cec1]">
          {recentPosts.map((post) => (
            <article
              className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 max-[640px]:grid-cols-1"
              key={post.id}
            >
              <div>
                <p className="font-fraunces text-2xl font-medium">
                  {post.title}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#6f6962]">
                  {post.category.name} / {post.status.toLowerCase()}
                </p>
              </div>
              <Link
                className="self-center border border-[#191817] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-[#191817] hover:text-[#fffdf9]"
                href={`/admin/posts/${post.id}/edit`}
              >
                Edit
              </Link>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
