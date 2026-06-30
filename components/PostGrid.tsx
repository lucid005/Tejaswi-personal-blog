import PostCard from "@/components/PostCard";
import { PublicPost } from "@/lib/posts";

type PostGridProps = {
  posts: PublicPost[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function PostGrid({
  posts,
  emptyTitle = "No posts yet",
  emptyDescription = "Published writing will appear here when it is ready.",
}: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="border-y border-[#d8ccbd] py-12 text-center">
        <h2 className="font-fraunces text-3xl font-medium">{emptyTitle}</h2>
        <p className="mx-auto mt-3 max-w-[520px] font-semibold leading-7 text-[#66605a]">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-x-[clamp(22px,3vw,38px)] gap-y-[clamp(42px,5vw,72px)] max-[1000px]:grid-cols-2 max-[680px]:grid-cols-1">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
