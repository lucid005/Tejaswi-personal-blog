-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('READER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'HIDDEN', 'REPORTED');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'THOUGHTFUL', 'USEFUL', 'INSPIRING', 'RELATABLE');

-- CreateEnum
CREATE TYPE "GuestbookStatus" AS ENUM ('PENDING', 'APPROVED', 'HIDDEN');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'READER',
    "bio" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "readingTimeMinutes" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "scheduledFor" TIMESTAMP(3),
    "authorNote" TEXT,
    "behindThePost" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImageUrl" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "seriesId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostTag" (
    "postId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'PENDING',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "parentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" UUID NOT NULL,
    "type" "ReactionType" NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedPost" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingHistory" (
    "id" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ReadingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestbookEntry" (
    "id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "status" "GuestbookStatus" NOT NULL DEFAULT 'PENDING',
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestbookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_status_publishedAt_idx" ON "Post"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Post_categoryId_idx" ON "Post"("categoryId");

-- CreateIndex
CREATE INDEX "Post_seriesId_idx" ON "Post"("seriesId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "PostTag_tagId_idx" ON "PostTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Series_slug_key" ON "Series"("slug");

-- CreateIndex
CREATE INDEX "Comment_postId_status_idx" ON "Comment"("postId", "status");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "Reaction_userId_idx" ON "Reaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_postId_userId_type_key" ON "Reaction"("postId", "userId", "type");

-- CreateIndex
CREATE INDEX "SavedPost_userId_idx" ON "SavedPost"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPost_postId_userId_key" ON "SavedPost"("postId", "userId");

-- CreateIndex
CREATE INDEX "ReadingHistory_userId_lastReadAt_idx" ON "ReadingHistory"("userId", "lastReadAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingHistory_postId_userId_key" ON "ReadingHistory"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE INDEX "GuestbookEntry_status_createdAt_idx" ON "GuestbookEntry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "GuestbookEntry_userId_idx" ON "GuestbookEntry"("userId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestbookEntry" ADD CONSTRAINT "GuestbookEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
