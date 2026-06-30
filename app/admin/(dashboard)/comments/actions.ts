"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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

  revalidatePath("/admin/comments");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
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

  await prisma.comment.create({
    data: {
      content,
      parentId,
      postId,
      userId: admin.id,
      status: "APPROVED",
    },
  });

  revalidatePath("/admin/comments");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}
