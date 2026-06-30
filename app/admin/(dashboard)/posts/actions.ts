"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PostStatus } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { uploadCoverImage } from "@/lib/storage";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getDate(value: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getStatus(value: string) {
  if (
    value === PostStatus.DRAFT ||
    value === PostStatus.PUBLISHED ||
    value === PostStatus.SCHEDULED ||
    value === PostStatus.ARCHIVED
  ) {
    return value;
  }

  return PostStatus.DRAFT;
}

function getTagIds(formData: FormData) {
  return formData
    .getAll("tagIds")
    .filter((value): value is string => typeof value === "string" && !!value);
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

async function buildPostData(formData: FormData) {
  const title = getString(formData, "title");
  const slug = slugify(getString(formData, "slug") || title);
  const status = getStatus(getString(formData, "status"));
  const categoryId = getString(formData, "categoryId");
  const seriesId = getString(formData, "seriesId");
  const publishedAtInput = getDate(getString(formData, "publishedAt"));
  const scheduledForInput = getDate(getString(formData, "scheduledFor"));
  const readingTimeMinutes = Math.max(
    1,
    Number.parseInt(getString(formData, "readingTimeMinutes") || "1", 10),
  );

  if (!title || !slug || !categoryId) {
    throw new Error("Title, slug, and category are required.");
  }

  const uploadedCoverUrl = await uploadCoverImage(
    getFile(formData, "coverImageFile"),
    slug,
  );

  return {
    data: {
      title,
      slug,
      shortDescription: getString(formData, "shortDescription"),
      content: getString(formData, "content"),
      coverImageUrl:
        uploadedCoverUrl || getString(formData, "coverImageUrl") || null,
      status,
      featured: getBoolean(formData, "featured"),
      pinned: getBoolean(formData, "pinned"),
      readingTimeMinutes,
      publishedAt:
        status === PostStatus.PUBLISHED ? publishedAtInput ?? new Date() : null,
      scheduledFor:
        status === PostStatus.SCHEDULED ? scheduledForInput ?? null : null,
      authorNote: getString(formData, "authorNote") || null,
      behindThePost: getString(formData, "behindThePost") || null,
      metaTitle: getString(formData, "metaTitle") || null,
      metaDescription: getString(formData, "metaDescription") || null,
      ogImageUrl: getString(formData, "ogImageUrl") || null,
      categoryId,
      seriesId,
    },
    tagIds: getTagIds(formData),
  };
}

export async function createPostAction(formData: FormData) {
  const admin = await requireAdmin();
  const { data, tagIds } = await buildPostData(formData);
  const { categoryId, seriesId, ...baseData } = data;

  await prisma.post.create({
    data: {
      ...baseData,
      author: {
        connect: {
          id: admin.id,
        },
      },
      category: {
        connect: {
          id: categoryId,
        },
      },
      ...(seriesId
        ? {
            series: {
              connect: {
                id: seriesId,
              },
            },
          }
        : {}),
      tags: {
        create: tagIds.map((tagId) => ({
          tag: {
            connect: {
              id: tagId,
            },
          },
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  redirect("/admin/posts");
}

export async function updatePostAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");
  const { data, tagIds } = await buildPostData(formData);
  const { categoryId, seriesId, ...baseData } = data;

  if (!id) {
    throw new Error("Post id is required.");
  }

  await prisma.post.update({
    where: {
      id,
    },
    data: {
      ...baseData,
      category: {
        connect: {
          id: categoryId,
        },
      },
      series: seriesId
        ? {
            connect: {
              id: seriesId,
            },
          }
        : {
            disconnect: true,
          },
      tags: {
        deleteMany: {},
        create: tagIds.map((tagId) => ({
          tag: {
            connect: {
              id: tagId,
            },
          },
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/admin/posts/${id}/edit`);
  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Post id is required.");
  }

  await prisma.post.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  redirect("/admin/posts");
}
