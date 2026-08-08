import Link from "next/link";
import { adminLogoutAction } from "@/app/admin/(dashboard)/actions";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/series", label: "Series" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/comments", label: "Comments" },
];

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-paper)]/95 px-6 backdrop-blur max-[640px]:px-4">
        <div className="mx-auto flex h-16 w-[min(100%,1320px)] items-center justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <Link
              href="/admin"
              className="font-[family-name:var(--font-newsreader)] text-2xl leading-none text-[var(--color-ink)]"
            >
              Tejaswi<span className="text-[var(--color-accent)]">.</span>
            </Link>
            <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">
              Studio
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hidden font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] transition hover:text-[var(--color-ink)] min-[520px]:inline"
            >
              View site ↗
            </Link>
            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="cursor-pointer border border-[var(--color-ink)] px-3 py-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-[min(100%,1320px)] grid-cols-[220px_1fr] gap-10 px-6 py-10 max-[900px]:grid-cols-1 max-[640px]:px-4 max-[640px]:py-6">
        <aside className="max-[900px]:overflow-x-auto">
          <nav
            aria-label="Admin"
            className="sticky top-[88px] grid gap-1 max-[900px]:static max-[900px]:flex max-[900px]:min-w-max"
          >
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-l-2 border-transparent px-3 py-2 font-[family-name:var(--font-geist-mono)] text-[12px] uppercase tracking-[0.14em] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)] max-[900px]:border-l-0 max-[900px]:border-b-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
