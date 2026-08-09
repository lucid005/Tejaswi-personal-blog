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

/**
 * Reading is free; only these actions ask for an account. When they do, carry
 * the post the reader was on so signing in does not cost them their place.
 */
async function getReaderOrRedirect(slug: string) {
  const reader = await getCurrentReader();

  if (!reader) {
    const next = slug ? `/blog/${slug}` : "/";
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return reader;
}

export async function addCommentAction(formData: FormData) {
  const slug = getString(formData, "slug");
  const reader = await getReaderOrRedirect(slug);
  const postId = getString(formData, "postId");
  const content = getString(formData, "content");
  const parentId = getString(formData, "parentId");

  if (!postId || !slug || !content) {
    return;
  }

  // Status is left to the model's default of PENDING — nothing appears under
  // Tejaswi's name until she approves it.
  await prisma.comment.create({
    data: {
      content,
      postId,
      userId: reader.id,
      parentId: parentId || null,
    },
  });

  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/comments");
}

export async function reactToPostAction(formData: FormData) {
  const slug = getString(formData, "slug");
  const reader = await getReaderOrRedirect(slug);
  const postId = getString(formData, "postId");
  const reactionType = getReactionType(getString(formData, "reactionType"));

  if (!postId || !slug) {
    return;
  }

  const existing = await prisma.reaction.findFirst({
    where: { postId, userId: reader.id },
    select: { id: true, type: true },
  });

  // Choosing the reaction you already hold clears it; choosing another
  // replaces it. Either way a reader holds at most one.
  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  }

  if (!existing || existing.type !== reactionType) {
    await prisma.reaction.create({
      data: {
        postId,
        userId: reader.id,
        type: reactionType,
      },
    });
  }

  revalidatePath(`/blog/${slug}`);
  revalidatePath("/login");
}

export async function savePostAction(formData: FormData) {
  const slug = getString(formData, "slug");
  const reader = await getReaderOrRedirect(slug);
  const postId = getString(formData, "postId");

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
  const slug = getString(formData, "slug");
  const reader = await getReaderOrRedirect(slug);
  const postId = getString(formData, "postId");

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
