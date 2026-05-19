import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db/client";
import { Unauthorized } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SessionContext = {
  userId: string;
  email: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
};

export const getSession = cache(async (): Promise<SessionContext | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const org = await db.query.organizations.findFirst({
    where: (o, { eq }) => eq(o.ownerId, data.user.id),
  });

  if (!org) {
    // The handle_new_user trigger creates an org on signup; missing means the
    // user predates the trigger or RLS misfired. Surface as a hard error.
    throw new Error(`No organization found for user ${data.user.id}`);
  }

  return {
    userId: data.user.id,
    email: data.user.email ?? "",
    organizationId: org.id,
    organizationName: org.name,
    organizationSlug: org.slug,
  };
});

export async function requireSession(): Promise<SessionContext> {
  const session = await getSession();
  if (!session) throw Unauthorized();
  return session;
}

export async function requireSessionOrRedirect(nextPath?: string): Promise<SessionContext> {
  const session = await getSession();
  if (!session) {
    const target = nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login";
    redirect(target);
  }
  return session;
}
