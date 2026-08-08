import Image from "next/image";
import Link from "next/link";
import PostMeta from "@/components/PostMeta";
import { PublicPost, getPostHref } from "@/lib/posts";

type PostCardProps = {
  post: PublicPost;
  priority?: boolean;
  variant?: "default" | "feature" | "compact";
};

function coverImageFor(post: PublicPost) {
  if (post.coverImageUrl) return post.coverImageUrl;
  return `https://picsum.photos/seed/${encodeURIComponent(post.slug)}/1200/800`;
}

export default function PostCard({
  post,
  priority = false,
  variant = "default",
}: PostCardProps) {
  const href = getPostHref(post);

  if (variant === "compact") {
    return (
      <article className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-b border-[var(--color-hairline)] py-4 max-[640px]:grid-cols-[1fr_auto]">
        <time
          dateTime={post.publishedAt?.toISOString()}
          className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)] max-[640px]:hidden"
        >
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              })
            : "—"}
        </time>
        <Link
          href={href}
          className="min-w-0 font-[family-name:var(--font-newsreader)] text-xl leading-snug tracking-[-0.005em] text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
        >
          {post.title}
        </Link>
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
          {post.readingTimeMinutes} min
        </span>
      </article>
    );
  }

  if (variant === "feature") {
    return (
      <article className="grid grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] items-center gap-[clamp(28px,4vw,60px)] py-[clamp(24px,4vw,44px)] max-[900px]:grid-cols-1">
        <Link
          href={href}
          aria-label={`Read ${post.title}`}
          className="group block overflow-hidden bg-[var(--color-surface)]"
        >
          <div className="relative aspect-[1.5] w-full overflow-hidden">
            <Image
              src={coverImageFor(post)}
              alt=""
              fill
              priority={priority}
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 900px) 100vw, 55vw"
            />
          </div>
        </Link>
        <div className="max-w-[560px]">
          <PostMeta post={post} />
          <h2 className="mt-4 font-[family-name:var(--font-newsreader)] text-[clamp(2rem,4.4vw,4.2rem)] font-normal leading-[1.02] tracking-[-0.015em] text-[var(--color-ink)]">
            <Link
              href={href}
              className="transition hover:text-[var(--color-accent)]"
            >
              {post.title}
            </Link>
          </h2>
          <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-[1.65] text-[var(--color-muted)]">
            {post.shortDescription}
          </p>
          <Link
            href={href}
            className="mt-6 inline-flex items-baseline gap-2 border-b border-[var(--color-ink)] pb-1 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Read essay <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group min-w-0">
      <Link
        href={href}
        aria-label={`Read ${post.title}`}
        className="block overflow-hidden bg-[var(--color-surface)]"
      >
        <div className="relative aspect-[1.3] w-full overflow-hidden">
          <Image
            src={coverImageFor(post)}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="pt-5">
        <PostMeta compact post={post} />
        <h2 className="mt-3 font-[family-name:var(--font-newsreader)] text-[clamp(1.4rem,2vw,1.85rem)] font-normal leading-[1.15] tracking-[-0.01em] text-[var(--color-ink)]">
          <Link
            href={href}
            className="transition hover:text-[var(--color-accent)]"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 max-w-[55ch] text-[15px] leading-[1.6] text-[var(--color-muted)]">
          {post.shortDescription}
        </p>
      </div>
    </article>
  );
}
