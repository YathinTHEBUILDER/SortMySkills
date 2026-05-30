"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Award,
  TrendingUp,
  Compass,
  FileText,
  Terminal,
  ArrowRight,
  Zap,
  MailX,
  BookOpen,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

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

  // Recommended Coaching step logic
  const [recommendedStep, setRecommendedStep] = useState<{
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  }>({
    title: "Scan Target Job Compatibility",
    description: "Map and analyze your resume against a target job description, resolve critical keyword deficits, and compile an active placement roadmap.",
    ctaLabel: "Audit Resume & Fit",
    ctaHref: "/career-analyser",
  });

  useEffect(() => {
    if (!hasTargetRole) {
      setRecommendedStep({
        title: "Calibrate Target Profile",
        description: "Specify your target career track in your profile settings. This adjusts matching algorithms, weights, and interview focus areas.",
        ctaLabel: "Calibrate Target Profile",
        ctaHref: "/profile",
      });
    } else if (auditsCount === 0 && jobMatchesCount === 0) {
      setRecommendedStep({
        title: "Isolate Rejection Vectors",
        description: "Are you sending resumes but getting no callbacks? Run a Why No Reply evaluation to isolate competency, structural, or semantic rejection reasons.",
        ctaLabel: "Isolate Rejection",
        ctaHref: "/why-no-reply",
      });
    } else {
      // Check localStorage for active inputs
      if (typeof window !== "undefined") {
        const storedResume = localStorage.getItem("sortmyskills_resumeText") || localStorage.getItem("sortmyskills_resume");
        const storedJd = localStorage.getItem("sortmyskills_jdText") || localStorage.getItem("sortmyskills_jd");
        if (storedResume || storedJd) {
          setRecommendedStep({
            title: "Resume Workspace Scan",
            description: "We found resume or job description content saved in your local workspace. Open the Career Analyser to resume your scan or generate a roadmap.",
            ctaLabel: "Resume Scan",
            ctaHref: "/career-analyser",
          });
        }
      }
    }
  }, [hasTargetRole, auditsCount, jobMatchesCount]);

  return (
    <div className="space-y-8 animate-fade-in relative z-10 font-sans text-left">
      
      {/* 1. Welcome Banner */}
      <div className="pb-6 border-b border-[var(--border-strong)]">
        <span className="eyebrow block text-xs tracking-widest text-[#E7717D] dark:text-[#EE8590] font-mono">
          PLACEMENT ENGINE WORKSPACE
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-2">
          Welcome back, <span className="font-serif italic font-normal text-[#E7717D] dark:text-[#EE8590]">{name}</span>.
        </h1>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          Calibrate your credentials against target placement tracks, isolate structural rejection vectors, and launch targeted skill preparation from a single, unified workspace.
        </p>

        {/* Dashboard Quick Action CTAs */}
        <div className="flex flex-wrap gap-4 mt-6">
          <ButtonLink href="/why-no-reply">
            Diagnose Recruiter Silence
          </ButtonLink>
          <ButtonLink href="/career-analyser" variant="secondary">
            Audit Resume & Fit
          </ButtonLink>
        </div>
      </div>

      {/* 2. Recommended Next Step Coaching Card */}
      <div className="border border-accent-primary/20 bg-accent-primary/[0.02] dark:bg-accent-primary/[0.04] rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-accent-primary/30 bg-accent-primary/10 text-[9px] font-mono text-accent-primary uppercase font-bold tracking-wider">
              <Zap className="w-3 h-3" /> Recommended Next Step
            </div>
            <h2 className="text-base font-bold text-text-primary tracking-tight mt-2">{recommendedStep.title}</h2>
            <p className="text-xs text-text-secondary leading-relaxed">{recommendedStep.description}</p>
          </div>
          <ButtonLink href={recommendedStep.ctaHref} className="shrink-0">
            {recommendedStep.ctaLabel} <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </ButtonLink>
        </div>
      </div>

      {/* 3. Three-Step Guided Flow */}
      <div className="space-y-4">
        <span className="eyebrow block text-[10px] tracking-widest text-text-muted font-mono uppercase">
          Guided Placement Flow
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: Diagnose */}
          <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-4">
                <MailX className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-text-primary tracking-tight font-mono uppercase text-xs">01 — Diagnose</h3>
              <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                Isolate competency, semantic, and structural rejection vectors to determine why employers bypass your profile.
              </p>
            </div>
            <div className="pt-4 border-t border-[var(--border-muted)] mt-4">
              <ButtonLink href="/why-no-reply" className="w-full">
                Diagnose Rejection
              </ButtonLink>
            </div>
          </div>

          {/* Step 2: Analyse */}
          <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#AFD275]/10 border border-[#AFD275]/20 flex items-center justify-center text-[#AFD275] mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-text-primary tracking-tight font-mono uppercase text-xs">02 — Calibrate</h3>
              <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                Audit resume readiness scores, run semantic skill matches, and compile dynamic learning roadmaps.
              </p>
            </div>
            <div className="pt-4 border-t border-[var(--border-muted)] mt-4">
              <ButtonLink href="/career-analyser" className="w-full">
                Audit Resume & Fit
              </ButtonLink>
            </div>
          </div>

          {/* Step 3: Fix & Prepare */}
          <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#C2CAD0]/10 border border-[#C2CAD0]/20 flex items-center justify-center text-accent-primary mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-text-primary tracking-tight font-mono uppercase text-xs">03 — Optimize</h3>
              <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                Structure your CV bullets with active, placement-ready verbs and practice question packs designed by tech recruiters.
              </p>
            </div>
            <div className="pt-4 border-t border-[var(--border-muted)] mt-4 flex gap-2">
              <ButtonLink href="/resume-builder" variant="secondary" className="flex-1">
                Enhance CV
              </ButtonLink>
              <ButtonLink href="/interview-packs" variant="secondary" className="flex-1">
                Practice
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Core Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Target Career Track */}
        <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
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
        <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
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

        {/* Metric 3: Detected Resume Signals */}
        <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Detected Resume Signals</span>
            <TrendingUp className="w-4 h-4 text-[#C2CAD0]" />
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-xl font-bold text-text-primary tracking-tight font-mono">
              {uniqueSkillsCount} Signals
            </p>
            <p className="text-[10px] text-text-muted mt-1 leading-snug">
              {uniqueSkillsCount > 0 ? "Normalized canonical capabilities" : "No audited capabilities yet"}
            </p>
          </div>
        </div>

        {/* Metric 4: Completed Audits */}
        <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[140px]">
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

      {/* 5. Activity Logs Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Career Comparisons Count */}
        <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex items-center gap-4">
          <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-[#E7717D]/10 border border-[#E7717D]/20 flex items-center justify-center text-[#E7717D] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block">Career Comparisons</span>
            <p className="text-lg font-bold text-text-primary mt-1 font-mono">{jobMatchesCount} Comparisons</p>
            <p className="text-[10px] text-text-muted mt-0.5">Actual Job Description parses and skill gap audits performed.</p>
          </div>
        </div>

        {/* Analysis Runs Count */}
        <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex items-center gap-4">
          <div className="absolute inset-0 dot-grid-overlay opacity-[0.06] pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-[#AFD275]/10 border border-[#AFD275]/20 flex items-center justify-center text-[#AFD275] shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block">Analysis Runs</span>
            <p className="text-lg font-bold text-text-primary mt-1 font-mono">{parserCount} Mappings</p>
            <p className="text-[10px] text-text-muted mt-0.5">Actual local taxonomy alias normalization requests logged.</p>
          </div>
        </div>

      </div>

      {/* 6. Workspace Database Sync Footnote */}
      <div className="border border-[var(--border-muted)] bg-[var(--surface-soft)]/20 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
        <span className="eyebrow block text-[8px] tracking-widest text-[#E7717D] dark:text-[#EE8590] font-mono uppercase mb-2">
          Workspace Database Synchronisation
        </span>
        <p className="text-[11px] text-text-secondary leading-relaxed">
          These metrics represent your authentic placement capability logs. All metrics are computed dynamically on the server from encrypted Postgres database transactions linked securely to your account profile <code className="font-mono text-[#E7717D] dark:text-[#EE8590]">{maskedEmail}</code>.
        </p>
      </div>

    </div>
  );
}
