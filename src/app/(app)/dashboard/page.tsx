import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
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
      {/* 1. Frosted Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-[var(--border-muted)]">
        <PageHeader
          title={`Welcome back, ${displayName}`}
          description="Your premium workspace for structured career intelligence."
        />

        {user && (
          <div className="shrink-0 rounded-2xl border border-[var(--border-muted)] bg-surface-card p-3 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary border border-accent-primary/20">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight pr-2">
              <span className="eyebrow block text-[8px] tracking-widest">{roleText}</span>
              <p className="text-[10px] text-text-secondary mt-0.5">{user.email}</p>
            </div>
            <div className="border-l border-[var(--border-muted)] pl-3">
              <Link
                href="/profile"
                className="text-[10px] font-mono uppercase tracking-widest text-accent-primary hover:underline"
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 2. Career Readiness Twin Snapshot Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="premium-card lg:col-span-2 relative overflow-hidden animated-border">
          <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
          <CardHeader
            title="Career Readiness Twin"
            description="Live simulation of your placement readiness."
            className="border-b border-[var(--border-muted)] relative z-10"
          />
          <CardBody className="pt-5 relative z-10 space-y-4 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--surface-soft)]/30 border border-[var(--border-muted)] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-text-muted uppercase">Target Placement</span>
                  <p className="text-sm font-bold text-text-primary mt-0.5">{targetRoleTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-mono text-[8px] text-text-muted uppercase">Match strength</span>
                  <p className="text-sm font-bold text-accent-primary mt-0.5">
                    {targetRoleKey ? (auditsCount > 0 ? "Roadmap Engaged" : "Audit Pending") : "Not Set"}
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] bg-surface-card hover:bg-surface-hover transition-all text-[9px] font-mono uppercase tracking-wider font-bold text-text-primary"
                >
                  Configure
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/20">
                <span className="block font-mono text-[8px] text-text-muted uppercase">Audits Logs</span>
                <p className="text-lg font-bold text-text-primary mt-1">{auditsCount} run</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/20">
                <span className="block font-mono text-[8px] text-text-muted uppercase">Resume Matches</span>
                <p className="text-lg font-bold text-text-primary mt-1">{jobMatchesCount} compiled</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/20">
                <span className="block font-mono text-[8px] text-text-muted uppercase">Parsed CVs</span>
                <p className="text-lg font-bold text-text-primary mt-1">{parserCount} tags</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recommended Actions */}
        <Card className="premium-card lg:col-span-1 relative overflow-hidden flex flex-col justify-between">
          <CardHeader
            title="Next Step Recommendation"
            description="Recommended task to optimize your readiness."
            className="border-b border-[var(--border-muted)]"
          />
          <CardBody className="pt-5 flex flex-col justify-between flex-1 text-left space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                <AlertTriangle className="w-4 h-4 text-accent-primary" />
                <span>Optimize Your Skill DNA</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {targetRoleKey 
                  ? `Bridge gaps for your target role "${targetRoleTitle}" by running a comprehensive Skill Audit.`
                  : "Go to your Profile settings to select a target engineering role. This connects your planner and preparation kits."}
              </p>
            </div>
            
            <Link
              href={targetRoleKey ? "/skill-development" : "/profile"}
              className="w-full py-2.5 rounded-xl bg-accent-primary hover:bg-accent-primary-dark transition-all text-xs font-mono uppercase tracking-widest text-[#F8F3EA] font-semibold text-center flex items-center justify-center gap-2 mt-4"
            >
              <span>{targetRoleKey ? "Go to Skill Planner" : "Set Target Role"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* 3. Platform Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="premium-card relative overflow-hidden group">
            <CardBody className="py-5 px-6 flex flex-col justify-between h-full relative z-10 text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-xl font-bold text-text-primary tracking-tight font-mono">{s.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 4. Core Placement Utilities Section */}
      <div className="space-y-5 text-left">
        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">Core Workspace Utilities</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map(({ href, title, description, icon: Icon, badge }) => (
            <Link key={href} href={href} className="group">
              <Card className="premium-card h-full transition-all duration-300 group-hover:border-accent-primary relative overflow-hidden flex flex-col justify-between">
                <CardBody className="flex flex-col h-full p-6 relative z-10">
                  <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-[var(--surface-soft)]/50 border border-[var(--border-muted)] flex items-center justify-center text-accent-primary group-hover:text-[#F8F3EA] group-hover:bg-accent-primary transition-all duration-300">
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider px-2 py-0.5 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/40">
                      {badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-text-primary text-base group-hover:text-accent-primary transition-colors tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-3 leading-relaxed flex-1">
                    {description}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-accent-primary mt-6 pt-3 border-t border-[var(--border-muted)] font-bold">
                    <span>Open Utility</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
