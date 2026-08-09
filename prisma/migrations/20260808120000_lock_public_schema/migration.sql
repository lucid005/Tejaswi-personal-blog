-- Lock the public schema against Supabase's public API roles.
--
-- See docs/adr/0001-revoke-anon-access-instead-of-rls-policies.md
--
-- This application never queries a table through the Supabase client: Supabase
-- is used for auth and file storage only, and Postgres is reached through Prisma
-- as the table-owning role. Authorization lives in the server actions.
--
-- Row-level security is enabled below with ZERO policies, as a default-deny
-- backstop. Table owners bypass RLS unless FORCE ROW LEVEL SECURITY is set,
-- which it deliberately is not -- so the application is unaffected.
--
-- DO NOT "fix" this by adding policies. The grants ARE the security model.
-- Adding policies would duplicate authorization that already lives in the
-- server actions, leaving two places to keep in sync.

-- Supabase always provisions these roles; the guard keeps the migration usable
-- on a plain Postgres instance for local development.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon')
     AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN

    -- Existing objects.
    REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon, authenticated;
    REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
    REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;
    REVOKE USAGE ON SCHEMA public FROM anon, authenticated;

    -- Objects created later inherit the lockout, so a future table is closed
    -- without anyone having to remember this file exists.
    ALTER DEFAULT PRIVILEGES IN SCHEMA public
      REVOKE ALL ON TABLES FROM anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public
      REVOKE ALL ON SEQUENCES FROM anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public
      REVOKE ALL ON FUNCTIONS FROM anon, authenticated;

  END IF;
END
$$;

-- Default-deny backstop. No policies follow, deliberately.
ALTER TABLE "User"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag"                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PostTag"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Series"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reaction"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedPost"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReadingHistory"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GuestbookEntry"       ENABLE ROW LEVEL SECURITY;
