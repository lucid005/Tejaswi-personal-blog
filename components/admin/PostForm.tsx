import { PostStatus, Prisma } from "@/generated/prisma/client";
import CoverImageField from "@/components/admin/CoverImageField";

type CategoryOption = {
  id: string;
  name: string;
};

type TagOption = {
  id: string;
  name: string;
};

type SeriesOption = {
  id: string;
  title: string;
};

type AdminPost = Prisma.PostGetPayload<{
  include: {
    tags: true;
  };
}>;

type PostFormProps = {
  action: (formData: FormData) => void;
  categories: CategoryOption[];
  mode: "create" | "edit";
  post?: AdminPost;
  seriesList: SeriesOption[];
  tags: TagOption[];
};

function formatDateTimeLocal(date?: Date | null) {
  if (!date) {
    return "";
  }

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function FieldGroup({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="border border-[#d9cec1] bg-[#fffaf2]">
      <div className="border-b border-[#d9cec1] px-5 py-4">
        <h2 className="font-fraunces text-3xl font-medium">{title}</h2>
        <p className="mt-1 text-sm font-semibold leading-6 text-[#6f6962]">
          {description}
        </p>
      </div>
      <div className="grid gap-5 p-5">{children}</div>
    </section>
  );
}

function Label({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
      {label}
      {children}
    </label>
  );
}

const inputClass =
  "min-h-[54px] border border-[#8a8277] bg-transparent px-4 text-base font-semibold normal-case tracking-normal text-[#191817] outline-none placeholder:text-[#6f6962] focus:border-[#717a51] focus:shadow-[0_0_0_3px_rgba(113,122,81,0.16)]";

const textareaClass =
  "min-h-[180px] resize-y border border-[#8a8277] bg-transparent px-4 py-3 text-base font-semibold normal-case leading-7 tracking-normal text-[#191817] outline-none placeholder:text-[#6f6962] focus:border-[#717a51] focus:shadow-[0_0_0_3px_rgba(113,122,81,0.16)]";

export default function PostForm({
  action,
  categories,
  mode,
  post,
  seriesList,
  tags,
}: PostFormProps) {
  const selectedTags = new Set(post?.tags.map((tag) => tag.tagId) ?? []);

  return (
    <form action={action} className="grid gap-6">
      {post ? <input name="id" type="hidden" value={post.id} /> : null}

      <FieldGroup
        description="The public title, URL slug, and short summary readers see first."
        title="Identity"
      >
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          <Label label="Title">
            <input
              className={inputClass}
              defaultValue={post?.title}
              name="title"
              placeholder="Post title"
              required
            />
          </Label>
          <Label label="Slug">
            <input
              className={inputClass}
              defaultValue={post?.slug}
              name="slug"
              placeholder="post-url-slug"
            />
          </Label>
        </div>
        <Label label="Short Description">
          <textarea
            className={`${textareaClass} min-h-[110px]`}
            defaultValue={post?.shortDescription}
            name="shortDescription"
            placeholder="A compact preview for cards and search results."
            required
          />
        </Label>
      </FieldGroup>

      <FieldGroup
        description="Control whether the post appears publicly, when it appears, and how it is prioritized."
        title="Publishing"
      >
        <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
          <Label label="Status">
            <select
              className={inputClass}
              defaultValue={post?.status ?? PostStatus.DRAFT}
              name="status"
            >
              {Object.values(PostStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Label>
          <Label label="Published At">
            <input
              className={inputClass}
              defaultValue={formatDateTimeLocal(post?.publishedAt)}
              name="publishedAt"
              type="datetime-local"
            />
          </Label>
          <Label label="Scheduled For">
            <input
              className={inputClass}
              defaultValue={formatDateTimeLocal(post?.scheduledFor)}
              name="scheduledFor"
              type="datetime-local"
            />
          </Label>
        </div>
        <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
          <Label label="Reading Time">
            <input
              className={inputClass}
              defaultValue={post?.readingTimeMinutes ?? 3}
              min={1}
              name="readingTimeMinutes"
              type="number"
            />
          </Label>
          <label className="flex min-h-[54px] items-center gap-3 border border-[#8a8277] px-4 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
            <input defaultChecked={post?.featured} name="featured" type="checkbox" />
            Featured
          </label>
          <label className="flex min-h-[54px] items-center gap-3 border border-[#8a8277] px-4 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
            <input defaultChecked={post?.pinned} name="pinned" type="checkbox" />
            Pinned
          </label>
        </div>
      </FieldGroup>

      <FieldGroup
        description="Organize the post into the blog archive, tag index, and optional series."
        title="Taxonomy"
      >
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          <Label label="Category">
            <select
              className={inputClass}
              defaultValue={post?.categoryId}
              name="categoryId"
              required
            >
              <option value="">Choose category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Label>
          <Label label="Series">
            <select
              className={inputClass}
              defaultValue={post?.seriesId ?? ""}
              name="seriesId"
            >
              <option value="">No series</option>
              {seriesList.map((series) => (
                <option key={series.id} value={series.id}>
                  {series.title}
                </option>
              ))}
            </select>
          </Label>
        </div>
        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-[#5f594f]">
            Tags
          </p>
          <div className="grid grid-cols-3 gap-2 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
            {tags.map((tag) => (
              <label
                className="flex min-h-[48px] items-center gap-3 border border-[#d9cec1] px-4 text-sm font-bold text-[#5f594f]"
                key={tag.id}
              >
                <input
                  defaultChecked={selectedTags.has(tag.id)}
                  name="tagIds"
                  type="checkbox"
                  value={tag.id}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      </FieldGroup>

      <FieldGroup
        description="Visual and editorial framing around the main article."
        title="Media and Notes"
      >
        <CoverImageField currentUrl={post?.coverImageUrl} />
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          <Label label="Author Note">
            <textarea
              className={textareaClass}
              defaultValue={post?.authorNote ?? ""}
              name="authorNote"
              placeholder="Optional note shown around the article."
            />
          </Label>
          <Label label="Behind The Post">
            <textarea
              className={textareaClass}
              defaultValue={post?.behindThePost ?? ""}
              name="behindThePost"
              placeholder="Optional context, sources, or process notes."
            />
          </Label>
        </div>
      </FieldGroup>

      <FieldGroup
        description="Write with lightweight Markdown: # headings, ## subheadings, - list items, and > quotes."
        title="Content"
      >
        <Label label="Blog Content">
          <textarea
            className={`${textareaClass} min-h-[420px] font-mono text-[0.95rem]`}
            defaultValue={post?.content}
            name="content"
            placeholder="Start writing the post..."
            required
          />
        </Label>
      </FieldGroup>

      <FieldGroup
        description="Optional metadata for search results and social previews."
        title="SEO"
      >
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          <Label label="Meta Title">
            <input
              className={inputClass}
              defaultValue={post?.metaTitle ?? ""}
              name="metaTitle"
            />
          </Label>
          <Label label="OG Image URL">
            <input
              className={inputClass}
              defaultValue={post?.ogImageUrl ?? ""}
              name="ogImageUrl"
              type="url"
            />
          </Label>
        </div>
        <Label label="Meta Description">
          <textarea
            className={`${textareaClass} min-h-[110px]`}
            defaultValue={post?.metaDescription ?? ""}
            name="metaDescription"
          />
        </Label>
      </FieldGroup>

      <div className="sticky bottom-0 z-20 flex items-center justify-end gap-3 border border-[#d9cec1] bg-[#f6efe6]/95 p-4 backdrop-blur">
        <button
          className="cursor-pointer bg-[#191817] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#fffdf9] transition hover:bg-[#717a51]"
          type="submit"
        >
          {mode === "create" ? "Create Post" : "Save Post"}
        </button>
      </div>
    </form>
  );
}
