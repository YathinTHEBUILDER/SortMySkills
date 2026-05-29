import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Route handler to process the auth code exchange flow.
 * Triggered by Supabase confirmation emails or password reset clicks.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  // Sanitize next parameter to prevent Open Redirect vulnerabilities
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }
      
      console.error("Exchange code error:", error.message);
    } catch (err) {
      console.error("Callback session exchange unexpected failure:", err);
    }
  }

  // If exchange fails or no code, redirect to login with a error parameter
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
