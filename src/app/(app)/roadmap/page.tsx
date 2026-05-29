"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  AlertTriangle, BookOpen, Code, Briefcase, Wrench, 
  CheckSquare, Square, Check, Copy, ArrowLeft, RefreshCw, Calendar 
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Gap {
  gap: string;
  severity: "critical" | "moderate" | "minor";
  explanation: string;
}

interface Resource {
  name: string;
  url: string;
  platform: string;
  is_free: boolean;
}

interface Task {
  task: string;
  type: "learn" | "build" | "apply" | "fix";
  time_estimate: string;
  resource?: Resource;
}

interface RoadmapPhase {
  week_range: string;
  theme: string;
  goal: string;
  tasks: Task[];
  milestone: string;
}

interface RoadmapResult {
  why_no_reply: {
    summary: string;
    top_gaps: Gap[];
  };
  roadmap: RoadmapPhase[];
  success_metrics: string[];
  honest_warning: string;
}

type PageState = "input" | "loading" | "results";

// ── Component ────────────────────────────────────────────────────────────────

export default function CareerRoadmapPage() {
  const [pageState, setPageState] = useState<PageState>("input");
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [focus, setFocus] = useState("");

  const [result, setResult] = useState<RoadmapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugRaw, setDebugRaw] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Set minimum date to today
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  // Compute weeks dynamically
  const weeksAvailable = useMemo(() => {
    if (!targetDate) return 0;
    const target = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(diffDays / 7));
  }, [targetDate]);

  // Load milestone state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("roadmap_milestones");
        if (stored) {
          setMilestones(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to read milestones from localStorage", e);
      }
    }
  }, []);

  // Toggle check state of a milestone
  const toggleMilestone = (id: string) => {
    const nextState = { ...milestones, [id]: !milestones[id] };
    setMilestones(nextState);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("roadmap_milestones", JSON.stringify(nextState));
      } catch (e) {
        console.error("Failed to save milestones to localStorage", e);
      }
    }
  };

  // Submit request to API
  const handleGenerateRoadmap = useCallback(async () => {
    if (!resume || !jd || !targetDate) return;

    setPageState("loading");
    setError(null);
    setDebugRaw(null);

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd, date: targetDate, focus }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Couldn't generate roadmap — try again");
        setDebugRaw(data.raw || JSON.stringify(data));
        setPageState("input");
        return;
      }

      setResult(data.result);
      setPageState("results");
        } catch (err: unknown) {
      setError("Couldn't generate roadmap — try again");
      const errMsg = err instanceof Error ? err.message : String(err);
      setDebugRaw(errMsg);
      setPageState("input");
    }
  }, [resume, jd, targetDate, focus]);

  const handleReset = () => {
    setResult(null);
    setPageState("input");
  };

  // Generate markdown and copy to clipboard
  const handleCopyMarkdown = () => {
    if (!result) return;

    let md = `# Career Development Roadmap (Target Ready Date: ${targetDate})\n\n`;
    md += `## Why No Reply: Recruiter Assessment\n`;
    md += `${result.why_no_reply.summary}\n\n`;

    md += `### Identified Competency Gaps:\n`;
    result.why_no_reply.top_gaps.forEach((g) => {
      md += `* **[${g.severity.toUpperCase()}] ${g.gap}**: ${g.explanation}\n`;
    });
    md += `\n`;

    md += `## Time-Bound Roadmap (${weeksAvailable} Weeks Total)\n\n`;
    result.roadmap.forEach((phase) => {
      md += `### ${phase.week_range}: ${phase.theme}\n`;
      md += `**Goal**: ${phase.goal}\n\n`;
      md += `**Action Items:**\n`;
      phase.tasks.forEach((t) => {
        md += `* [ ] \`[${t.type.toUpperCase()}]\` ${t.task} (${t.time_estimate})`;
        if (t.resource) {
          md += ` — _Resource:_ [${t.resource.name}](${t.resource.url}) [${t.resource.platform}]${t.resource.is_free ? " (Free)" : ""}`;
        }
        md += `\n`;
      });
      md += `\n**Phase Milestone**: ${phase.milestone}\n\n---\n\n`;
    });

    md += `## Metrics for Success\n`;
    result.success_metrics.forEach((m, idx) => {
      md += `${idx + 1}. ${m}\n`;
    });
    md += `\n`;

    md += `> ⚠️ **Recruiter Warning**: ${result.honest_warning}\n`;

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Render Icons ──
  const getTaskIcon = (type: string) => {
    switch (type) {
      case "learn":
        return <BookOpen className="w-4 h-4 text-accent-cyan" />;
      case "build":
        return <Code className="w-4 h-4 text-green-500" />;
      case "apply":
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "fix":
        return <Wrench className="w-4 h-4 text-amber-500" />;
      default:
        return <Wrench className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {pageState !== "results" && (
        <PageHeader
          title="Career Roadmap"
          description="Map out your self-study trajectory. Receive a detailed time-bound roadmap with curated resources to resolve critical profile gaps."
        />
      )}

      {/* ── Error Box with debugging ── */}
      {error && pageState === "input" && (
        <Card className="mb-6 border-red-500/30 bg-red-500/[0.04]">
          <CardBody className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                {debugRaw && (
                  <details className="mt-2 text-xs text-text-secondary cursor-pointer">
                    <summary className="font-semibold select-none hover:text-text-primary">View debug log details</summary>
                    <pre className="mt-2 p-3 bg-[var(--surface-soft)] border border-[var(--border-muted)] rounded-lg font-mono text-[11px] text-text-muted whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {debugRaw}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── INPUT STATE ── */}
      {pageState === "input" && (
        <Card>
          <CardBody className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="roadmap-resume" className="block text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
                  Your Resume
                </label>
                <textarea
                  id="roadmap-resume"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your complete resume as plain text here."
                  className="w-full min-h-[200px] rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4 text-sm font-mono text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent-green/30 focus:border-accent-green/50 transition-all"
                />
              </div>

              <div>
                <label htmlFor="roadmap-jd" className="block text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
                  Target Job Description
                </label>
                <textarea
                  id="roadmap-jd"
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the target job description here."
                  className="w-full min-h-[200px] rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4 text-sm font-mono text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent-green/30 focus:border-accent-green/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label htmlFor="roadmap-date" className="block text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
                  I want to be job-ready by:
                </label>
                <div className="relative">
                  <input
                    id="roadmap-date"
                    type="date"
                    min={todayStr}
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-3 pl-10 text-sm font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-green/30 focus:border-accent-green/50 transition-all cursor-pointer"
                  />
                  <Calendar className="w-4 h-4 text-text-muted absolute left-3 top-3.5 pointer-events-none" />
                </div>
                {targetDate && (
                  <p className="text-xs text-text-secondary mt-2 font-mono">
                    That gives you <span className="font-semibold text-[var(--accent-primary)]">{weeksAvailable} week{weeksAvailable !== 1 ? "s" : ""}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="roadmap-focus" className="block text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
                  Focus Focus Areas (Optional - Max 200 chars)
                </label>
                <input
                  id="roadmap-focus"
                  type="text"
                  maxLength={200}
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  placeholder="e.g. Focus on portfolio projects, system design, etc."
                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-green/30 focus:border-accent-green/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-muted)] flex justify-end">
              <Button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={!resume.trim() || !jd.trim() || !targetDate}
                className="px-6 py-2.5 font-medium transition-all"
              >
                Generate My Roadmap
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── LOADING STATE SKELETONS ── */}
      {pageState === "loading" && (
        <div className="space-y-6">
          <Card className="animate-pulse">
            <CardBody className="pt-6 space-y-4">
              <div className="h-4 bg-[var(--surface-soft)] rounded w-24" />
              <div className="h-6 bg-[var(--surface-soft)] rounded w-3/4" />
              <div className="h-4 bg-[var(--surface-soft)] rounded w-full" />
              <div className="h-4 bg-[var(--surface-soft)] rounded w-5/6" />
            </CardBody>
          </Card>

          <div className="text-center py-6">
            <p className="text-sm text-text-secondary font-medium tracking-wide animate-pulse">
              Analyzing your gaps and finding real resources... (10–20 seconds)
            </p>
          </div>

          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardBody className="pt-6 space-y-4">
                <div className="h-5 bg-[var(--surface-soft)] rounded w-20" />
                <div className="h-6 bg-[var(--surface-soft)] rounded w-1/3" />
                <div className="h-12 bg-[var(--surface-soft)] rounded w-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-[var(--surface-soft)] rounded w-5/6" />
                  <div className="h-4 bg-[var(--surface-soft)] rounded w-4/5" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* ── RESULTS STATE ── */}
      {pageState === "results" && result && (
        <div className="space-y-6">
          {/* Back Action Bar */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleReset}
              className="group inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Create new roadmap
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors cursor-pointer border border-[var(--border-muted)] rounded-md px-3 py-1.5 bg-[var(--surface-card)] hover:bg-[var(--surface-soft)]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span>Copied ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy as Markdown</span>
                </>
              )}
            </button>
          </div>

          {/* Recruiter Assessment / Why No Reply Diagnosis (Amber Warning styling) */}
          <Card className="border-amber-500/40 bg-amber-500/[0.03]">
            <CardBody className="pt-6 space-y-4">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
                Why you got no reply - Recruiter Assessment
              </span>
              <p className="text-[15px] font-medium text-text-primary leading-[1.6]">
                {result.why_no_reply.summary}
              </p>

              {/* Gap Badges */}
              <div className="space-y-2 pt-2 border-t border-amber-500/10">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-text-muted">
                  Detected Competency Gaps:
                </span>
                <div className="flex flex-col gap-2.5">
                  {result.why_no_reply.top_gaps.map((g, idx) => {
                    const badgeColor = 
                      g.severity === "critical" 
                        ? "border-red-500/30 text-red-500 bg-red-500/[0.02]" 
                        : g.severity === "moderate"
                          ? "border-amber-500/30 text-amber-500 bg-amber-500/[0.02]"
                          : "border-gray-500/30 text-text-secondary bg-transparent";
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 text-xs">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border shrink-0 ${badgeColor}`}>
                          {g.severity}
                        </span>
                        <div className="leading-relaxed">
                          <strong className="text-text-primary">{g.gap}</strong> — <span className="text-text-secondary">{g.explanation}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Timeline Phases */}
          <div className="space-y-5">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted px-1">
              Time-Bound Roadmap Plan ({weeksAvailable} Weeks)
            </span>

            <div className="relative pl-4 sm:pl-6 border-l border-[var(--border-muted)] ml-3 space-y-6">
              {result.roadmap.map((phase, pIdx) => {
                const milestoneId = `milestone_${pIdx}_${phase.week_range.replace(/\s+/g, "")}`;
                const isMilestoneChecked = !!milestones[milestoneId];

                return (
                  <div key={pIdx} className="relative">
                    {/* Circle timeline connector node */}
                    <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 w-4 h-4 rounded-full border-2 border-[var(--accent-primary)] bg-[var(--background)] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                    </div>

                    <Card>
                      <CardBody className="pt-6 space-y-4">
                        {/* Week and Theme Info */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="inline-block rounded-md bg-[var(--surface-soft)] font-mono text-[11px] font-semibold border border-[var(--border-muted)] px-2.5 py-1 text-text-primary">
                            {phase.week_range}
                          </span>
                          <h3 className="text-base font-bold text-text-primary">
                            {phase.theme}
                          </h3>
                        </div>

                        {/* Measurable goal callout */}
                        <div className="bg-[var(--surface-soft)] p-3 rounded-lg border border-[var(--border-muted)] text-sm text-text-secondary leading-relaxed">
                          <span className="font-bold text-[10px] font-mono uppercase text-text-muted block mb-1">Target Outcome:</span>
                          {phase.goal}
                        </div>

                        {/* Tasks */}
                        <div className="space-y-3 pt-2">
                          <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                            Action Items
                          </span>

                          <div className="space-y-2.5">
                            {phase.tasks.map((t, tIdx) => (
                              <div key={tIdx} className="flex items-start gap-3 text-xs leading-relaxed">
                                <div className="mt-0.5 shrink-0">
                                  {getTaskIcon(t.type)}
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-text-primary capitalize font-mono text-[10px] mr-1.5">
                                    [{t.type}]
                                  </span>
                                  <span className="text-text-primary">{t.task}</span>
                                  
                                  {/* Estimate and resource badge */}
                                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-text-muted">
                                    <span className="font-mono">Time: {t.time_estimate}</span>
                                    {t.resource && (
                                      <a
                                        href={t.resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-[var(--accent-secondary)]/[0.08] hover:bg-[var(--accent-secondary)]/[0.16] text-[var(--accent-primary)] hover:text-text-primary font-mono transition-colors border border-[var(--accent-primary)]/10"
                                      >
                                        Resource: {t.resource.name} ({t.resource.platform})
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Milestone checklist row */}
                        <div 
                          onClick={() => toggleMilestone(milestoneId)}
                          className={`mt-4 pt-3 border-t border-[var(--border-muted)] flex items-center gap-2.5 cursor-pointer select-none transition-colors ${
                            isMilestoneChecked ? "text-green-500" : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          <div className="shrink-0">
                            {isMilestoneChecked ? (
                              <CheckSquare className="w-4 h-4 text-green-500" />
                            ) : (
                              <Square className="w-4 h-4 text-text-muted" />
                            )}
                          </div>
                          <span className={`text-xs font-mono font-medium ${isMilestoneChecked ? "line-through text-text-muted" : ""}`}>
                            <strong>Milestone:</strong> {phase.milestone}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Metrics Footer */}
          <Card>
            <CardBody className="pt-6 space-y-4">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                Roadmap metrics for success
              </span>
              <ol className="list-decimal pl-4 space-y-2 text-xs text-text-secondary leading-relaxed">
                {result.success_metrics.map((metric, idx) => (
                  <li key={idx}>
                    {metric}
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>

          {/* Honest Recruiter Warning callout */}
          <Card className="border-red-500/20 bg-red-500/[0.02]">
            <CardBody className="pt-6 space-y-2.5">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-red-500 font-semibold">
                ⚠️ Don&apos;t skip this
              </span>
              <p className="text-xs text-text-secondary leading-relaxed font-mono">
                {result.honest_warning}
              </p>
            </CardBody>
          </Card>

          {/* Bottom Actions */}
          <div className="flex justify-center pt-2 gap-3">
            <Button variant="secondary" onClick={handleReset} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Regenerate Roadmap
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
