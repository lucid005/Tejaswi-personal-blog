import Link from "next/link";
import PostForm from "@/components/admin/PostForm";
import { prisma } from "@/lib/prisma";
import { createPostAction } from "../actions";

export default async function NewPostPage() {
  const [categories, tags, seriesList] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.series.findMany({ orderBy: { title: "asc" } }),
  ]);

  return (
    <section>
      <Link
        className="text-sm font-black uppercase tracking-[0.14em] text-[#717a51] hover:text-[#191817]"
        href="/admin/posts"
      >
        Back to posts
      </Link>
      <div className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
          New Post
        </p>
        <h1 className="mt-3 font-fraunces text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-none tracking-normal">
          Write
        </h1>
      </div>
      <div className="mt-10">
        <PostForm
          action={createPostAction}
          categories={categories}
          mode="create"
          seriesList={seriesList}
          tags={tags}
        />
      </div>
    </section>
  );
}
