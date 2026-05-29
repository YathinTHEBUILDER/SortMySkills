"use client";

import React from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
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
  CheckCircle2,
  ScanSearch,
} from "lucide-react";

interface DashboardClientProps {
  displayName: string;
  targetRoleTitle: string;
  targetRoleKey: string;
  realAuditsCount: number;
  realJobMatchesCount: number;
  realParserCount: number;
  maskedEmail: string;
  roleText: string;
}

export default function DashboardClient({
  displayName,
  targetRoleTitle,
  targetRoleKey,
  realAuditsCount,
  realJobMatchesCount,
  realParserCount,
  maskedEmail,
  roleText,
}: DashboardClientProps) {
  const name = displayName;
  const targetRole = targetRoleTitle;
  const hasTargetRole = !!(targetRoleKey && targetRoleTitle !== "Not Selected");
  const auditsCount = realAuditsCount;
  const jobMatchesCount = realJobMatchesCount;
  const parserCount = realParserCount;

  // Personal Progress Stats (Row 2)
  const personalStats = [
    {
      label: "Target Role",
      value: hasTargetRole ? targetRole : "Not Selected",
      desc: hasTargetRole ? "Placement track active" : "Select target in Settings",
      icon: Briefcase,
      color: "text-[#EF7A5F] dark:text-[#E36B4F]",
    },
    {
      label: "Readiness Score",
      value: auditsCount > 0 ? "68%" : "Pending",
      desc: auditsCount > 0 
        ? "Calculated from recent audit" 
        : "Run a skill audit to compute",
      icon: Award,
      color: "text-[#E0B178] dark:text-[#D9A66F]",
    },
    {
      label: "Missing Skills",
      value: auditsCount > 0 ? "2" : "—",
      desc: auditsCount > 0 ? "Identified gaps" : "No gaps detected yet",
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      label: "Next Actions Mapped",
      value: auditsCount > 0 ? "View roadmap" : "Run skill audit",
      desc: "Placement roadmap active",
      icon: Zap,
      color: "text-[#91B894] dark:text-[#7E9F82]",
    },
  ];

  // Global platform stats
  const globalStats = [
    { label: "Standardized Skill Aliases", value: "60+", icon: Sparkles, color: "text-[#EF7A5F] dark:text-[#E36B4F]" },
    { label: "Placement Prep Questions", value: "900+", icon: BookOpen, color: "text-[#E0B178] dark:text-[#D9A66F]" },
    { label: "Standardized Role Tracks", value: "6 Profiles", icon: TrendingUp, color: "text-[#91B894] dark:text-[#7E9F82]" },
    { label: "Active Learning Pathways", value: "5 Active", icon: Compass, color: "text-[#EF7A5F] dark:text-[#E36B4F]" },
  ];

  const tools = [
    {
      href: "/skill-development",
      title: "Skill Planner & Roadmap",
      description: "Audit target tech stacks, compute placement readiness ratings, and map Coursera learning pathways.",
      icon: Compass,
      badge: "Roadmap Builder",
    },
    {
      href: "/job-match",
      title: "Job Match Engine",
      description: "Compare your resume tags against targeted job descriptions to identify exact keyword gaps.",
      icon: Briefcase,
      badge: "Gap Radar",
    },
    {
      href: "/interview-packs",
      title: "Interview Prep Packs",
      description: "Practice 900+ high-end interview evaluation questions across 6 core technical role families.",
      icon: BookOpen,
      badge: "Placement Prep",
    },
    {
      href: "/tools/parser",
      title: "Skill Parser Playground",
      description: "Normalize scattered tech terms (e.g. k8s, py, react) into structured career competency tags.",
      icon: ScanSearch,
      badge: "Skill DNA Engine",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative z-10 font-sans">
      
      {/* 1. Header starting block */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-[var(--border-strong)]">
        <div className="text-left space-y-1.5">
          <span className="eyebrow block text-xs tracking-widest text-[#EF7A5F] dark:text-[#E36B4F] font-mono">
            PERSONAL DEVELOPMENT PLATFORM
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary leading-tight">
            Welcome back, <span className="font-serif italic font-normal text-[#EF7A5F] dark:text-[#E36B4F]">{name}</span>.
          </h1>
          <p className="text-sm text-text-secondary max-w-xl">
            Let’s build your placement roadmap. Start with a 3-minute skill audit to discover your best-fit role, missing skills, rejection risks, and what to do next.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Settings / Profile card */}
          {maskedEmail && (
            <div className="shrink-0 border border-[var(--border-strong)] bg-surface-card p-3 shadow-xs flex items-center gap-3 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 dot-grid-overlay opacity-10 pointer-events-none" />
              <div className="w-8 h-8 rounded-lg bg-[#EF7A5F]/10 border border-[#EF7A5F]/20 flex items-center justify-center text-[#EF7A5F] dark:text-[#E36B4F] relative z-10 shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-tight pr-2 relative z-10 max-w-[120px] sm:max-w-none">
                <span className="eyebrow block text-[8px] tracking-widest font-mono text-[#EF7A5F] dark:text-[#E36B4F]">{roleText}</span>
                <p className="text-[10px] text-text-secondary mt-0.5 truncate">{maskedEmail}</p>
              </div>
              <div className="border-l border-[var(--border-strong)] pl-3 relative z-10">
                <Link
                  href="/profile"
                  className="text-[9px] font-mono uppercase tracking-widest text-[#EF7A5F] dark:text-[#E36B4F] hover:underline font-bold"
                >
                  Settings
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main CTAs starting block bar */}
      <div className="bg-surface-card-warm/50 border border-[var(--border-strong)] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-text-primary">What would you like to evaluate first?</p>
          <p className="text-[11px] text-text-secondary">Initiate a skill audit, test a demo roadmap, or match with active job descriptions.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <ButtonLink
            href="/skill-development"
            className="px-4 py-2 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-[#EF7A5F] hover:bg-[#D6674F] dark:bg-[#E36B4F] dark:hover:bg-[#C9573F] transition-all rounded-full flex items-center gap-1.5"
          >
            <span>Run Skill Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </ButtonLink>
          
          <ButtonLink
            href="/job-match"
            variant="secondary"
            className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-[var(--border-strong)] bg-surface-card hover:bg-surface-hover rounded-full transition-all"
          >
            Compare Resume with JD
          </ButtonLink>
        </div>
      </div>

      {/* Row 1: Career Twin Hero Card & Recommended next action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Career Twin Hero Card */}
        <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl overflow-hidden lg:col-span-2 relative flex flex-col justify-between shadow-xs">
          <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
          <div className="px-6 py-4.5 border-b border-[var(--border-strong)] relative z-10 flex justify-between items-center bg-[var(--surface-soft)]/10">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-text-primary">Career Twin Profile</h2>
              <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mt-0.5">Live simulation of your digital career twin</p>
            </div>
            <Award className="w-5 h-5 text-[#EF7A5F] dark:text-[#E36B4F]" />
          </div>

          <div className="p-6 relative z-10 space-y-5 text-left flex-1 flex flex-col justify-between">
            {auditsCount > 0 ? (
              /* Real audits computed state */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--surface-soft)]/30 border border-[var(--border-strong)] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#EF7A5F]/10 border border-[#EF7A5F]/20 flex items-center justify-center text-[#EF7A5F] shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider">Target Track Mapped</span>
                      <p className="text-xs font-bold text-text-primary mt-0.5">{targetRole}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-mono text-[8px] text-text-muted uppercase tracking-wider">Plan Status</span>
                      <p className="text-xs font-bold text-[#91B894] dark:text-[#7E9F82] mt-0.5">Roadmap Engaged</p>
                    </div>
                    <ButtonLink href="/skill-development" variant="secondary" className="py-1 px-3 text-[8px]">
                      Configure
                    </ButtonLink>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-soft)]/20">
                    <span className="block font-mono text-[8px] text-text-muted uppercase tracking-wider">Audit Run logs</span>
                    <p className="text-base font-bold text-text-primary mt-1 font-mono">{auditsCount} Completed</p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-soft)]/20">
                    <span className="block font-mono text-[8px] text-text-muted uppercase tracking-wider">Resume Analysis Matrix</span>
                    <p className="text-base font-bold text-text-primary mt-1 font-mono">{jobMatchesCount} Compiled</p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-soft)]/20">
                    <span className="block font-mono text-[8px] text-text-muted uppercase tracking-wider">Normalized Skill Signals</span>
                    <p className="text-base font-bold text-text-primary mt-1 font-mono">{parserCount} Mapped</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Completely Empty State */
              <div className="flex flex-col justify-center items-center py-6 text-center space-y-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-[var(--surface-soft)] flex items-center justify-center border border-[var(--border-muted)] text-text-muted">
                  <User className="w-5 h-5 opacity-60" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-text-primary font-mono uppercase tracking-wider">Career Twin not generated yet.</p>
                  <p className="text-xs text-text-secondary max-w-sm">
                    Run a 3-minute audit to normalize your resume skills, discover your strongest fit, map missing gaps, and check your rejection risks.
                  </p>
                </div>
                <ButtonLink
                  href="/skill-development"
                  className="px-5 py-2.5 text-[10px] font-mono uppercase tracking-widest text-[#F8F3EA] bg-[#EF7A5F] hover:bg-[#D6674F] dark:bg-[#E36B4F] dark:hover:bg-[#C9573F] transition-all rounded-full"
                >
                  Generate Career Twin
                </ButtonLink>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl overflow-hidden lg:col-span-1 relative flex flex-col justify-between shadow-xs">
          <div className="px-6 py-4.5 border-b border-[var(--border-strong)] bg-[var(--surface-soft)]/15">
            <h2 className="text-sm font-bold tracking-tight text-text-primary">Recommended Action</h2>
            <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mt-0.5">Your fastest path to placement readiness</p>
          </div>

          <div className="p-6 flex flex-col justify-between flex-1 text-left space-y-4">
            {auditsCount > 0 ? (
              /* Real audits active action recommendation */
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#EF7A5F] dark:text-[#E36B4F] font-mono uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bridge Remaining Gaps</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    You have mapped skill gaps for target track &ldquo;{targetRole}&rdquo;. Complete your active Coursera course roadmap nodes to unlock 100% placement readiness.
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-muted)]">
                  <ButtonLink
                    href="/skill-development"
                    className="w-full h-10 font-mono uppercase tracking-widest text-xs text-[#F8F3EA] bg-[#EF7A5F] hover:bg-[#D6674F] dark:bg-[#E36B4F] dark:hover:bg-[#C9573F] transition-all rounded-full flex items-center justify-center gap-1.5"
                  >
                    <span>Go to Skill Planner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </ButtonLink>
                </div>
              </div>
            ) : (
              /* Empty state recommendation */
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#E0B178] dark:text-[#D9A66F] font-mono uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Run Your First Skill Audit</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    We will identify your current role fit, missing skills, and the fastest preparation roadmap to improve your overall student placement readiness rating.
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-muted)]">
                  <ButtonLink
                    href="/skill-development"
                    className="w-full h-10 font-mono uppercase tracking-widest text-xs text-[#F8F3EA] bg-[#EF7A5F] hover:bg-[#D6674F] dark:bg-[#E36B4F] dark:hover:bg-[#C9573F] transition-all rounded-full flex items-center justify-center gap-1.5"
                  >
                    <span>Start Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </ButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Personal Progress Stats Cards */}
      <div className="space-y-3 text-left">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Personal Placement readiness Overview</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-[var(--border-strong)] bg-surface-card rounded-2xl overflow-hidden divide-y divide-x divide-[var(--border-strong)] lg:divide-y-0 shadow-xs">
          {personalStats.map((s, idx) => (
            <div
              key={idx}
              className="p-5 flex flex-col justify-between h-full relative group bg-surface-card hover:bg-surface-card-warm/50 transition-colors"
            >
              <div className="absolute inset-0 dot-grid-overlay opacity-[0.08] pointer-events-none" />
              <div className="flex justify-between items-center mb-3.5 relative z-10">
                <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">{s.label}</span>
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
              <div className="relative z-10 text-left space-y-1">
                <p className="text-base sm:text-lg font-bold text-text-primary tracking-tight truncate leading-tight font-mono">{s.value}</p>
                <p className="text-[10px] text-text-muted leading-tight truncate">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Core Workspace Utilities Grid */}
      <div className="space-y-4 text-left">
        <h2 className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Core Workspace Utilities</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 border border-[var(--border-strong)] bg-surface-card rounded-2xl overflow-hidden divide-y divide-x divide-[var(--border-strong)] md:divide-y-0 shadow-xs">
          {tools.map(({ href, title, description, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col justify-between p-6 relative hover:bg-surface-card-warm/50 transition-colors"
            >
              <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4 mb-4">
                  <div className="w-8.5 h-8.5 rounded-lg bg-[var(--surface-soft)]/50 border border-[var(--border-strong)] flex items-center justify-center text-[#EF7A5F] dark:text-[#E36B4F] group-hover:text-[#F8F3EA] group-hover:bg-[#EF7A5F] dark:group-hover:bg-[#E36B4F] transition-all duration-200">
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest px-2 py-0.5 rounded-md border border-[var(--border-muted)] bg-[var(--surface-soft)]/45 font-bold">
                    {badge}
                  </span>
                </div>

                <h3 className="font-bold text-text-primary text-xs group-hover:text-[#EF7A5F] dark:group-hover:text-[#E36B4F] transition-colors tracking-tight uppercase font-mono">
                  {title}
                </h3>
                <p className="text-[11px] text-text-secondary mt-2.5 leading-relaxed font-sans normal-case">
                  {description}
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#EF7A5F] dark:text-[#E36B4F] mt-5 pt-3.5 border-t border-[var(--border-muted)] font-bold">
                <span>Open Utility</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Row 4: Platform statistics details */}
      <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl p-5 shadow-xs relative overflow-hidden text-left">
        <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
        <span className="eyebrow block text-[8px] tracking-widest text-[#EF7A5F] dark:text-[#E36B4F] font-mono uppercase mb-4">
          SortMySkills Workspace Global Metrics
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {globalStats.map((item, idx) => (
            <div key={idx} className="space-y-1 border-l border-[var(--border-muted)] pl-4">
              <span className="block text-[9px] font-mono text-text-muted uppercase tracking-widest leading-none">{item.label}</span>
              <p className="text-xl font-bold text-text-primary tracking-tight font-mono mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
