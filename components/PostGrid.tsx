import PostCard from "@/components/PostCard";
import { PublicPost } from "@/lib/posts";

type PostGridProps = {
  posts: PublicPost[];
  emptyTitle?: string;
  emptyDescription?: string;
  columns?: 2 | 3;
};

export default function PostGrid({
  posts,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Published writing will appear here when it is ready.",
  columns = 3,
}: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="border-y border-[var(--color-hairline)] py-16 text-center">
        <h2 className="font-[family-name:var(--font-newsreader)] text-3xl text-[var(--color-ink)]">
          {emptyTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-[42ch] text-[15px] leading-7 text-[var(--color-muted)]">
          {emptyDescription}
        </p>
      </div>
    );
  }

  const gridClass =
    columns === 2
      ? "grid grid-cols-2 gap-x-[clamp(24px,4vw,56px)] gap-y-[clamp(44px,6vw,80px)] max-[720px]:grid-cols-1"
      : "grid grid-cols-3 gap-x-[clamp(24px,3vw,40px)] gap-y-[clamp(44px,6vw,80px)] max-[1000px]:grid-cols-2 max-[680px]:grid-cols-1";

  return (
    <div className={gridClass}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
