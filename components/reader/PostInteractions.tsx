import Link from "next/link";
import { ReactionType } from "@/generated/prisma/client";
import {
  addCommentAction,
  deleteCommentAction,
  reactToPostAction,
  savePostAction,
  unsavePostAction,
} from "@/app/blog/[slug]/actions";

type CommentItem = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: {
    name: string | null;
    email: string;
    role: string;
  };
  replies: CommentItem[];
};

type ReactionCount = {
  type: ReactionType;
  count: number;
};

const reactionLabels = {
  LIKE: "Like",
  THOUGHTFUL: "Thoughtful",
  USEFUL: "Useful",
  INSPIRING: "Inspiring",
  RELATABLE: "Relatable",
} satisfies Record<ReactionType, string>;

function relativeDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function HiddenFields({ postId, slug }: { postId: string; slug: string }) {
  return (
    <>
      <input name="postId" type="hidden" value={postId} />
      <input name="slug" type="hidden" value={slug} />
    </>
  );
}

function Comment({
  comment,
  currentUserId,
  postId,
  slug,
}: {
  comment: CommentItem;
  currentUserId?: string;
  postId: string;
  slug: string;
}) {
  const canDelete = currentUserId === comment.userId;
  const isAdmin = comment.user.role.toLowerCase() === "admin";

  return (
    <article className="border-t border-[var(--color-hairline)] py-6 first:border-t-0 first:pt-0">
      <header className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <p className="font-[family-name:var(--font-newsreader)] text-lg text-[var(--color-ink)]">
            {comment.user.name || comment.user.email.split("@")[0]}
          </p>
          {isAdmin ? (
            <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
              Author
            </span>
          ) : null}
          <time className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--color-subtle)]">
            {relativeDate(comment.createdAt)}
          </time>
        </div>
        {canDelete ? (
          <form action={deleteCommentAction}>
            <input name="commentId" type="hidden" value={comment.id} />
            <input name="slug" type="hidden" value={slug} />
            <button
              type="submit"
              className="cursor-pointer font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.12em] text-[var(--color-subtle)] transition hover:text-[var(--color-danger)]"
            >
              Delete
            </button>
          </form>
        ) : null}
      </header>
      <p className="mt-3 whitespace-pre-wrap font-[family-name:var(--font-newsreader)] text-[1.05rem] leading-[1.7] text-[var(--color-ink)]">
        {comment.content}
      </p>

      {currentUserId ? (
        <form action={addCommentAction} className="mt-4 grid gap-2">
          <HiddenFields postId={postId} slug={slug} />
          <input name="parentId" type="hidden" value={comment.id} />
          <textarea
            name="content"
            placeholder="Reply…"
            required
            className="min-h-[80px] resize-y border border-[var(--color-hairline)] bg-transparent px-3 py-2 text-sm leading-6 text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
          />
          <button
            type="submit"
            className="justify-self-start bg-[var(--color-ink)] px-4 py-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-paper)] transition hover:bg-[var(--color-accent)]"
          >
            Reply
          </button>
        </form>
      ) : null}

      {comment.replies.length > 0 ? (
        <div className="mt-5 border-l border-[var(--color-hairline)] pl-5">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              postId={postId}
              slug={slug}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function PostInteractions({
  comments,
  currentReaction,
  currentUserId,
  isSaved,
  postId,
  reactionCounts,
  slug,
}: {
  comments: CommentItem[];
  currentReaction?: ReactionType;
  currentUserId?: string;
  isSaved: boolean;
  postId: string;
  reactionCounts: ReactionCount[];
  slug: string;
}) {
  const countMap = new Map(
    reactionCounts.map((reaction) => [reaction.type, reaction.count]),
  );

  return (
    <section
      aria-label="Reader interactions"
      className="mx-auto w-[min(100%,720px)] px-6 pb-[clamp(64px,9vw,120px)] max-[640px]:px-4"
    >
      <div className="grid gap-4 border-y border-[var(--color-hairline)] py-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-subtle)]">
            How did this land?
          </p>
          {currentUserId ? (
            <form action={isSaved ? unsavePostAction : savePostAction}>
              <HiddenFields postId={postId} slug={slug} />
              <button
                type="submit"
                className={`cursor-pointer border px-4 py-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] transition ${
                  isSaved
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-paper)]"
                    : "border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
                }`}
              >
                {isSaved ? "Saved" : "Save"}
              </button>
            </form>
          ) : null}
        </div>
        {currentUserId ? (
          <div className="flex flex-wrap gap-2">
            {Object.values(ReactionType).map((type) => (
              <form action={reactToPostAction} key={type}>
                <HiddenFields postId={postId} slug={slug} />
                <input name="reactionType" type="hidden" value={type} />
                <button
                  type="submit"
                  className={`cursor-pointer border px-3 py-2 text-[13px] transition ${
                    currentReaction === type
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      : "border-[var(--color-hairline)] text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  <span className="font-[family-name:var(--font-newsreader)]">
                    {reactionLabels[type]}
                  </span>
                  <span className="ml-2 font-[family-name:var(--font-geist-mono)] text-[11px] text-[var(--color-subtle)]">
                    {countMap.get(type) ?? 0}
                  </span>
                </button>
              </form>
            ))}
          </div>
        ) : (
          <p className="text-[15px] leading-7 text-[var(--color-muted)]">
            <Link
              href="/login"
              className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-ink)]"
            >
              Sign in
            </Link>{" "}
            to react, save, or leave a note.
          </p>
        )}
      </div>

      <div className="mt-12">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-[family-name:var(--font-newsreader)] text-[clamp(1.7rem,3vw,2.2rem)] font-normal leading-none tracking-[-0.015em] text-[var(--color-ink)]">
            Notes from readers
          </h2>
          <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-subtle)]">
            {comments.length} {comments.length === 1 ? "note" : "notes"}
          </span>
        </div>

        {currentUserId ? (
          <form action={addCommentAction} className="mb-8 grid gap-3">
            <HiddenFields postId={postId} slug={slug} />
            <textarea
              name="content"
              placeholder="Write a note…"
              required
              className="min-h-[120px] resize-y border border-[var(--color-hairline)] bg-transparent px-4 py-3 text-[15px] leading-7 text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_var(--color-accent-soft)]"
            />
            <button
              type="submit"
              className="justify-self-start bg-[var(--color-ink)] px-5 py-3 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--color-paper)] transition hover:bg-[var(--color-accent)]"
            >
              Post note
            </button>
          </form>
        ) : null}

        <div>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                postId={postId}
                slug={slug}
              />
            ))
          ) : (
            <p className="border-y border-[var(--color-hairline)] py-8 text-[15px] leading-7 text-[var(--color-muted)]">
              No notes yet. Be the first to leave one.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
