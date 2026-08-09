-- Two model corrections.
--
-- 1. Scheduling becomes a PUBLISHED post with a future publishedAt. The
--    SCHEDULED status was opting posts out of the visibility filter that
--    already implements scheduling, so it is removed along with scheduledFor.
--
-- 2. A reader holds at most one reaction per post. The old constraint allowed
--    one row per type (up to five per reader), which contradicted the handler.

-- Preserve intent before dropping the column: anything scheduled becomes a
-- published post dated for when it was meant to appear.
UPDATE "Post"
SET "publishedAt" = COALESCE("scheduledFor", "publishedAt", now()),
    "status"      = 'PUBLISHED'
WHERE "status" = 'SCHEDULED';

ALTER TABLE "Post" DROP COLUMN "scheduledFor";

-- Postgres cannot drop an enum value in place; the type has to be rebuilt.
ALTER TYPE "PostStatus" RENAME TO "PostStatus_old";
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

ALTER TABLE "Post" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Post"
  ALTER COLUMN "status" TYPE "PostStatus"
  USING ("status"::text::"PostStatus");
ALTER TABLE "Post" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

DROP TYPE "PostStatus_old";

-- Collapse readers holding several reactions on one post down to their most
-- recent, so the tighter constraint can apply.
DELETE FROM "Reaction" a
USING "Reaction" b
WHERE a."postId" = b."postId"
  AND a."userId" = b."userId"
  AND (a."createdAt" < b."createdAt"
       OR (a."createdAt" = b."createdAt" AND a."id" < b."id"));

DROP INDEX "Reaction_postId_userId_type_key";
CREATE UNIQUE INDEX "Reaction_postId_userId_key"
  ON "Reaction" ("postId", "userId");
