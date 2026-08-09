import { isConfiguredAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Viewer = {
  email: string;
  name: string | null;
  isAdmin: boolean;
};

// Deliberately does not touch the database. The navbar only needs a label and
// an admin flag, and this runs on every page render — getCurrentReader() would
// fire an upsert each time for the same answer.
export async function getViewer(): Promise<Viewer | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const name = user.user_metadata?.name;

  return {
    email: user.email,
    name: typeof name === "string" && name.trim() ? name.trim() : null,
    isAdmin: isConfiguredAdmin(user.email),
  };
}
