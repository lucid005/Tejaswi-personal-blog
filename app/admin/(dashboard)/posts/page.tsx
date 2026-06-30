import Link from "next/link";
import { formatPostDate } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { deletePostAction } from "./actions";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      category: true,
      series: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <section>
      <div className="flex items-start justify-between gap-6 max-[700px]:grid">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
            Posts
          </p>
          <h1 className="mt-3 font-fraunces text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-none tracking-normal">
            Library
          </h1>
        </div>
        <Link
          className="bg-[#191817] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#fffdf9] transition hover:bg-[#717a51]"
          href="/admin/posts/new"
        >
          New Post
        </Link>
      </div>

      <div className="mt-10 divide-y divide-[#d9cec1] border border-[#d9cec1] bg-[#fffaf2]">
        {posts.map((post) => (
          <article
            className="grid grid-cols-[1fr_auto] gap-5 p-5 max-[760px]:grid-cols-1"
            key={post.id}
          >
            <div>
              <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#717a51]">
                <span>{post.status.toLowerCase()}</span>
                <span>/</span>
                <span>{post.category.name}</span>
                {post.series ? (
                  <>
                    <span>/</span>
                    <span>{post.series.title}</span>
                  </>
                ) : null}
              </div>
              <h2 className="mt-3 font-fraunces text-4xl font-medium leading-tight">
                {post.title}
              </h2>
              <p className="mt-2 max-w-3xl text-base font-semibold leading-7 text-[#625c52]">
                {post.shortDescription}
              </p>
              <p className="mt-4 text-sm font-bold text-[#6f6962]">
                Posted {formatPostDate(post.publishedAt)} / Updated{" "}
                {formatPostDate(post.updatedAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 self-center">
              <Link
                className="border border-[#191817] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-[#191817] hover:text-[#fffdf9]"
                href={`/admin/posts/${post.id}/edit`}
              >
                Edit
              </Link>
              <form action={deletePostAction}>
                <input name="id" type="hidden" value={post.id} />
                <button
                  className="cursor-pointer border border-[#b95742] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#82331f] transition hover:bg-[#82331f] hover:text-[#fffdf9]"
                  type="submit"
                >
                  Delete
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
