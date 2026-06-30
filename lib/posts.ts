import { notFound } from "next/navigation";
import { PostStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const postInclude = {
  author: {
    select: {
      name: true,
      username: true,
      bio: true,
    },
  },
  category: true,
  series: true,
  tags: {
    include: {
      tag: true,
    },
  },
} satisfies Prisma.PostInclude;

const publishedPostWhere = () =>
  ({
    status: PostStatus.PUBLISHED,
    publishedAt: {
      lte: new Date(),
    },
  }) satisfies Prisma.PostWhereInput;

export type PublicPost = Prisma.PostGetPayload<{
  include: typeof postInclude;
}>;

export type PublishedPostSort = "newest" | "oldest" | "title" | "reading";

export type PublishedPostFilters = {
  category?: string;
  tag?: string;
  sort?: PublishedPostSort;
  take?: number;
};

function getPostOrderBy(sort: PublishedPostSort = "newest") {
  if (sort === "oldest") {
    return [{ publishedAt: "asc" }] satisfies Prisma.PostOrderByWithRelationInput[];
  }

  if (sort === "title") {
    return [{ title: "asc" }] satisfies Prisma.PostOrderByWithRelationInput[];
  }

  if (sort === "reading") {
    return [
      { readingTimeMinutes: "asc" },
      { publishedAt: "desc" },
    ] satisfies Prisma.PostOrderByWithRelationInput[];
  }

  return [
    { pinned: "desc" },
    { publishedAt: "desc" },
  ] satisfies Prisma.PostOrderByWithRelationInput[];
}

export async function getPublishedPosts(filters?: number | PublishedPostFilters) {
  const options = typeof filters === "number" ? { take: filters } : filters;

  return prisma.post.findMany({
    where: {
      ...publishedPostWhere(),
      ...(options?.category
        ? {
            category: {
              slug: options.category,
            },
          }
        : {}),
      ...(options?.tag
        ? {
            tags: {
              some: {
                tag: {
                  slug: options.tag,
                },
              },
            },
          }
        : {}),
    },
    include: postInclude,
    orderBy: getPostOrderBy(options?.sort),
    take: options?.take,
  });
}

export async function getFeaturedPost() {
  return prisma.post.findFirst({
    where: {
      ...publishedPostWhere(),
      OR: [{ featured: true }, { pinned: true }],
    },
    include: postInclude,
    orderBy: [{ pinned: "desc" }, { featured: "desc" }, { publishedAt: "desc" }],
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: {
      ...publishedPostWhere(),
      slug,
    },
    include: postInclude,
  });
}

export async function getPostBySlugOrNotFound(slug: string) {
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return post;
}

export async function getRelatedPosts(post: PublicPost, take = 3) {
  const tagIds = post.tags.map(({ tag }) => tag.id);

  return prisma.post.findMany({
    where: {
      ...publishedPostWhere(),
      id: {
        not: post.id,
      },
      OR: [
        { categoryId: post.categoryId },
        { seriesId: post.seriesId },
        {
          tags: {
            some: {
              tagId: {
                in: tagIds,
              },
            },
          },
        },
      ],
    },
    include: postInclude,
    orderBy: [{ publishedAt: "desc" }],
    take,
  });
}

export async function getCategoriesWithPosts() {
  return prisma.category.findMany({
    include: {
      posts: {
        where: publishedPostWhere(),
        include: postInclude,
        orderBy: [{ publishedAt: "desc" }],
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getTagsWithPosts() {
  return prisma.tag.findMany({
    include: {
      posts: {
        where: {
          post: publishedPostWhere(),
        },
        include: {
          post: {
            include: postInclude,
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getPostsByCategorySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: publishedPostWhere(),
        include: postInclude,
        orderBy: [{ publishedAt: "desc" }],
      },
    },
  });

  if (!category) {
    notFound();
  }

  return category;
}

export async function getPostsByTagSlug(slug: string) {
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        where: {
          post: publishedPostWhere(),
        },
        include: {
          post: {
            include: postInclude,
          },
        },
      },
    },
  });

  if (!tag) {
    notFound();
  }

  return {
    ...tag,
    posts: tag.posts.map(({ post }) => post),
  };
}

export async function getSeriesList() {
  return prisma.series.findMany({
    include: {
      posts: {
        where: publishedPostWhere(),
        include: postInclude,
        orderBy: [{ publishedAt: "desc" }],
      },
    },
    orderBy: { title: "asc" },
  });
}

export async function getSeriesBySlug(slug: string) {
  const series = await prisma.series.findUnique({
    where: { slug },
    include: {
      posts: {
        where: publishedPostWhere(),
        include: postInclude,
        orderBy: [{ publishedAt: "asc" }],
      },
    },
  });

  if (!series) {
    notFound();
  }

  return series;
}

export async function searchPosts(query: string, take?: number) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return prisma.post.findMany({
    where: {
      ...publishedPostWhere(),
      OR: [
        {
          title: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          shortDescription: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
        },
        {
          tags: {
            some: {
              tag: {
                name: {
                  contains: trimmedQuery,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    include: postInclude,
    orderBy: [{ publishedAt: "desc" }],
    take,
  });
}

export async function getArchiveFilters() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return {
    categories,
    tags,
  };
}

export function formatPostDate(date: Date | null) {
  if (!date) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getPostHref(post: Pick<PublicPost, "slug">) {
  return `/blog/${post.slug}`;
}
