"use server";

import { revalidatePath } from "next/cache";
import { CommentStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getModerationStatus(value: string) {
  if (
    value === CommentStatus.APPROVED ||
    value === CommentStatus.HIDDEN ||
    value === CommentStatus.PENDING
  ) {
    return value;
  }

  return null;
}

function revalidateComment(slug: string) {
  revalidatePath("/admin/comments");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

/**
 * Approve, hide, or send a comment back to pending. Hiding is reversible on
 * purpose — deleting is a separate, deliberate act.
 */
export async function setCommentStatusAction(formData: FormData) {
  await requireAdmin();
  const commentId = getString(formData, "commentId");
  const slug = getString(formData, "slug");
  const status = getModerationStatus(getString(formData, "status"));

  if (!commentId || !status) {
    return;
  }

  await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status,
    },
  });

  revalidateComment(slug);
}

export async function deleteAdminCommentAction(formData: FormData) {
  await requireAdmin();
  const commentId = getString(formData, "commentId");
  const slug = getString(formData, "slug");

  if (!commentId) {
    return;
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  revalidateComment(slug);
}

export async function replyAsAdminAction(formData: FormData) {
  const admin = await requireAdmin();
  const parentId = getString(formData, "parentId");
  const postId = getString(formData, "postId");
  const slug = getString(formData, "slug");
  const content = getString(formData, "content");

  if (!parentId || !postId || !content) {
    return;
  }

  // Tejaswi's own replies need no approval.
  await prisma.comment.create({
    data: {
      content,
      parentId,
      postId,
      userId: admin.id,
      status: CommentStatus.APPROVED,
    },
  });

  revalidateComment(slug);
}
