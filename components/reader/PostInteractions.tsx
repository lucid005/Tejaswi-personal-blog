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

  return (
    <article className="border-t border-[#d9cec1] py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-fraunces text-2xl font-medium">
            {comment.user.name || comment.user.email}
          </p>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#717a51]">
            {comment.user.role.toLowerCase()}
          </p>
        </div>
        {canDelete ? (
          <form action={deleteCommentAction}>
            <input name="commentId" type="hidden" value={comment.id} />
            <input name="slug" type="hidden" value={slug} />
            <button
              className="cursor-pointer text-xs font-black uppercase tracking-[0.14em] text-[#82331f] hover:text-[#191817]"
              type="submit"
            >
              Delete
            </button>
          </form>
        ) : null}
      </div>
      <p className="mt-3 whitespace-pre-wrap text-base font-semibold leading-7 text-[#2f2c29]">
        {comment.content}
      </p>

      {currentUserId ? (
        <form action={addCommentAction} className="mt-4 grid gap-2">
          <HiddenFields postId={postId} slug={slug} />
          <input name="parentId" type="hidden" value={comment.id} />
          <textarea
            className="min-h-[92px] resize-y border border-[#a89f93] bg-transparent px-3 py-2 text-sm font-semibold outline-none focus:border-[#717a51]"
            name="content"
            placeholder="Reply"
            required
          />
          <button
            className="justify-self-start border border-[#191817] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-[#191817] hover:text-[#fffdf9]"
            type="submit"
          >
            Reply
          </button>
        </form>
      ) : null}

      {comment.replies.length > 0 ? (
        <div className="ml-6 mt-5 border-l border-[#d9cec1] pl-5 max-[640px]:ml-2 max-[640px]:pl-4">
          {comment.replies.map((reply) => (
            <Comment
              comment={reply}
              currentUserId={currentUserId}
              key={reply.id}
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
    <section className="mx-auto w-[min(100%,1180px)] px-6 pb-[clamp(66px,9vw,120px)] max-[640px]:px-4">
      <div className="grid grid-cols-[minmax(0,760px)_minmax(230px,1fr)] gap-[clamp(34px,6vw,82px)] max-[920px]:grid-cols-1">
        <div>
          <div className="border-y border-[#d9cec1] py-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
              Reactions
            </p>
            {currentUserId ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.values(ReactionType).map((type) => (
                  <form action={reactToPostAction} key={type}>
                    <HiddenFields postId={postId} slug={slug} />
                    <input name="reactionType" type="hidden" value={type} />
                    <button
                      className={`cursor-pointer border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                        currentReaction === type
                          ? "border-[#717a51] bg-[#717a51] text-[#fffdf9]"
                          : "border-[#c6b9a8] text-[#5f594f] hover:border-[#191817]"
                      }`}
                      type="submit"
                    >
                      {reactionLabels[type]} {countMap.get(type) ?? 0}
                    </button>
                  </form>
                ))}
              </div>
            ) : (
              <p className="mt-3 font-semibold leading-7 text-[#625c55]">
                <Link className="text-[#4f5740] underline" href="/login">
                  Sign in
                </Link>{" "}
                to react, save, or comment.
              </p>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
                  Comments
                </p>
                <h2 className="mt-2 font-fraunces text-[clamp(2rem,4vw,4rem)] font-medium leading-none">
                  Discussion
                </h2>
              </div>
              {currentUserId ? (
                <form action={isSaved ? unsavePostAction : savePostAction}>
                  <HiddenFields postId={postId} slug={slug} />
                  <button
                    className="cursor-pointer border border-[#191817] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-[#191817] hover:text-[#fffdf9]"
                    type="submit"
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </form>
              ) : null}
            </div>

            {currentUserId ? (
              <form action={addCommentAction} className="mt-6 grid gap-3">
                <HiddenFields postId={postId} slug={slug} />
                <textarea
                  className="min-h-[130px] resize-y border border-[#8a8277] bg-transparent px-4 py-3 text-base font-semibold leading-7 outline-none focus:border-[#717a51] focus:shadow-[0_0_0_3px_rgba(113,122,81,0.16)]"
                  name="content"
                  placeholder="Write a comment"
                  required
                />
                <button
                  className="justify-self-start bg-[#191817] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#fffdf9] transition hover:bg-[#717a51]"
                  type="submit"
                >
                  Post Comment
                </button>
              </form>
            ) : null}

            <div className="mt-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    comment={comment}
                    currentUserId={currentUserId}
                    key={comment.id}
                    postId={postId}
                    slug={slug}
                  />
                ))
              ) : (
                <p className="border-y border-[#d9cec1] py-8 text-base font-semibold text-[#625c55]">
                  No comments yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="border-t border-[#d9cec1] pt-5">
          <p className="font-fraunces text-2xl font-medium">Reader tools</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#625c55]">
            Save posts to your profile and keep track of what you have been
            reading.
          </p>
        </aside>
      </div>
    </section>
  );
}
