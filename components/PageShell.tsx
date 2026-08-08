import Link from "next/link";
import Navbar from "@/components/Navbar";

type PageShellProps = {
  children: React.ReactNode;
};

const footerLinks = [
  { label: "Latest", href: "/" },
  { label: "Archive", href: "/blog" },
  { label: "Series", href: "/series" },
  { label: "About", href: "/about" },
  { label: "Search", href: "/search" },
];

export default function PageShell({ children }: PageShellProps) {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Navbar />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-[var(--color-hairline)] px-6 py-10 max-[640px]:px-4">
        <div className="mx-auto grid w-[min(100%,1200px)] gap-6">
          <div className="grid grid-cols-[1fr_auto] items-end gap-6 max-[640px]:grid-cols-1">
            <div>
              <Link
                href="/"
                className="font-[family-name:var(--font-newsreader)] text-2xl leading-none text-[var(--color-ink)]"
              >
                Tejaswi<span className="text-[var(--color-accent)]">.</span>
              </Link>
              <p className="mt-3 max-w-[38ch] text-sm leading-6 text-[var(--color-muted)]">
                A personal archive of essays, reading notes, and small
                observations. Written slowly, kept quiet.
              </p>
            </div>
            <nav
              aria-label="Footer"
              className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--color-muted)]"
            >
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-[var(--color-ink)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-hairline)] pt-6 text-xs text-[var(--color-subtle)]">
            <p>© {new Date().getFullYear()} Tejaswi. Written by hand.</p>
            <p className="font-[family-name:var(--font-geist-mono)] uppercase tracking-[0.14em]">
              RSS coming soon
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
