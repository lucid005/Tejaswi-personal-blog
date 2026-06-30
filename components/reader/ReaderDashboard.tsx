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

export default function ReaderDashboard({
  history,
  savedPosts,
}: {
  history: ReadingHistoryItem[];
  savedPosts: SavedPostItem[];
}) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-5 max-[900px]:grid-cols-1">
      <section className="border border-[#d9cec1] bg-[#fffaf2] p-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
          Saved
        </p>
        <h2 className="mt-2 font-fraunces text-4xl font-medium">Your posts</h2>
        <div className="mt-5 divide-y divide-[#d9cec1]">
          {savedPosts.length > 0 ? (
            savedPosts.map(({ post }) => (
              <article className="py-4" key={post.slug}>
                <Link
                  className="font-fraunces text-2xl font-medium transition hover:text-[#596345]"
                  href={`/blog/${post.slug}`}
                >
                  {post.title}
                </Link>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#625c55]">
                  {post.shortDescription}
                </p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#717a51]">
                  {formatPostDate(post.publishedAt)}
                </p>
              </article>
            ))
          ) : (
            <p className="py-5 font-semibold leading-7 text-[#625c55]">
              Saved posts will appear here.
            </p>
          )}
        </div>
      </section>

      <section className="border border-[#d9cec1] bg-[#fffaf2] p-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
          History
        </p>
        <h2 className="mt-2 font-fraunces text-4xl font-medium">Recent reads</h2>
        <div className="mt-5 divide-y divide-[#d9cec1]">
          {history.length > 0 ? (
            history.map(({ lastReadAt, post }) => (
              <article className="py-4" key={post.slug}>
                <Link
                  className="font-fraunces text-2xl font-medium transition hover:text-[#596345]"
                  href={`/blog/${post.slug}`}
                >
                  {post.title}
                </Link>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#625c55]">
                  {post.shortDescription}
                </p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#717a51]">
                  Read {formatPostDate(lastReadAt)}
                </p>
              </article>
            ))
          ) : (
            <p className="py-5 font-semibold leading-7 text-[#625c55]">
              Recent reads will appear here.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
