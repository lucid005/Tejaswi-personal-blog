import Image from "next/image";
import Link from "next/link";
import PostMeta from "@/components/PostMeta";
import { PublicPost, getPostHref } from "@/lib/posts";

type PostCardProps = {
  post: PublicPost;
  priority?: boolean;
  variant?: "default" | "feature" | "compact";
};

export default function PostCard({
  post,
  priority = false,
  variant = "default",
}: PostCardProps) {
  const isFeature = variant === "feature";
  const href = getPostHref(post);

  return (
    <article
      className={
        isFeature
          ? "grid min-w-0 grid-cols-[minmax(0,1.16fr)_minmax(300px,0.84fr)] items-end gap-[clamp(28px,4vw,58px)] border-y border-[#d8ccbd] py-[clamp(24px,4vw,44px)] max-[900px]:grid-cols-1"
          : "min-w-0 border-t border-[#d8ccbd] pt-4"
      }
    >
      <Link
        className={`group block overflow-hidden bg-[#ede1d3] ${
          isFeature ? "aspect-[1.55]" : "aspect-[1.18]"
        }`}
        href={href}
        aria-label={`Read ${post.title}`}
      >
        <Image
          src={post.coverImageUrl || "/blog-desk.png"}
          width={900}
          height={650}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015] group-hover:saturate-[1.03]"
          priority={priority}
          sizes={
            isFeature
              ? "(max-width: 900px) 100vw, 58vw"
              : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          }
        />
      </Link>

      <div className={isFeature ? "max-w-[590px]" : "pt-4"}>
        <PostMeta compact={!isFeature} post={post} />
        <h2
          className={`font-fraunces font-medium leading-[1.02] tracking-normal ${
            isFeature
              ? "mt-4 text-[clamp(2.25rem,5vw,5.4rem)]"
              : "mt-3 text-[clamp(1.45rem,2.2vw,2.05rem)]"
          }`}
        >
          <Link className="transition hover:text-[#596345]" href={href}>
            {post.title}
          </Link>
        </h2>
        <p
          className={`mt-4 max-w-[620px] font-semibold leading-[1.5] text-[#66605a] ${
            isFeature ? "text-[1.05rem]" : "text-[0.98rem]"
          }`}
        >
          {post.shortDescription}
        </p>

        {post.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.slice(0, isFeature ? 4 : 3).map(({ tag }) => (
              <Link
                className="border border-[#c6b9a8] px-2.5 py-1 text-[0.74rem] font-bold uppercase text-[#6f685f] transition hover:border-[#717a51] hover:text-[#4f5740]"
                href={`/tag/${tag.slug}`}
                key={tag.id}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
