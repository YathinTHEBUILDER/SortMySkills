import { getCurrentUser } from "@/lib/auth/get-user";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ROLES_DATABASE } from "@/data/roles";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();

  // 1. Fetch user profile
  let displayName = "Career Builder";
  let targetRoleTitle = "Not Selected";
  let targetRoleKey = "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      displayName = profile.display_name || user.user_metadata?.full_name || "Career Builder";
      targetRoleKey = profile.target_role || "";
      const targetRoleObj = ROLES_DATABASE.find((r) => r.id === targetRoleKey);
      targetRoleTitle = targetRoleObj ? targetRoleObj.title : "Not Selected";
    } else {
      displayName = user.user_metadata?.full_name || "Career Builder";
    }
  }

  const roleText = user?.user_metadata?.role
    ? (user.user_metadata.role as string).replace("_", " ").toUpperCase()
    : "MEMBER";

  // 2. Fetch parallel activity statistics
  let auditsCount = 0;

  if (user) {
    const auditsRes = await supabase
      .from("skill_audits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    auditsCount = auditsRes.count || 0;
  }

  // Privacy Fix: Mask full email as requested (madeinruntime@gmail.com -> madeinruntime@...)
  let maskedEmail = "";
  if (user?.email) {
    const parts = user.email.split("@");
    maskedEmail = `${parts[0]}@...`;
  }

  return (
    <DashboardClient
      displayName={displayName}
      targetRoleTitle={targetRoleTitle}
      targetRoleKey={targetRoleKey}
      realAuditsCount={auditsCount}
      maskedEmail={maskedEmail}
      roleText={roleText}
    />
  );
}
