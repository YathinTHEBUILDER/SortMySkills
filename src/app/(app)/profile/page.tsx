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
    <div className="space-y-10 animate-fade-in relative z-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-[var(--border-muted)]">
        <PageHeader
          title="Account Profile"
          description="Manage your career credentials, targets, and security details."
        />
      </div>

      {/* Main Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Premium Summary & Stats */}
        <div className="space-y-8 lg:col-span-1">
          {/* Visual card */}
          <Card className="premium-card relative overflow-hidden animated-border">
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
              <p className="text-xs font-mono text-text-muted mt-0.5 select-all">{user.email}</p>

              {/* Status Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)]/50">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-primary" />
                <span className="text-[9px] font-mono font-bold tracking-widest text-text-primary">
                  {memberStatusText}
                </span>
              </div>

              <div className="w-full border-t border-[var(--border-muted)] my-5" />

              {/* Predefined Targets Info */}
              <div className="w-full text-left space-y-4">
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
            </CardBody>
          </Card>

          {/* Activity / Placement Stats Card */}
          <Card className="premium-card relative overflow-hidden">
            <CardHeader
              title="Workspace Intelligence"
              description="A live record of your career preparations."
              className="border-b border-[var(--border-muted)]"
            />
            <CardBody className="pt-5 space-y-4.5">
              {/* Stat 1 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/35 group hover:border-accent-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/15 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-[#F6F1E8] transition-all">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary leading-tight">Skill Audits</p>
                    <p className="text-[10px] text-text-muted">Target gaps mapped</p>
                  </div>
                </div>
                <span className="text-base font-bold text-text-primary font-mono">{stats.audits}</span>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/35 group hover:border-accent-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/15 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-[#F6F1E8] transition-all">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary leading-tight">JD Analyses</p>
                    <p className="text-[10px] text-text-muted">Resumes matched</p>
                  </div>
                </div>
                <span className="text-base font-bold text-text-primary font-mono">{stats.analyses}</span>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/35 group hover:border-accent-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/10 border border-accent-primary/15 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-[#F6F1E8] transition-all">
                    <ScanSearch className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary leading-tight">Parsed Resumes</p>
                    <p className="text-[10px] text-text-muted">Keywords normalized</p>
                  </div>
                </div>
                <span className="text-base font-bold text-text-primary font-mono">{stats.parser}</span>
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
