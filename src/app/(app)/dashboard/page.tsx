import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth/get-user";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ROLES_DATABASE } from "@/data/roles";

export const dynamic = "force-dynamic";

import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  User,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  Award,
} from "lucide-react";

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
    ? user.user_metadata.role.replace("_", " ").toUpperCase()
    : "MEMBER";

  // 2. Fetch parallel activity statistics
  let auditsCount = 0;
  let jobMatchesCount = 0;
  let parserCount = 0;

  if (user) {
    const [auditsRes, analysesRes, parserRes] = await Promise.all([
      supabase.from("skill_audits").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("job_analyses").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("parser_history").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    ]);
    auditsCount = auditsRes.count || 0;
    jobMatchesCount = analysesRes.count || 0;
    parserCount = parserRes.count || 0;
  }

  // Predefined stats
  const stats = [
    { label: "Skill Aliases", value: "60+", icon: Sparkles, color: "text-accent-secondary" },
    { label: "Interview Questions", value: "900+", icon: BookOpen, color: "text-accent-primary" },
    { label: "Role Packs", value: "6 Profiles", icon: TrendingUp, color: "text-accent-tertiary" },
    { label: "Planner Roles", value: "5 Career Targets", icon: Zap, color: "text-accent-primary" },
  ];

  const tools = [
    {
      href: "/skill-development",
      title: "Skill Planner & Auditor",
      description: "Audit required tech stacks for your target role, compute readiness ratings, and map Coursera bridges.",
      icon: Compass,
      badge: "Placement Roadmap",
    },
    {
      href: "/job-match",
      title: "Job Match Analyzer",
      description: "Dual comparison engine evaluating your resume tags against specific placement descriptions.",
      icon: Briefcase,
      badge: "Gap Radar",
    },
    {
      href: "/interview-packs",
      title: "Placement Mock Packs",
      description: "Practice 900+ structured placement evaluation questions categorized by difficulty and level.",
      icon: BookOpen,
      badge: "Placement Ready",
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in relative z-10">
      {/* 1. Technical Header Grid */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-[var(--border-strong)]">
        <PageHeader
          title={
            <>
              Welcome back, <span className="font-serif italic font-normal text-accent-primary">{displayName}</span>
            </>
          }
          description="Your premium workspace for structured career intelligence."
        />

        {user && (
          <div className="shrink-0 border border-[var(--border-strong)] bg-surface-card p-3 shadow-xs flex items-center gap-3 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 dot-grid-overlay opacity-10 pointer-events-none" />
            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary border border-accent-primary/20 relative z-10">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left leading-tight pr-2 relative z-10">
              <span className="eyebrow block text-[8px] tracking-widest">{roleText}</span>
              <p className="text-[10px] text-text-secondary mt-0.5">{user.email}</p>
            </div>
            <div className="border-l border-[var(--border-strong)] pl-3 relative z-10">
              <Link
                href="/profile"
                className="text-[9px] font-mono uppercase tracking-widest text-accent-primary hover:underline font-bold"
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 2. Career Readiness Twin Snapshot Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl overflow-hidden lg:col-span-2 relative flex flex-col justify-between">
          <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
          <div className="px-6 py-5 border-b border-[var(--border-strong)] relative z-10 flex justify-between items-center bg-[var(--surface-soft)]/10">
            <div>
              <h2 className="text-sm font-mono uppercase tracking-widest text-text-primary font-bold">Career Readiness Twin</h2>
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mt-0.5">Live simulation of your placement readiness</p>
            </div>
            <Award className="w-5 h-5 text-accent-primary" />
          </div>
          
          <div className="p-6 relative z-10 space-y-4 text-left flex-1 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--surface-soft)]/30 border border-[var(--border-strong)] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider">Target Placement</span>
                  <p className="text-xs font-bold text-text-primary mt-0.5">{targetRoleTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider">Match strength</span>
                  <p className="text-xs font-bold text-accent-primary mt-0.5">
                    {targetRoleKey ? (auditsCount > 0 ? "Roadmap Engaged" : "Audit Pending") : "Not Set"}
                  </p>
                </div>
                <ButtonLink
                  href="/profile"
                  variant="secondary"
                  className="py-1 px-3 text-[8px]"
                >
                  Configure
                </ButtonLink>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-soft)]/20">
                <span className="block font-mono text-[8px] text-text-muted uppercase tracking-wider">Audits Logs</span>
                <p className="text-base font-bold text-text-primary mt-1 font-mono">{auditsCount} run</p>
              </div>
              <div className="p-3.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-soft)]/20">
                <span className="block font-mono text-[8px] text-text-muted uppercase tracking-wider">Resume Matches</span>
                <p className="text-base font-bold text-text-primary mt-1 font-mono">{jobMatchesCount} compiled</p>
              </div>
              <div className="p-3.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-soft)]/20">
                <span className="block font-mono text-[8px] text-text-muted uppercase tracking-wider">Parsed CVs</span>
                <p className="text-base font-bold text-text-primary mt-1 font-mono">{parserCount} tags</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl overflow-hidden lg:col-span-1 relative flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-[var(--border-strong)] bg-[var(--surface-soft)]/10">
            <h2 className="text-sm font-mono uppercase tracking-widest text-text-primary font-bold">Recommendations</h2>
            <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mt-0.5">Next actionable learning bridge</p>
          </div>
          
          <div className="p-6 flex flex-col justify-between flex-1 text-left space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary font-mono uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-accent-primary" />
                <span>Optimize Skill DNA</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed font-mono uppercase tracking-tight">
                {targetRoleKey 
                  ? `Bridge stacks for your target role "${targetRoleTitle}" by running a comprehensive Skill Audit in your planner dashboard.`
                  : "Select a target developer role inside settings. This dynamically updates and activates your learning planner metrics."}
              </p>
            </div>
            
            <ButtonLink
              href={targetRoleKey ? "/skill-development" : "/profile"}
              variant="primary"
              className="w-full mt-4"
            >
              <span>{targetRoleKey ? "Go to Skill Planner" : "Set Target Role"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* 3. Platform Stats Unified Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-[var(--border-strong)] bg-surface-card rounded-2xl overflow-hidden divide-x divide-y lg:divide-y-0 divide-[var(--border-strong)]">
        {stats.map((s) => (
          <div key={s.label} className="p-5 flex flex-col justify-between h-full relative group bg-surface-card hover:bg-surface-card-warm/50 transition-colors">
            <div className="absolute inset-0 dot-grid-overlay opacity-[0.08] pointer-events-none" />
            <div className="flex justify-between items-center mb-4 relative z-10">
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">{s.label}</span>
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
            </div>
            <p className="text-xl font-bold text-text-primary tracking-tight font-mono relative z-10">{s.value}</p>
          </div>
        ))}
      </div>

      {/* 4. Core Placement Utilities Section */}
      <div className="space-y-4 text-left">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Core Workspace Utilities</h2>
        
        <div className="grid md:grid-cols-3 border border-[var(--border-strong)] bg-surface-card rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-[var(--border-strong)]">
          {tools.map(({ href, title, description, icon: Icon, badge }) => (
            <Link key={href} href={href} className="group flex flex-col justify-between p-6 relative hover:bg-surface-card-warm/50 transition-colors">
              <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4 mb-5">
                  <div className="w-8.5 h-8.5 rounded-lg bg-[var(--surface-soft)]/50 border border-[var(--border-strong)] flex items-center justify-center text-accent-primary group-hover:text-background group-hover:bg-accent-primary transition-all duration-200">
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest px-2 py-0.5 rounded-md border border-[var(--border-muted)] bg-[var(--surface-soft)]/45 font-bold">
                    {badge}
                  </span>
                </div>

                <h3 className="font-bold text-text-primary text-sm group-hover:text-accent-primary transition-colors tracking-tight font-mono uppercase">
                  {title}
                </h3>
                <p className="text-[11px] text-text-secondary mt-3 leading-relaxed font-mono uppercase tracking-tight">
                  {description}
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-accent-primary mt-6 pt-4 border-t border-[var(--border-muted)] font-bold">
                <span>Open Utility</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

