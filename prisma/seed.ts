import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PostStatus,
  PrismaClient,
  UserRole,
} from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@gamil.com";

const categories = [
  {
    name: "Life",
    slug: "life",
    description: "Personal reflections, routines, and everyday observations.",
  },
  {
    name: "Tech",
    slug: "tech",
    description: "Technical notes, experiments, and learning logs.",
  },
  {
    name: "Travel",
    slug: "travel",
    description: "Places, movement, memory, and visual travel notes.",
  },
  {
    name: "Projects",
    slug: "projects",
    description: "Behind the scenes notes from work and creative builds.",
  },
  {
    name: "Thoughts",
    slug: "thoughts",
    description: "Essays and slower thinking on ideas worth keeping.",
  },
];

const tags = [
  { name: "Reflective", slug: "reflective" },
  { name: "Personal", slug: "personal" },
  { name: "Lessons", slug: "lessons" },
  { name: "Behind the Scenes", slug: "behind-the-scenes" },
  { name: "Learning", slug: "learning" },
  { name: "Writing", slug: "writing" },
];

const posts = [
  {
    title: "The gentle art of noticing",
    slug: "the-gentle-art-of-noticing",
    shortDescription:
      "A note on paying attention to ordinary moments before they disappear into routine.",
    content:
      "Noticing is a small practice. It begins with giving ordinary things enough time to become visible: the desk before work starts, the quiet after a walk, the sentence that stays after a book is closed.",
    categorySlug: "thoughts",
    tagSlugs: ["reflective", "personal", "writing"],
    featured: true,
    pinned: true,
    publishedAt: new Date("2026-06-15T09:00:00.000Z"),
    readingTimeMinutes: 3,
    authorNote:
      "This post sets the tone for the blog: quiet, personal, and observant.",
    behindThePost:
      "Inspired by the project brief's focus on calm editorial reading and personal memory.",
  },
  {
    title: "Keeping a notebook that actually helps",
    slug: "keeping-a-notebook-that-actually-helps",
    shortDescription:
      "Simple ways to capture unfinished thoughts, article sparks, and patterns worth revisiting.",
    content:
      "A useful notebook is not an archive of perfect ideas. It is a place where half-shaped observations can wait long enough to become useful.",
    categorySlug: "life",
    tagSlugs: ["lessons", "writing"],
    featured: false,
    pinned: false,
    publishedAt: new Date("2026-06-18T09:00:00.000Z"),
    readingTimeMinutes: 4,
    authorNote:
      "Written as a practical companion to the blog's reflective writing style.",
  },
  {
    title: "Building my personal archive",
    slug: "building-my-personal-archive",
    shortDescription:
      "Why a personal blog can become more useful when it remembers what readers care about.",
    content:
      "A personal archive is more than a list of posts. It can hold reading history, saved pieces, comments, reactions, and the small trails that help readers return.",
    categorySlug: "projects",
    tagSlugs: ["behind-the-scenes", "learning"],
    featured: false,
    pinned: false,
    publishedAt: new Date("2026-06-22T09:00:00.000Z"),
    readingTimeMinutes: 5,
    authorNote:
      "This post explains the reader-memory idea behind the product direction.",
    behindThePost:
      "Connected to the planned features for saved posts, reactions, comments, and recently viewed posts.",
  },
];

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Tejaswi",
      username: "tejaswi",
      role: UserRole.ADMIN,
      bio: "Writer and curator of Tejaswi Blog.",
    },
    create: {
      email: adminEmail,
      name: "Tejaswi",
      username: "tejaswi",
      role: UserRole.ADMIN,
      bio: "Writer and curator of Tejaswi Blog.",
    },
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }

  const series = await prisma.series.upsert({
    where: { slug: "building-tejaswi-blog" },
    update: {
      title: "Building Tejaswi Blog",
      description:
        "A behind-the-scenes series about shaping a calm personal publishing platform.",
    },
    create: {
      title: "Building Tejaswi Blog",
      slug: "building-tejaswi-blog",
      description:
        "A behind-the-scenes series about shaping a calm personal publishing platform.",
    },
  });

  for (const post of posts) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: post.categorySlug },
    });

    const createdPost = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        status: PostStatus.PUBLISHED,
        featured: post.featured,
        pinned: post.pinned,
        publishedAt: post.publishedAt,
        readingTimeMinutes: post.readingTimeMinutes,
        authorNote: post.authorNote,
        behindThePost: post.behindThePost,
        authorId: admin.id,
        categoryId: category.id,
        seriesId: series.id,
      },
      create: {
        title: post.title,
        slug: post.slug,
        shortDescription: post.shortDescription,
        content: post.content,
        status: PostStatus.PUBLISHED,
        featured: post.featured,
        pinned: post.pinned,
        publishedAt: post.publishedAt,
        readingTimeMinutes: post.readingTimeMinutes,
        authorNote: post.authorNote,
        behindThePost: post.behindThePost,
        authorId: admin.id,
        categoryId: category.id,
        seriesId: series.id,
      },
    });

    for (const tagSlug of post.tagSlugs) {
      const tag = await prisma.tag.findUniqueOrThrow({
        where: { slug: tagSlug },
      });

      await prisma.postTag.upsert({
        where: {
          postId_tagId: {
            postId: createdPost.id,
            tagId: tag.id,
          },
        },
        update: {},
        create: {
          postId: createdPost.id,
          tagId: tag.id,
        },
      });
    }
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: "reader@example.com" },
    update: {
      name: "Sample Reader",
      active: true,
    },
    create: {
      email: "reader@example.com",
      name: "Sample Reader",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
