import { PostStatus, Prisma } from "@/generated/prisma/client";

/**
 * The single rule for what the public may see: a Post is visible only once it
 * is published AND its publish date has arrived.
 *
 * The second half is what makes scheduling work — a post published with a
 * future date stays invisible until then, with no cron or queue involved.
 * Every public read path and both discovery routes inherit this, so a draft
 * cannot leak through a route that forgot to filter.
 */
export const publishedPostWhere = () =>
  ({
    status: PostStatus.PUBLISHED,
    publishedAt: {
      lte: new Date(),
    },
  }) satisfies Prisma.PostWhereInput;
