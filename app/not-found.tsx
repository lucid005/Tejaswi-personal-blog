import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section className="grid min-h-[60dvh] place-items-center px-6 py-[clamp(56px,9vw,130px)] text-center max-[640px]:px-4">
        <div className="w-[min(100%,640px)]">
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
            404
          </p>
          <h1 className="mt-6 max-w-[22ch] mx-auto font-[family-name:var(--font-newsreader)] text-[clamp(2.6rem,7vw,5.4rem)] font-normal leading-[1.02] tracking-[-0.02em] text-[var(--color-ink)]">
            This page is not in the archive.
          </h1>
          <p className="mx-auto mt-6 max-w-[52ch] text-[15px] leading-7 text-[var(--color-muted)]">
            The link may be old, the post may have moved, or the idea may still
            be waiting to be written.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-grid h-11 place-items-center bg-[var(--color-ink)] px-6 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-paper)] transition hover:bg-[var(--color-accent)]"
            >
              Back to latest
            </Link>
            <Link
              href="/blog"
              className="inline-grid h-11 place-items-center border border-[var(--color-ink)] px-6 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              Browse archive
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
