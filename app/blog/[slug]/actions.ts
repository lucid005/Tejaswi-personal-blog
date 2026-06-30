"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ReactionType } from "@/generated/prisma/client";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getCurrentReader } from "@/lib/reader-auth";
import { prisma } from "@/lib/prisma";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getReactionType(value: string) {
  if (
    value === ReactionType.LIKE ||
    value === ReactionType.THOUGHTFUL ||
    value === ReactionType.USEFUL ||
    value === ReactionType.INSPIRING ||
    value === ReactionType.RELATABLE
  ) {
    return value;
  }

  return ReactionType.LIKE;
}

async function getReaderOrRedirect() {
  const reader = await getCurrentReader();

  if (!reader) {
    redirect("/login");
  }

  return reader;
}

export async function addCommentAction(formData: FormData) {
  const reader = await getReaderOrRedirect();
  const postId = getString(formData, "postId");
  const slug = getString(formData, "slug");
  const content = getString(formData, "content");
  const parentId = getString(formData, "parentId");

  if (!postId || !slug || !content) {
    return;
  }

  await prisma.comment.create({
    data: {
      content,
      postId,
      userId: reader.id,
      parentId: parentId || null,
      status: "APPROVED",
    },
  });

  revalidatePath(`/blog/${slug}`);
}

export async function reactToPostAction(formData: FormData) {
  const reader = await getReaderOrRedirect();
  const postId = getString(formData, "postId");
  const slug = getString(formData, "slug");
  const reactionType = getReactionType(getString(formData, "reactionType"));

  if (!postId || !slug) {
    return;
  }

  await prisma.reaction.deleteMany({
    where: {
      postId,
      userId: reader.id,
    },
  });

  await prisma.reaction.create({
    data: {
      postId,
      userId: reader.id,
      type: reactionType,
    },
  });

  revalidatePath(`/blog/${slug}`);
}

export async function savePostAction(formData: FormData) {
  const reader = await getReaderOrRedirect();
  const postId = getString(formData, "postId");
  const slug = getString(formData, "slug");

  if (!postId || !slug) {
    return;
  }

  await prisma.savedPost.upsert({
    where: {
      postId_userId: {
        postId,
        userId: reader.id,
      },
    },
    update: {},
    create: {
      postId,
      userId: reader.id,
    },
  });

  revalidatePath(`/blog/${slug}`);
  revalidatePath("/login");
}

export async function unsavePostAction(formData: FormData) {
  const reader = await getReaderOrRedirect();
  const postId = getString(formData, "postId");
  const slug = getString(formData, "slug");

  if (!postId || !slug) {
    return;
  }

  await prisma.savedPost.deleteMany({
    where: {
      postId,
      userId: reader.id,
    },
  });

  revalidatePath(`/blog/${slug}`);
  revalidatePath("/login");
}

export async function trackReadingHistory(postId: string) {
  const reader = await getCurrentReader();

  if (!reader) {
    return;
  }

  await prisma.readingHistory.upsert({
    where: {
      postId_userId: {
        postId,
        userId: reader.id,
      },
    },
    update: {
      lastReadAt: new Date(),
    },
    create: {
      postId,
      userId: reader.id,
      progressPercent: 0,
    },
  });
}

export async function deleteCommentAction(formData: FormData) {
  const admin = await getCurrentAdmin();
  const reader = await getCurrentReader();
  const commentId = getString(formData, "commentId");
  const slug = getString(formData, "slug");

  if (!commentId || !slug || (!admin && !reader)) {
    return;
  }

  await prisma.comment.deleteMany({
    where: {
      id: commentId,
      ...(admin ? {} : { userId: reader?.id }),
    },
  });

  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/comments");
}
