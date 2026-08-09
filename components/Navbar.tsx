"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  PiGauge,
  PiListBold,
  PiMagnifyingGlass,
  PiX,
} from "react-icons/pi";
import { navLogoutAction } from "@/app/login/actions";
import type { Viewer } from "@/lib/viewer";

const navItems = [
  { label: "Latest", href: "/" },
  { label: "Archive", href: "/blog" },
  { label: "Series", href: "/series" },
  { label: "About", href: "/about" },
];

type SearchResult = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
};

export default function Navbar({ viewer }: { viewer: Viewer | null }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const canSearch = isSearchOpen && searchQuery.trim().length >= 2;
  const visibleSearchResults = canSearch ? searchResults : [];

  useEffect(() => {
    if (!canSearch) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery.trim())}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as { posts: SearchResult[] };
        setSearchResults(data.posts);
      } catch {
        if (!controller.signal.aborted) setSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [canSearch, searchQuery]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeAll();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function closeAll() {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsAccountOpen(false);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    if (!searchQuery.trim()) event.preventDefault();
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const accountLabel = viewer?.name ?? viewer?.email ?? "";
  const initial = accountLabel.charAt(0).toUpperCase() || "?";
  const menuItem =
    "block px-4 py-2.5 text-[13px] text-[var(--color-ink)] transition hover:bg-[var(--color-surface)]";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-hairline)] bg-[var(--color-paper)]/92 backdrop-blur">
        <div className="mx-auto grid h-[68px] w-[min(100%,1200px)] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 max-[640px]:h-[60px] max-[640px]:px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => {
                setIsSearchOpen(false);
                setIsMenuOpen((v) => !v);
              }}
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--color-ink)] transition hover:bg-[var(--color-surface)] active:translate-y-px min-[900px]:hidden"
            >
              {isMenuOpen ? (
                <PiX aria-hidden="true" className="h-5 w-5" />
              ) : (
                <PiListBold aria-hidden="true" className="h-5 w-5" />
              )}
            </button>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-7 text-[13px] text-[var(--color-muted)] min-[900px]:flex"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 transition hover:text-[var(--color-ink)] ${
                    isActive(item.href)
                      ? "text-[var(--color-ink)] after:absolute after:inset-x-0 after:-bottom-[1px] after:h-px after:bg-[var(--color-ink)]"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/"
            aria-label="Tejaswi home"
            className="justify-self-center font-[family-name:var(--font-newsreader)] text-[26px] leading-none tracking-[-0.01em] text-[var(--color-ink)] max-[640px]:text-[22px]"
          >
            Tejaswi<span className="text-[var(--color-accent)]">.</span>
          </Link>

          <div className="flex items-center justify-end gap-2">
            {viewer ? (
              <>
                {viewer.isAdmin ? (
                  <Link
                    href="/admin"
                    className="hidden items-center gap-1.5 rounded-full border border-[var(--color-hairline)] px-3 py-1.5 text-[12px] text-[var(--color-muted)] transition hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] min-[640px]:inline-flex"
                  >
                    <PiGauge aria-hidden="true" className="h-3.5 w-3.5" />
                    Studio
                  </Link>
                ) : null}

                <div className="relative">
                  <button
                    type="button"
                    aria-label="Account menu"
                    aria-expanded={isAccountOpen}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(false);
                      setIsAccountOpen((v) => !v);
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-hairline)] text-[13px] font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-surface)]"
                  >
                    {initial}
                  </button>

                  {isAccountOpen ? (
                    <>
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-hidden="true"
                        onClick={() => setIsAccountOpen(false)}
                        className="fixed inset-0 z-40 cursor-default"
                      />
                      <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-lg border border-[var(--color-hairline)] bg-[var(--color-paper)] shadow-lg">
                        <p className="truncate border-b border-[var(--color-hairline)] px-4 py-3 text-[12px] text-[var(--color-muted)]">
                          {accountLabel}
                        </p>
                        {viewer.isAdmin ? (
                          <Link href="/admin" onClick={closeAll} className={menuItem}>
                            Admin studio
                          </Link>
                        ) : null}
                        <Link href="/login" onClick={closeAll} className={menuItem}>
                          Your dashboard
                        </Link>
                        <Link
                          href="/login/settings"
                          onClick={closeAll}
                          className={menuItem}
                        >
                          Settings
                        </Link>
                        <form action={navLogoutAction}>
                          <button
                            type="submit"
                            className={`${menuItem} w-full border-t border-[var(--color-hairline)] text-left`}
                          >
                            Sign out
                          </button>
                        </form>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden text-[13px] text-[var(--color-muted)] transition hover:text-[var(--color-ink)] min-[640px]:inline"
              >
                Sign in
              </Link>
            )}
            <button
              type="button"
              aria-label={isSearchOpen ? "Close search" : "Open search"}
              aria-expanded={isSearchOpen}
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen((v) => !v);
              }}
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--color-ink)] transition hover:bg-[var(--color-surface)] active:translate-y-px"
            >
              {isSearchOpen ? (
                <PiX aria-hidden="true" className="h-5 w-5" />
              ) : (
                <PiMagnifyingGlass aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 top-[68px] z-40 border-b border-[var(--color-hairline)] bg-[var(--color-paper)] transition duration-200 ease-out max-[640px]:top-[60px] ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="mx-auto grid w-[min(100%,1200px)] gap-1 px-6 py-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeAll}
              className="border-b border-[var(--color-hairline)] py-3 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.01em] text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
            >
              {item.label}
            </Link>
          ))}
          {viewer ? (
            <>
              {viewer.isAdmin ? (
                <Link
                  href="/admin"
                  onClick={closeAll}
                  className="border-b border-[var(--color-hairline)] py-3 text-sm text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
                >
                  Admin studio
                </Link>
              ) : null}
              <Link
                href="/login"
                onClick={closeAll}
                className="border-b border-[var(--color-hairline)] py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
              >
                Your dashboard
              </Link>
              <Link
                href="/login/settings"
                onClick={closeAll}
                className="border-b border-[var(--color-hairline)] py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
              >
                Settings
              </Link>
              <form action={navLogoutAction}>
                <button
                  type="submit"
                  className="w-full border-b border-[var(--color-hairline)] py-3 text-left text-sm text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              onClick={closeAll}
              className="border-b border-[var(--color-hairline)] py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>

      <div
        className={`fixed inset-0 top-[68px] z-40 bg-[var(--color-paper)]/98 backdrop-blur transition duration-200 ease-out max-[640px]:top-[60px] ${
          isSearchOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <form
          action="/search"
          onSubmit={submitSearch}
          role="search"
          className="mx-auto grid w-[min(100%,720px)] gap-8 px-6 pt-14 max-[640px]:px-4 max-[640px]:pt-8"
        >
          <label
            htmlFor="site-search"
            className="text-xs uppercase tracking-[0.18em] text-[var(--color-subtle)]"
          >
            Search the archive
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Essays, notes, tags…"
            value={searchQuery}
            onChange={(event) => {
              const value = event.target.value;
              setSearchQuery(value);
              if (value.trim().length < 2) {
                setSearchResults([]);
                setIsSearching(false);
              }
            }}
            autoFocus={isSearchOpen}
            className="w-full border-0 border-b border-[var(--color-ink)] bg-transparent pb-3 font-[family-name:var(--font-newsreader)] text-[clamp(1.8rem,4vw,2.6rem)] tracking-[-0.01em] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-subtle)]"
          />
          <div className="grid gap-1">
            {isSearching ? (
              <p className="text-xs text-[var(--color-muted)]">Searching…</p>
            ) : null}
            {visibleSearchResults.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                onClick={closeAll}
                className="grid gap-1 border-b border-[var(--color-hairline)] py-4 transition hover:bg-[var(--color-surface)]/60"
              >
                <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  {post.category}
                </p>
                <h2 className="font-[family-name:var(--font-newsreader)] text-xl text-[var(--color-ink)]">
                  {post.title}
                </h2>
                <p className="line-clamp-2 text-sm text-[var(--color-muted)]">
                  {post.shortDescription}
                </p>
              </Link>
            ))}
            {searchQuery.trim().length >= 2 &&
            !isSearching &&
            visibleSearchResults.length === 0 ? (
              <p className="py-6 text-sm text-[var(--color-muted)]">
                No matching posts yet.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </>
  );
}
