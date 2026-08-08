import Link from "next/link";
import { PublicPost, formatPostDate } from "@/lib/posts";

type PostMetaProps = {
  post: PublicPost;
  compact?: boolean;
};

export default function PostMeta({ post, compact = false }: PostMetaProps) {
  const size = compact ? "text-[11px]" : "text-xs";

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--font-geist-mono)] ${size} uppercase tracking-[0.14em] text-[var(--color-muted)]`}
    >
      <Link
        href={`/category/${post.category.slug}`}
        className="text-[var(--color-accent)] transition hover:text-[var(--color-ink)]"
      >
        {post.category.name}
      </Link>
      <span aria-hidden="true" className="text-[var(--color-hairline)]">
        /
      </span>
      <time dateTime={post.publishedAt?.toISOString()}>
        {formatPostDate(post.publishedAt)}
      </time>
      <span aria-hidden="true" className="text-[var(--color-hairline)]">
        /
      </span>
      <span>{post.readingTimeMinutes} min</span>
    </div>
  );
}
