import React from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { requireUser } from "@/lib/auth/get-user";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ROLES_DATABASE } from "@/data/roles";
import ProfileForm from "@/components/dashboard/ProfileForm";

export const dynamic = "force-dynamic";

import {
  Compass,
  Briefcase,
  ScanSearch,
  Calendar,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default async function ProfilePage() {
  // 1. Authenticate user
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  // 2. Fetch or create profile row
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const defaultDisplayName =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Career Builder";
    const defaultTargetRole = ROLES_DATABASE[0]?.id || "";

    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        display_name: defaultDisplayName,
        target_role: defaultTargetRole,
      })
      .select()
      .single();

    if (newProfile) {
      profile = newProfile;
    }
  }

  // 3. Parallel database count queries for activity stats (optimized head: true)
  const [auditsRes, analysesRes, parserRes] = await Promise.all([
    supabase
      .from("skill_audits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("job_analyses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("parser_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const stats = {
    audits: auditsRes.count || 0,
    analyses: analysesRes.count || 0,
    parser: parserRes.count || 0,
  };

  const displayName = profile?.display_name || "Career Builder";
  const targetRoleKey = profile?.target_role || "";
  const targetRoleObj = ROLES_DATABASE.find((r) => r.id === targetRoleKey);
  const targetRoleTitle = targetRoleObj ? targetRoleObj.title : "Not Selected";

  const memberStatusRaw = user.user_metadata?.role || "student";
  const memberStatusText =
    memberStatusRaw.replace("_", " ").toUpperCase();

  // Generate clean initials for the avatar
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CB";

  const formattedJoinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <PageHeader
        title="Account Profile"
        description="Manage your career credentials, targets, and security details."
      />

      {/* Main Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Summary & Stats */}
        <div className="lg:col-span-1">
          <Card className="premium-card relative overflow-hidden animated-border h-full">
            <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
            <CardBody className="pt-6 relative z-10 flex flex-col items-center text-center">
              {/* Avatar circle */}
              <div className="w-20 h-20 rounded-full bg-accent-primary/10 border-2 border-accent-primary/30 flex items-center justify-center text-accent-primary text-xl font-mono font-bold shadow-md relative group overflow-hidden mb-4 transition-all hover:scale-105">
                <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <span className="relative z-10">{initials}</span>
              </div>

              {/* Names */}
              <h2 className="text-lg font-bold text-text-primary tracking-tight leading-snug">
                {displayName}
              </h2>
              <p className="text-[10px] font-mono text-accent-primary mt-1.5 border border-accent-primary/20 bg-accent-primary/[0.04] px-2.5 py-0.5 rounded-lg select-all max-w-full truncate">
                {user.email}
              </p>

              {/* Status Badge */}
              <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent-secondary/35 bg-accent-secondary/[0.08] text-text-primary">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-secondary" />
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase">
                  {memberStatusText}
                </span>
              </div>

              <div className="w-full border-t border-[var(--border-muted)] my-6" />

              {/* Targets & Created */}
              <div className="w-full text-left space-y-4 mb-8">
                <div>
                  <span className="eyebrow block text-[8px] tracking-widest mb-1">Target Placement</span>
                  <div className="flex items-center gap-2 text-sm text-text-primary font-medium">
                    <Briefcase className="w-4 h-4 text-accent-primary shrink-0" />
                    <span>{targetRoleTitle}</span>
                  </div>
                </div>
                <div>
                  <span className="eyebrow block text-[8px] tracking-widest mb-1">Account Created</span>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="w-4 h-4 text-text-muted shrink-0" />
                    <span>{formattedJoinDate}</span>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-[var(--border-muted)] pt-6 space-y-4">
                <span className="eyebrow block text-[8px] tracking-widest text-center mb-2">Workspace Activity</span>
                {/* Stat 1 */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/20 hover:border-accent-primary/30 transition-all hover:scale-[1.02] shadow-xs group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/15 flex items-center justify-center text-accent-primary">
                      <Compass className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-text-primary">Skill Audits</p>
                  </div>
                  <span className="text-sm font-bold text-text-primary font-mono">{stats.audits}</span>
                </div>
                {/* Stat 2 */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/20 hover:border-accent-primary/30 transition-all hover:scale-[1.02] shadow-xs group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/15 flex items-center justify-center text-accent-primary">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-text-primary">JD Analyses</p>
                  </div>
                  <span className="text-sm font-bold text-text-primary font-mono">{stats.analyses}</span>
                </div>
                {/* Stat 3 */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/20 hover:border-accent-primary/30 transition-all hover:scale-[1.02] shadow-xs group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/15 flex items-center justify-center text-accent-primary">
                      <ScanSearch className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-text-primary">Parsed Resumes</p>
                  </div>
                  <span className="text-sm font-bold text-text-primary font-mono">{stats.parser}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2">
          <Card className="premium-card relative overflow-hidden">
            <div className="absolute inset-0 grid-bg-overlay opacity-10 pointer-events-none" />
            <CardHeader
              title="Profile Settings"
              description="Customize how your career targets and credentials appear in evaluations."
              className="border-b border-[var(--border-muted)] relative z-10"
            />
            <CardBody className="pt-6 relative z-10">
              <ProfileForm
                initialDisplayName={profile?.display_name || ""}
                initialTargetRole={profile?.target_role || ""}
                initialRole={memberStatusRaw as "student" | "graduate" | "job_seeker" | "admin"}
                email={user.email || ""}
              />
            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  );
}
