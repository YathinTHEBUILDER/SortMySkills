import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth/get-user";
import { signOutAction } from "@/app/actions/auth";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  User,
  LogOut,
  Sparkles,
  Zap,
  TrendingUp
} from "lucide-react";

const tools = [
  {
    href: "/skill-development",
    title: "Skill Planner",
    description: "Target engineering roles, audit required skills, and generate Coursera-mapped roadmaps.",
    icon: Compass,
    badge: "Roadmap Builder"
  },
  {
    href: "/job-match",
    title: "Job Description Matcher",
    description: "Compare your resume against any job description to evaluate gaps and matching scores.",
    icon: Briefcase,
    badge: "Matrix Analyser"
  },
  {
    href: "/interview-packs",
    title: "Placement Interview Packs",
    description: "Practice 900+ questions categorized by difficulty for junior, mid, and senior roles.",
    icon: BookOpen,
    badge: "Placement Ready"
  },
];

const stats = [
  { label: "Skill Aliases", value: "60+", icon: Sparkles, color: "text-accent-secondary" },
  { label: "Interview Questions", value: "900+", icon: BookOpen, color: "text-accent-primary" },
  { label: "Role Packs", value: "6 Profiles", icon: TrendingUp, color: "text-accent-green" },
  { label: "Planner Roles", value: "5 Career Targets", icon: Zap, color: "text-accent-primary" },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const fullName = user?.user_metadata?.full_name || "Career Builder";
  const roleText = user?.user_metadata?.role
    ? user.user_metadata.role.replace("_", " ").toUpperCase()
    : "MEMBER";

  return (
    <div className="space-y-10 animate-fade-in relative z-10">
      {/* 1. Header & Quick Sign-out */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-[var(--border-muted)]">
        <PageHeader
          title={`Welcome back, ${fullName}`}
          description="Your premium placement intelligence workspace."
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
            <form action={signOutAction} className="border-l border-[var(--border-muted)] pl-3">
              <button
                type="submit"
                title="Sign out"
                className="p-2 rounded-lg hover:bg-red-500/10 text-text-secondary hover:text-red-400 cursor-pointer transition-colors border border-transparent hover:border-red-500/10"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 2. Platform Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="premium-card relative overflow-hidden group">
            <CardBody className="py-5 px-6 flex flex-col justify-between h-full relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-text-primary tracking-tight">{s.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 3. Core Placement Utilities Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-text-muted">Core Placement Utilities</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map(({ href, title, description, icon: Icon, badge }) => (
            <Link key={href} href={href} className="group">
              <Card className="premium-card h-full transition-all duration-300 group-hover:border-accent-primary relative overflow-hidden flex flex-col justify-between">
                <CardBody className="flex flex-col h-full p-6 relative z-10">
                  <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-[var(--surface-soft)]/50 border border-[var(--border-muted)] flex items-center justify-center text-accent-primary group-hover:text-[#F6F1E8] group-hover:bg-accent-primary transition-all duration-300">
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--border-muted)] bg-[var(--surface-soft)]/40">
                      {badge}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-text-primary text-base group-hover:text-accent-primary transition-colors tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-3 leading-relaxed flex-1">
                    {description}
                  </p>
                  
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-accent-primary mt-6 pt-3 border-t border-[var(--border-muted)]">
                    <span>Open Tool</span> 
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
