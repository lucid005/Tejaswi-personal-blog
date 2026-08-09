import Link from "next/link";
import { CommentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  deleteAdminCommentAction,
  replyAsAdminAction,
  setCommentStatusAction,
} from "./actions";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    include: {
      post: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      user: {
        select: {
          email: true,
          name: true,
          role: true,
        },
      },
      parent: {
        select: {
          id: true,
          content: true,
        },
      },
    },
    // PENDING is first in the enum, so ascending puts what needs Tejaswi's
    // attention at the top.
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const pendingCount = comments.filter(
    (comment) => comment.status === CommentStatus.PENDING,
  ).length;

  return (
    <section>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#717a51]">
        Comments
      </p>
      <h1 className="mt-3 font-fraunces text-[clamp(2.8rem,7vw,6.6rem)] font-medium leading-none tracking-normal">
        Discussion
      </h1>
      <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-[#717a51]">
        {pendingCount === 0
          ? "Nothing waiting for you"
          : `${pendingCount} awaiting your approval`}
      </p>

      <div className="mt-10 divide-y divide-[#d9cec1] border border-[#d9cec1] bg-[#fffaf2]">
        {comments.map((comment) => (
          <article className="p-5" key={comment.id}>
            <div className="flex items-start justify-between gap-5 max-[720px]:grid">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#717a51]">
                  {comment.user.role.toLowerCase()} / {comment.status.toLowerCase()}
                </p>
                <h2 className="mt-2 font-fraunces text-3xl font-medium">
                  {comment.user.name || comment.user.email}
                </h2>
                <p className="mt-1 text-sm font-semibold text-[#6f6962]">
                  On{" "}
                  <Link
                    className="text-[#4f5740] underline"
                    href={`/blog/${comment.post.slug}`}
                  >
                    {comment.post.title}
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                {comment.status !== CommentStatus.APPROVED ? (
                  <form action={setCommentStatusAction}>
                    <input name="commentId" type="hidden" value={comment.id} />
                    <input name="slug" type="hidden" value={comment.post.slug} />
                    <input
                      name="status"
                      type="hidden"
                      value={CommentStatus.APPROVED}
                    />
                    <button
                      className="cursor-pointer border border-[#4f5740] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#4f5740] transition hover:bg-[#4f5740] hover:text-[#fffdf9]"
                      type="submit"
                    >
                      Approve
                    </button>
                  </form>
                ) : null}

                {comment.status !== CommentStatus.HIDDEN ? (
                  <form action={setCommentStatusAction}>
                    <input name="commentId" type="hidden" value={comment.id} />
                    <input name="slug" type="hidden" value={comment.post.slug} />
                    <input
                      name="status"
                      type="hidden"
                      value={CommentStatus.HIDDEN}
                    />
                    <button
                      className="cursor-pointer border border-[#8a8277] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#5f594f] transition hover:bg-[#5f594f] hover:text-[#fffdf9]"
                      type="submit"
                    >
                      Hide
                    </button>
                  </form>
                ) : (
                  <form action={setCommentStatusAction}>
                    <input name="commentId" type="hidden" value={comment.id} />
                    <input name="slug" type="hidden" value={comment.post.slug} />
                    <input
                      name="status"
                      type="hidden"
                      value={CommentStatus.PENDING}
                    />
                    <button
                      className="cursor-pointer border border-[#8a8277] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#5f594f] transition hover:bg-[#5f594f] hover:text-[#fffdf9]"
                      type="submit"
                    >
                      Return to queue
                    </button>
                  </form>
                )}

                <form action={deleteAdminCommentAction}>
                  <input name="commentId" type="hidden" value={comment.id} />
                  <input name="slug" type="hidden" value={comment.post.slug} />
                  <button
                    className="cursor-pointer border border-[#b95742] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#82331f] transition hover:bg-[#82331f] hover:text-[#fffdf9]"
                    type="submit"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>

            {comment.parent ? (
              <p className="mt-4 border-l-4 border-[#d9cec1] pl-4 text-sm font-semibold leading-6 text-[#6f6962]">
                Replying to: {comment.parent.content}
              </p>
            ) : null}

            <p className="mt-4 whitespace-pre-wrap text-base font-semibold leading-7 text-[#2f2c29]">
              {comment.content}
            </p>

            <form action={replyAsAdminAction} className="mt-5 grid gap-3">
              <input name="parentId" type="hidden" value={comment.id} />
              <input name="postId" type="hidden" value={comment.post.id} />
              <input name="slug" type="hidden" value={comment.post.slug} />
              <textarea
                className="min-h-[96px] resize-y border border-[#8a8277] bg-transparent px-4 py-3 text-sm font-semibold leading-6 outline-none focus:border-[#717a51]"
                name="content"
                placeholder="Reply as admin"
                required
              />
              <button
                className="justify-self-start bg-[#191817] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#fffdf9] transition hover:bg-[#717a51]"
                type="submit"
              >
                Reply
              </button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
