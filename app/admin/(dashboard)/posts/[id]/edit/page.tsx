import { notFound } from "next/navigation";
import Link from "next/link";
import PostForm from "@/components/admin/PostForm";
import { prisma } from "@/lib/prisma";
import { updatePostAction } from "../../actions";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories, tags, seriesList] = await Promise.all([
    prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        tags: true,
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.series.findMany({ orderBy: { title: "asc" } }),
  ]);

  if (!post) {
    notFound();
  }

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
          Edit Post
        </p>
        <h1 className="mt-3 font-fraunces text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-none tracking-normal">
          {post.title}
        </h1>
      </div>
      <div className="mt-10">
        <PostForm
          action={updatePostAction}
          categories={categories}
          mode="edit"
          post={post}
          seriesList={seriesList}
          tags={tags}
        />
      </div>
    </section>
  );
}
