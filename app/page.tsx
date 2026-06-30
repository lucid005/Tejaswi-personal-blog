import Link from "next/link";
import PageShell from "@/components/PageShell";
import PostCard from "@/components/PostCard";
import PostGrid from "@/components/PostGrid";
import SectionHeading from "@/components/SectionHeading";
import {
  getCategoriesWithPosts,
  getFeaturedPost,
  getPublishedPosts,
  getSeriesList,
} from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [posts, featuredPost, categories, seriesList] = await Promise.all([
    getPublishedPosts(),
    getFeaturedPost(),
    getCategoriesWithPosts(),
    getSeriesList(),
  ]);

  const heroPost = featuredPost ?? posts[0];
  const remainingPosts = heroPost
    ? posts.filter((post) => post.id !== heroPost.id)
    : posts;

  return (
    <PageShell>
      <section className="px-6 pb-[clamp(44px,7vw,92px)] pt-[clamp(24px,5vw,58px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1250px)]">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(260px,0.38fr)] gap-[clamp(28px,5vw,76px)] border-t border-[#d8ccbd] pt-[clamp(34px,5vw,72px)] max-[900px]:grid-cols-1">
            <SectionHeading
              eyebrow="Personal archive"
              title="Quiet writing for slow attention."
              description="Essays, project notes, small observations, and behind-the-scenes thinking from Tejaswi."
            />
            <aside className="self-end border-l border-[#d8ccbd] pl-6 text-[0.95rem] font-semibold leading-7 text-[#625c55] max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pl-0 max-[900px]:pt-5">
              <p>
                Read freely. Save, react, and build a personal reading memory
                later when authentication is added.
              </p>
              <Link
                className="mt-5 inline-block border-b border-[#717a51] pb-1 text-sm font-extrabold uppercase text-[#4f5740] transition hover:text-[#191817]"
                href="/blog"
              >
                Browse all posts
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-6 pb-[clamp(58px,8vw,110px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1250px)]">
          {heroPost ? (
            <PostCard post={heroPost} priority variant="feature" />
          ) : (
            <PostGrid posts={[]} />
          )}
        </div>
      </section>

      <section className="px-6 pb-[clamp(72px,10vw,140px)] max-[640px]:px-4">
        <div className="mx-auto w-[min(100%,1250px)]">
          <div className="mb-7 flex items-end justify-between gap-6 max-[700px]:block">
            <div>
              <p className="mb-2 text-[0.78rem] font-extrabold uppercase text-[#717a51]">
                Recently publisheds
              </p>
              <h2 className="font-fraunces text-[clamp(2rem,4vw,4.2rem)] font-medium leading-none">
                Latest from the archive
              </h2>
            </div>
            <Link
              className="text-sm font-extrabold uppercase text-[#4f5740] underline-offset-4 hover:underline max-[700px]:mt-4 max-[700px]:inline-block"
              href="/blog"
            >
              View all
            </Link>
          </div>
          <PostGrid posts={remainingPosts} />
        </div>
      </section>

      <section className="border-y border-[#d9cec1] bg-[#f1e8dc] px-6 py-[clamp(52px,7vw,90px)] max-[640px]:px-4">
        <div className="mx-auto grid w-[min(100%,1250px)] grid-cols-[0.75fr_1fr] gap-[clamp(30px,5vw,72px)] max-[900px]:grid-cols-1">
          <div>
            <p className="mb-2 text-[0.78rem] font-extrabold uppercase text-[#717a51]">
              Browse
            </p>
            <h2 className="font-fraunces text-[clamp(2rem,4vw,4.2rem)] font-medium leading-none">
              Categories and journeys
            </h2>
          </div>
          <div className="grid gap-8">
            <div className="flex flex-wrap gap-2.5">
              {categories.map((category) => (
                <Link
                  className="border border-[#c6b9a8] px-3 py-2 text-sm font-bold text-[#565047] transition hover:border-[#717a51] hover:text-[#191817]"
                  href={`/category/${category.slug}`}
                  key={category.id}
                >
                  {category.name} ({category.posts.length})
                </Link>
              ))}
            </div>
            <div className="grid gap-3 border-t border-[#d8ccbd] pt-6">
              {seriesList.length > 0 ? (
                seriesList.map((series) => (
                  <Link
                    className="grid grid-cols-[1fr_auto] gap-4 py-2 font-semibold text-[#625c55] transition hover:text-[#191817] max-[640px]:grid-cols-1"
                    href={`/series/${series.slug}`}
                    key={series.id}
                  >
                    <span>{series.title}</span>
                    <span>{series.posts.length} posts</span>
                  </Link>
                ))
              ) : (
                <p className="font-semibold text-[#625c55]">
                  Series will appear here as connected posts are published.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
