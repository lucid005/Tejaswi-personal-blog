import Link from "next/link";
import { formatPostDate } from "@/lib/posts";

type SavedPostItem = {
  id: string;
  createdAt: Date;
  post: {
    slug: string;
    title: string;
    shortDescription: string;
    publishedAt: Date | null;
  };
};

type ReadingHistoryItem = {
  id: string;
  lastReadAt: Date;
  post: {
    slug: string;
    title: string;
    shortDescription: string;
  };
};

function Column({
  eyebrow,
  title,
  emptyText,
  children,
}: {
  eyebrow: string;
  title: string;
  emptyText: string;
  children: React.ReactNode;
  hasItems?: boolean;
}) {
  return (
    <section className="border border-[var(--color-hairline)] bg-[var(--color-paper)] p-6">
      <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-newsreader)] text-[clamp(1.6rem,2.4vw,2rem)] font-normal leading-[1.1] tracking-[-0.01em] text-[var(--color-ink)]">
        {title}
      </h2>
      <div className="mt-5">{children || (
        <p className="py-6 text-[15px] leading-7 text-[var(--color-muted)]">
          {emptyText}
        </p>
      )}</div>
    </section>
  );
}

export default function ReaderDashboard({
  history,
  savedPosts,
}: {
  history: ReadingHistoryItem[];
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
          emptyText="Saved pieces will show here once you bookmark them."
        >
          {savedPosts.length > 0 ? (
            <ul>
              {savedPosts.map(({ post }) => (
                <li key={post.slug} className="border-t border-[var(--color-hairline)] py-4 first:border-t-0 first:pt-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-[family-name:var(--font-newsreader)] text-xl leading-tight text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
                    {post.shortDescription}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                    {formatPostDate(post.publishedAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </Column>

        <Column
          eyebrow="Continue reading"
          title="Recently opened"
          emptyText="Recently opened pieces will show here."
        >
          {history.length > 0 ? (
            <ul>
              {history.map(({ lastReadAt, post }) => (
                <li key={post.slug} className="border-t border-[var(--color-hairline)] py-4 first:border-t-0 first:pt-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-[family-name:var(--font-newsreader)] text-xl leading-tight text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
                    {post.shortDescription}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                    Opened {formatPostDate(lastReadAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </Column>
      </div>
    </div>
  );
}
