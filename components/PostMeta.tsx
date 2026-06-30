import Link from "next/link";
import { PublicPost, formatPostDate } from "@/lib/posts";

type PostMetaProps = {
  post: PublicPost;
  compact?: boolean;
};

export default function PostMeta({ post, compact = false }: PostMetaProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[#706a63] ${
        compact ? "text-[0.78rem]" : "text-[0.86rem]"
      }`}
    >
      <Link
        className="font-bold text-[#4f5740] transition hover:text-[#191817]"
        href={`/category/${post.category.slug}`}
      >
        {post.category.name}
      </Link>
      <span aria-hidden="true">/</span>
      <time dateTime={post.publishedAt?.toISOString()}>
        {formatPostDate(post.publishedAt)}
      </time>
      <span aria-hidden="true">/</span>
      <span>{post.readingTimeMinutes} min read</span>
    </div>
  );
}
