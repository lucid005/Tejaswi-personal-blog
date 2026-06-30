"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/blog" },
  { label: "Blogs", href: "/blog" },
  { label: "Series", href: "/series" },
  { label: "About Me", href: null },
];

type SearchResult = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const canSearch = isSearchOpen && searchQuery.trim().length >= 2;
  const visibleSearchResults = canSearch ? searchResults : [];

  useEffect(() => {
    if (!canSearch) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery.trim())}`,
          {
            signal: controller.signal,
          },
        );
        const data = (await response.json()) as { posts: SearchResult[] };
        setSearchResults(data.posts);
      } catch {
        if (!controller.signal.aborted) {
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 220);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [canSearch, searchQuery]);

  function toggleMenu() {
    setIsSearchOpen(false);
    setIsMenuOpen((open) => !open);
  }

  function toggleSearch() {
    setIsMenuOpen(false);
    setIsSearchOpen((open) => !open);
  }

  function closeOverlay() {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    if (!searchQuery.trim()) {
      event.preventDefault();
    }
  }

  const isOverlayOpen = isMenuOpen || isSearchOpen;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 grid min-h-[108px] grid-cols-[56px_1fr_56px] items-center bg-[#f6efe6] px-[clamp(22px,4vw,52px)] py-5 max-[900px]:min-h-[92px] max-[900px]:grid-cols-[46px_1fr_46px] max-[640px]:min-h-[82px] max-[640px]:px-3.5">
        <button
          className="grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#191817] transition hover:bg-black/[0.07] active:translate-y-px max-[640px]:h-10 max-[640px]:w-10 [&_svg]:h-[26px] [&_svg]:w-[26px] [&_svg]:stroke-[1.8] max-[640px]:[&_svg]:h-[22px] max-[640px]:[&_svg]:w-[22px]"
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <RxHamburgerMenu aria-hidden="true" />
        </button>

        <Link
          className="justify-self-center font-fraunces text-[clamp(3.35rem,6.2vw,5.8rem)] font-medium leading-[0.95] tracking-normal max-[640px]:text-[clamp(2.8rem,13vw,4.1rem)]"
          href="/"
          aria-label="Tejaswi home"
          onClick={() => {
            setIsMenuOpen(false);
            setIsSearchOpen(false);
          }}
        >
          Tejaswi
        </Link>

        <button
          className="grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#191817] transition hover:bg-black/[0.07] active:translate-y-px max-[640px]:h-10 max-[640px]:w-10 [&_svg]:h-[26px] [&_svg]:w-[26px] [&_svg]:stroke-[1.8] max-[640px]:[&_svg]:h-[22px] max-[640px]:[&_svg]:w-[22px]"
          type="button"
          aria-label={isOverlayOpen ? "Close overlay" : "Open search"}
          aria-expanded={isSearchOpen}
          onClick={isOverlayOpen ? closeOverlay : toggleSearch}
        >
          {isOverlayOpen ? (
            <FiX aria-hidden="true" />
          ) : (
            <FiSearch aria-hidden="true" />
          )}
        </button>
      </header>

      <div
        className={`fixed inset-x-0 top-[108px] z-40 bg-[#f6efe6] transition duration-300 ease-out max-[900px]:top-[92px] max-[640px]:top-[82px] ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <nav
          className="grid min-h-[390px] place-items-center px-6 py-12 max-[640px]:min-h-[340px]"
          aria-label="Primary"
        >
          <div className="grid justify-items-center gap-3">
            {navItems.map((item) => (
              item.href ? (
                <Link
                  key={item.href + item.label}
                  className="font-fraunces text-[clamp(2.8rem,6vw,4.2rem)] font-medium leading-none text-[#191817] transition hover:text-[#717a51]"
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-fraunces text-[clamp(2.8rem,6vw,4.2rem)] font-medium leading-none text-[#8d867c]"
                  key={item.label}
                >
                  {item.label}
                </span>
              )
            ))}
          </div>
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-30 bg-[#f6efe6] transition duration-300 ease-out ${
          isSearchOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <form
          action="/search"
          className="grid min-h-screen place-items-center px-6 pt-[108px] max-[900px]:pt-[92px] max-[640px]:pt-[82px]"
          onSubmit={submitSearch}
          role="search"
        >
          <div className="w-[min(100%,680px)] text-center">
            <label
              className="mb-6 block font-fraunces text-[clamp(3.2rem,7vw,5.4rem)] font-medium leading-none text-[#69645e]"
              htmlFor="site-search"
            >
              Search
            </label>
            <input
              className="min-h-[58px] w-full border-0 border-b border-[#a89f93] bg-transparent px-2 text-center font-fraunces text-[clamp(1.8rem,4vw,3rem)] text-[#191817] outline-none placeholder:text-[#9a938b] focus:border-[#717a51]"
              id="site-search"
              name="q"
              type="search"
              placeholder="Type here"
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
            />
            <div className="mx-auto mt-8 grid max-w-[620px] gap-3 text-left">
              {isSearching ? (
                <p className="text-center text-sm font-black uppercase tracking-[0.16em] text-[#717a51]">
                  Searching
                </p>
              ) : null}
              {visibleSearchResults.map((post) => (
                <Link
                  className="block border-t border-[#d9cec1] px-1 py-3 transition hover:text-[#596345]"
                  href={`/blog/${post.slug}`}
                  key={post.id}
                  onClick={closeOverlay}
                >
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#717a51]">
                    {post.category}
                  </p>
                  <h2 className="mt-1 font-fraunces text-2xl font-medium">
                    {post.title}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-[#625c55]">
                    {post.shortDescription}
                  </p>
                </Link>
              ))}
              {searchQuery.trim().length >= 2 &&
              !isSearching &&
              visibleSearchResults.length === 0 ? (
                <p className="text-center text-sm font-bold text-[#6f6962]">
                  No matching posts yet.
                </p>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
