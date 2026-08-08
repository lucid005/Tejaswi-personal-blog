import Link from "next/link";

type ArchiveOption = {
  label: string;
  value: string;
};

type ArchiveControlsProps = {
  categories: ArchiveOption[];
  currentCategory?: string;
  currentSort?: string;
  currentTag?: string;
  tags: ArchiveOption[];
};

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Title", value: "title" },
  { label: "Reading time", value: "reading" },
];

const selectClass =
  "h-11 w-full border border-[var(--color-hairline)] bg-transparent px-3 text-[14px] text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)]";

export default function ArchiveControls({
  categories,
  currentCategory = "",
  currentSort = "newest",
  currentTag = "",
  tags,
}: ArchiveControlsProps) {
  return (
    <form
      action="/blog"
      className="mb-[clamp(36px,5vw,64px)] grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 border-y border-[var(--color-hairline)] py-5 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1"
    >
      <label className="grid gap-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
        Category
        <select
          className={selectClass}
          defaultValue={currentCategory}
          name="category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
        Tag
        <select className={selectClass} defaultValue={currentTag} name="tag">
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag.value} value={tag.value}>
              {tag.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
        Sort
        <select className={selectClass} defaultValue={currentSort} name="sort">
          {sortOptions.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="mt-auto h-11 cursor-pointer bg-[var(--color-ink)] px-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-paper)] transition hover:bg-[var(--color-accent)]"
      >
        Apply
      </button>
      <Link
        href="/blog"
        className="mt-auto grid h-11 place-items-center border border-[var(--color-hairline)] px-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)] transition hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
      >
        Reset
      </Link>
    </form>
  );
}
