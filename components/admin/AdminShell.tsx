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
    <main className="min-h-screen bg-[#f6efe6] text-[#191817]">
      <header className="sticky top-0 z-40 border-b border-[#d9cec1] bg-[#f6efe6]/95 px-6 backdrop-blur max-[700px]:px-4">
        <div className="mx-auto flex min-h-[76px] w-[min(100%,1280px)] items-center justify-between gap-4">
          <Link
            className="font-fraunces text-4xl font-medium tracking-normal"
            href="/admin"
          >
            Tejaswi
          </Link>
          <div className="flex items-center gap-3">
            <Link
              className="text-sm font-black uppercase tracking-[0.16em] text-[#5f594f] hover:text-[#191817] max-[520px]:hidden"
              href="/"
            >
              View Site
            </Link>
            <form action={adminLogoutAction}>
              <button
                className="cursor-pointer border border-[#191817] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-[#191817] hover:text-[#fffdf9]"
                type="submit"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-[min(100%,1280px)] grid-cols-[220px_1fr] gap-8 px-6 py-8 max-[900px]:grid-cols-1 max-[700px]:px-4">
        <aside className="max-[900px]:overflow-x-auto">
          <nav
            aria-label="Admin"
            className="sticky top-[104px] grid gap-2 max-[900px]:static max-[900px]:flex max-[900px]:min-w-max"
          >
            {adminNav.map((item) => (
              <Link
                className="border border-[#d9cec1] bg-[#fffaf2] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f] transition hover:border-[#191817] hover:text-[#191817]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </main>
  );
}
