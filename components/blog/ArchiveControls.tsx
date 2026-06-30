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
  { label: "Reading Time", value: "reading" },
];

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
      className="mb-[clamp(36px,5vw,64px)] grid grid-cols-[1fr_1fr_1fr_auto] gap-3 border-y border-[#d9cec1] py-5 max-[980px]:grid-cols-2 max-[620px]:grid-cols-1"
    >
      <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#5f594f]">
        Filter By Category
        <select
          className="min-h-[48px] border border-[#a89f93] bg-transparent px-3 text-base font-semibold normal-case tracking-normal text-[#191817] outline-none"
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
      <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#5f594f]">
        Filter By Tag
        <select
          className="min-h-[48px] border border-[#a89f93] bg-transparent px-3 text-base font-semibold normal-case tracking-normal text-[#191817] outline-none"
          defaultValue={currentTag}
          name="tag"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag.value} value={tag.value}>
              {tag.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#5f594f]">
        Sort By
        <select
          className="min-h-[48px] border border-[#a89f93] bg-transparent px-3 text-base font-semibold normal-case tracking-normal text-[#191817] outline-none"
          defaultValue={currentSort}
          name="sort"
        >
          {sortOptions.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-end gap-2">
        <button
          className="min-h-[48px] cursor-pointer bg-[#191817] px-5 text-xs font-black uppercase tracking-[0.14em] text-[#fffdf9] transition hover:bg-[#717a51]"
          type="submit"
        >
          Apply
        </button>
        <Link
          className="grid min-h-[48px] place-items-center border border-[#191817] px-5 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-[#191817] hover:text-[#fffdf9]"
          href="/blog"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
