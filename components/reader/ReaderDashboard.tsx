import Link from "next/link";
import { formatPostDate } from "@/lib/posts";

type DashboardPost = {
  slug: string;
  title: string;
  shortDescription: string;
  publishedAt: Date | null;
};

type SavedPostItem = {
  id: string;
  createdAt: Date;
  post: DashboardPost;
};

type ReadingHistoryItem = {
  id: string;
  lastReadAt: Date;
  post: DashboardPost;
};

type ReactionItem = {
  id: string;
  type: string;
  createdAt: Date;
  post: DashboardPost;
};

type CommentItem = {
  id: string;
  content: string;
  status: string;
  createdAt: Date;
  post: DashboardPost;
};

const reactionLabels: Record<string, string> = {
  LIKE: "Liked",
  THOUGHTFUL: "Thoughtful",
  USEFUL: "Useful",
  INSPIRING: "Inspiring",
  RELATABLE: "Relatable",
};

function Column({
  eyebrow,
  title,
  emptyText,
  items,
}: {
  eyebrow: string;
  title: string;
  emptyText: string;
  items: { key: string; href: string; title: string; body: string; meta: string }[];
}) {
  return (
    <section className="border border-[var(--color-hairline)] bg-[var(--color-paper)] p-6">
      <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-newsreader)] text-[clamp(1.6rem,2.4vw,2rem)] font-normal leading-[1.1] tracking-[-0.01em] text-[var(--color-ink)]">
        {title}
      </h2>
      <div className="mt-5">
        {items.length > 0 ? (
          <ul>
            {items.map((item) => (
              <li
                key={item.key}
                className="border-t border-[var(--color-hairline)] py-4 first:border-t-0 first:pt-0"
              >
                <Link
                  href={item.href}
                  className="font-[family-name:var(--font-newsreader)] text-xl leading-tight text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
                >
                  {item.title}
                </Link>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
                  {item.body}
                </p>
                <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                  {item.meta}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-[15px] leading-7 text-[var(--color-muted)]">
            {emptyText}
          </p>
        )}
      </div>
    </section>
  );
}

export default function ReaderDashboard({
  comments,
  history,
  reactions,
  savedPosts,
}: {
  comments: CommentItem[];
  history: ReadingHistoryItem[];
  reactions: ReactionItem[];
  savedPosts: SavedPostItem[];
}) {
  return (
    <div className="grid gap-6">
      <section className="flex items-baseline justify-between gap-6 border-b border-[var(--color-hairline)] pb-6 max-[640px]:flex-col max-[640px]:items-start">
        <p className="max-w-[52ch] text-[15px] leading-7 text-[var(--color-muted)]">
          Reading itself is always free. Save, react, and comment when you want
          a place to come back to.
        </p>
        <Link
          href="/login/settings"
          className="inline-grid h-10 place-items-center border border-[var(--color-ink)] px-4 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
        >
          Account settings
        </Link>
      </section>

      <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1">
        <Column
          eyebrow="Saved"
          title="Your bookmarks"
          emptyText="Saved pieces will show here once you save them."
          items={savedPosts.map(({ id, post }) => ({
            key: id,
            href: `/blog/${post.slug}`,
            title: post.title,
            body: post.shortDescription,
            meta: formatPostDate(post.publishedAt),
          }))}
        />

        <Column
          eyebrow="Reacted to"
          title="What struck you"
          emptyText="Pieces you react to will show here."
          items={reactions.map(({ id, type, post }) => ({
            key: id,
            href: `/blog/${post.slug}`,
            title: post.title,
            body: post.shortDescription,
            meta: reactionLabels[type] ?? type,
          }))}
        />

        <Column
          eyebrow="Commented"
          title="Your notes"
          emptyText="Notes you leave on pieces will show here."
          items={comments.map(({ id, content, status, post }) => ({
            key: id,
            href: `/blog/${post.slug}`,
            title: post.title,
            body: content,
            meta:
              status === "PENDING"
                ? "Awaiting approval"
                : status === "HIDDEN"
                  ? "Hidden"
                  : "Published",
          }))}
        />

        <Column
          eyebrow="Recently opened"
          title="Where you have been"
          emptyText="Recently opened pieces will show here."
          items={history.map(({ id, lastReadAt, post }) => ({
            key: id,
            href: `/blog/${post.slug}`,
            title: post.title,
            body: post.shortDescription,
            meta: `Opened ${formatPostDate(lastReadAt)}`,
          }))}
        />
      </div>
    </div>
  );
}
