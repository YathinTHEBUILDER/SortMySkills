"use client";

import React from "react";
import {
  Briefcase,
  Award,
  TrendingUp,
  Compass,
  FileText,
  Terminal,
} from "lucide-react";

interface DashboardClientProps {
  displayName: string;
  targetRoleTitle: string;
  targetRoleKey: string;
  auditsCount: number;
  jobMatchesCount: number;
  parserCount: number;
  latestReadiness: number;
  uniqueSkillsCount: number;
  maskedEmail: string;
  roleText: string;
}

export default function DashboardClient({
  displayName,
  targetRoleTitle,
  targetRoleKey,
  auditsCount,
  jobMatchesCount,
  parserCount,
  latestReadiness,
  uniqueSkillsCount,
  maskedEmail,
}: DashboardClientProps) {
  const name = displayName;
  const targetRole = targetRoleTitle;
  const hasTargetRole = !!(targetRoleKey && targetRoleTitle !== "Not Selected");

  return (
    <div className="space-y-8 animate-fade-in relative z-10 font-sans text-left">
      
      {/* 1. Welcome Banner */}
      <div className="pb-6 border-b border-[var(--border-strong)]">
        <span className="eyebrow block text-xs tracking-widest text-[#E7717D] dark:text-[#EE8590] font-mono">
          CAREER OPERATING SYSTEM
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-2">
          Welcome back, <span className="font-serif italic font-normal text-[#E7717D] dark:text-[#EE8590]">{name}</span>.
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          Here is your real-time career development profile and actual placement preparation statistics synchronised with your workspace logs.
        </p>
      </div>

      {/* 2. Core Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Target Career Track */}
        <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Target Role Track</span>
            <Briefcase className="w-4 h-4 text-[#E7717D]" />
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-base font-bold text-text-primary tracking-tight leading-tight">
              {hasTargetRole ? targetRole : "Not Selected"}
            </p>
            <p className="text-[10px] text-text-muted mt-1 leading-snug">
              {hasTargetRole ? "Active placement roadmap track" : "Select target role in Settings"}
            </p>
          </div>
        </div>

        {/* Metric 2: Latest Readiness Score */}
        <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Readiness Quotient</span>
            <Award className="w-4 h-4 text-[#AFD275]" />
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-xl font-bold text-text-primary tracking-tight font-mono">
              {auditsCount > 0 ? `${latestReadiness}%` : "Pending"}
            </p>
            <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#AFD275] h-full rounded-full transition-all duration-500" 
                style={{ width: auditsCount > 0 ? `${latestReadiness}%` : "0%" }} 
              />
            </div>
            <p className="text-[10px] text-text-muted mt-1 leading-snug">
              {auditsCount > 0 ? "Computed from latest skill audit" : "Run skill audit to calculate"}
            </p>
          </div>
        </div>

        {/* Metric 3: Unique Audited Skills */}
        <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Unique Mapped Skills</span>
            <TrendingUp className="w-4 h-4 text-[#C2CAD0]" />
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-xl font-bold text-text-primary tracking-tight font-mono">
              {uniqueSkillsCount} Skills
            </p>
            <p className="text-[10px] text-text-muted mt-1 leading-snug">
              {uniqueSkillsCount > 0 ? "Normalized canonical capabilities" : "No audited capabilities yet"}
            </p>
          </div>
        </div>

        {/* Metric 4: Total Roadmap Audits */}
        <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Completed Audits</span>
            <Compass className="w-4 h-4 text-[#E7717D]" />
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-xl font-bold text-text-primary tracking-tight font-mono">
              {auditsCount} Completed
            </p>
            <p className="text-[10px] text-text-muted mt-1 leading-snug">
              {auditsCount > 0 ? "Individual roadmap evaluations" : "Initiate your first skill audit"}
            </p>
          </div>
        </div>

      </div>

      {/* 3. Utility Logs & Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Job Match Log Count */}
        <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl p-6 shadow-xs relative overflow-hidden flex items-center gap-4">
          <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-[#E7717D]/10 border border-[#E7717D]/20 flex items-center justify-center text-[#E7717D] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block">Resume Matching Matrix</span>
            <p className="text-lg font-bold text-text-primary mt-1 font-mono">{jobMatchesCount} Comparisons</p>
            <p className="text-[10px] text-text-muted mt-0.5">Actual Job Description parses and skill gap audits performed.</p>
          </div>
        </div>

        {/* Skill Parser Playground Log Count */}
        <div className="border border-[var(--border-strong)] bg-surface-card rounded-2xl p-6 shadow-xs relative overflow-hidden flex items-center gap-4">
          <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-[#AFD275]/10 border border-[#AFD275]/20 flex items-center justify-center text-[#AFD275] shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block">Skill Parser Submissions</span>
            <p className="text-lg font-bold text-text-primary mt-1 font-mono">{parserCount} Playground runs</p>
            <p className="text-[10px] text-text-muted mt-0.5">Actual local taxonomy alias normalization requests logged.</p>
          </div>
        </div>

      </div>

      {/* 4. Footnote detailing RLS synchronization */}
      <div className="border border-[var(--border-strong)] bg-[var(--surface-soft)]/20 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
        <span className="eyebrow block text-[8px] tracking-widest text-[#E7717D] dark:text-[#EE8590] font-mono uppercase mb-2">
          Workspace Database Synchronisation
        </span>
        <p className="text-[11px] text-text-secondary leading-relaxed font-sans">
          These metrics represent your authentic placement capability logs. All metrics are computed dynamically on the server from encrypted Postgres database transactions linked securely to your account profile <code className="font-mono text-[#E7717D] dark:text-[#EE8590]">{maskedEmail}</code>.
        </p>
      </div>

    </div>
  );
}
