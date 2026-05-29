import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

/**
 * Retrieves the current authenticated user from Supabase securely on the server.
 * This is safe to use in Server Components, Server Actions, and Route Handlers.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

/**
 * Asserts that a user is logged in. If not, performs a Next.js server-side redirect to the login page.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Helper to fetch the authenticated user's role from user_metadata.
 */
export async function getUserRole(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.user_metadata?.role ?? null;
}
