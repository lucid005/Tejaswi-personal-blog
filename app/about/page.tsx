import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PostCard from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Tejaswi",
  description:
    "About Tejaswi, and the reasons this blog exists — essays, reflections, projects, and reading notes.",
};

const focus = [
  {
    label: "Essays",
    body: "On attention, work habits, and the quieter moments in a day.",
  },
  {
    label: "Reading notes",
    body: "What a book or a paragraph left behind, kept short.",
  },
  {
    label: "Projects",
    body: "Learning logs, small experiments, and things I am building.",
  },
  {
    label: "Series",
    body: "Threads of thinking that grew across several posts.",
  },
];

export default async function AboutPage() {
  const posts = await getPublishedPosts(3);

  return (
    <PageShell>
      <section className="px-6 pt-[clamp(48px,7vw,110px)] pb-[clamp(48px,7vw,90px)] max-[640px]:px-4">
        <div className="mx-auto grid w-[min(100%,1100px)] grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)] gap-[clamp(32px,5vw,80px)] items-start max-[900px]:grid-cols-1">
          <div>
            <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
              About
            </p>
            <h1 className="mt-5 max-w-[16ch] font-[family-name:var(--font-newsreader)] text-[clamp(2.6rem,6vw,5.4rem)] font-normal leading-[1.02] tracking-[-0.02em] text-[var(--color-ink)]">
              A quiet place to think in public.
            </h1>
            <div className="mt-8 grid gap-6 max-w-[60ch] font-[family-name:var(--font-newsreader)] text-[1.15rem] leading-[1.7] text-[var(--color-ink)]">
              <p>
                This is a personal archive by Tejaswi. Essays, reading notes,
                project logs, and small observations, kept in one place so they
                can be found later.
              </p>
              <p className="text-[var(--color-muted)]">
                Reading is always free. Save, react, comment, or come back to a
                reading history — those live behind a small sign-in, only when
                you want them.
              </p>
            </div>
          </div>

          <aside className="border border-[var(--color-hairline)] bg-[var(--color-surface)] p-6">
            <div className="grid aspect-[0.9] place-items-center border border-[var(--color-hairline)] bg-[var(--color-paper)]">
              <div className="text-center">
                <p className="font-[family-name:var(--font-newsreader)] text-[clamp(3.5rem,8vw,6rem)] leading-none text-[var(--color-ink)]">
                  T
                </p>
                <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">
                  Portrait — coming soon
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-[var(--color-muted)]">
              A real photo will land here without changing the layout.
            </p>
          </aside>
        </div>
      </section>

      <section className="border-t border-[var(--color-hairline)] px-6 py-[clamp(48px,7vw,96px)] max-[640px]:px-4">
        <div className="mx-auto grid w-[min(100%,1100px)] grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] gap-[clamp(32px,5vw,72px)] max-[900px]:grid-cols-1">
          <h2 className="max-w-[14ch] font-[family-name:var(--font-newsreader)] text-[clamp(1.8rem,3vw,2.6rem)] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--color-ink)]">
            What lives here
          </h2>
          <div>
            {focus.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[160px_1fr] gap-6 border-t border-[var(--color-hairline)] py-5 first:border-t-0 first:pt-0 last:pb-0 max-[640px]:grid-cols-1"
              >
                <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
                  {item.label}
                </p>
                <p className="max-w-[52ch] font-[family-name:var(--font-newsreader)] text-[1.1rem] leading-[1.6] text-[var(--color-ink)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {posts.length > 0 ? (
        <section className="border-t border-[var(--color-hairline)] px-6 py-[clamp(48px,7vw,96px)] max-[640px]:px-4">
          <div className="mx-auto w-[min(100%,1200px)]">
            <div className="mb-10 flex items-end justify-between gap-4 max-[640px]:flex-col max-[640px]:items-start">
              <h2 className="font-[family-name:var(--font-newsreader)] text-[clamp(1.7rem,3vw,2.4rem)] font-normal leading-none tracking-[-0.015em] text-[var(--color-ink)]">
                A few pieces to start with
              </h2>
              <Link
                href="/blog"
                className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-x-[clamp(24px,3vw,40px)] gap-y-12 max-[1000px]:grid-cols-2 max-[680px]:grid-cols-1">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] px-6 py-[clamp(48px,7vw,96px)] max-[640px]:px-4">
        <div className="mx-auto grid w-[min(100%,1100px)] grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] gap-[clamp(32px,5vw,72px)] max-[900px]:grid-cols-1">
          <div>
            <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Get in touch
            </p>
            <h2 className="mt-4 max-w-[14ch] font-[family-name:var(--font-newsreader)] text-[clamp(1.8rem,3vw,2.6rem)] font-normal leading-[1.05] tracking-[-0.015em] text-[var(--color-ink)]">
              Say hello — I read everything.
            </h2>
          </div>
          <ul className="grid gap-4 self-end font-[family-name:var(--font-newsreader)] text-lg text-[var(--color-ink)]">
            <li className="flex items-baseline justify-between gap-4 border-t border-[var(--color-hairline)] pt-3">
              <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                Email
              </span>
              <span>hello@tejaswi.blog</span>
            </li>
            <li className="flex items-baseline justify-between gap-4 border-t border-[var(--color-hairline)] pt-3">
              <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
                Elsewhere
              </span>
              <span>@tejaswi</span>
            </li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
