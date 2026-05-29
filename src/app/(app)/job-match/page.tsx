"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { parseSkills, type DetectedSkill, type ProficiencyLevel } from "@/lib/skill-map";
import { COURSERA_COURSES } from "@/data/coursera-courses";
import { CheckCircle2, AlertTriangle, RotateCcw, ArrowRight, HelpCircle } from "lucide-react";

const SAMPLE_RESUME = `Frontend engineer with JavaScript, React, HTML, CSS. Version control with Git.`;

const SAMPLE_JD = `Frontend Engineer — React, TypeScript, Tailwind CSS, Git required. 2+ years experience.`;

type Analysis = {
  score: number;
  matched: DetectedSkill[];
  missing: DetectedSkill[];
  supplementary: DetectedSkill[];
};

function ProficiencyBadge({ level }: { level: ProficiencyLevel }) {
  if (level === "unspecified") return null;
  const styles = {
    beginner: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    moderate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    expert: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <span
      className={`text-[8px] font-mono uppercase tracking-wider px-1 py-0.5 rounded border ml-1.5 ${styles[level]}`}
    >
      {level}
    </span>
  );
}

function SkillTag({ skill }: { skill: DetectedSkill }) {
  return (
    <span className="inline-flex items-center text-xs px-2.5 py-1 rounded border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 font-mono text-[10px] text-text-secondary uppercase">
      {skill.canonical}
      <ProficiencyBadge level={skill.level} />
    </span>
  );
}

export default function JobMatchPage() {
  const { resume, setResume, jd, setJd } = useResume();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);

  const runAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume.trim() || !jd.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const resumeParsed = parseSkills(resume, "resume");
      const jdParsed = parseSkills(jd, "jd");

      const jdByCanonical = new Map(jdParsed.skills.map((s) => [s.canonical, s]));

      const jdCanonicals = jdParsed.skills.map((s) => s.canonical);
      const resumeCanonicals = new Set(resumeParsed.skills.map((s) => s.canonical));

      const matched = jdParsed.skills.filter((s) => resumeCanonicals.has(s.canonical));
      const missing = jdParsed.skills.filter((s) => !resumeCanonicals.has(s.canonical));
      const supplementary = resumeParsed.skills.filter(
        (s) => !jdByCanonical.has(s.canonical)
      );

      const score = jdCanonicals.length
        ? Math.round((matched.length / jdCanonicals.length) * 100)
        : 0;

      setResult({ score, matched, missing, supplementary });
      setLoading(false);
    }, 800);
  };

  const bridges = result
    ? COURSERA_COURSES.filter((c) => c.skills.some((s) => result.missing.some((m) => m.canonical === s)))
    : [];

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <PageHeader
        title="Job Match"
        description="Compare your resume to a job description. We extract skills from both and highlight gaps."
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              type="button"
              className="text-xs font-mono uppercase tracking-widest px-3 border-[var(--border-muted)] hover:bg-surface-hover/80 cursor-pointer"
              onClick={() => {
                setResume(SAMPLE_RESUME);
                setJd(SAMPLE_JD);
                setResult(null);
              }}
            >
              Load Sample
            </Button>
            {result && (
              <Button 
                variant="ghost" 
                type="button" 
                className="text-xs font-mono uppercase tracking-widest px-3 hover:bg-surface-hover/80 text-text-secondary cursor-pointer"
                onClick={() => setResult(null)}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
            )}
          </div>
        }
      />

      {!result ? (
        <form onSubmit={runAnalysis} className="grid lg:grid-cols-2 gap-6">
          {resume.trim() && jd.trim() && (
            <div className="lg:col-span-2 flex justify-start animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--success)]/20 bg-[var(--success)]/10 text-[var(--success)] text-xs font-mono">
                <span>✓ Resume & JD carried over</span>
              </div>
            </div>
          )}
          <Card className="premium-card">
            <CardHeader title="Your Resume" description="Paste plain text from your resume." className="border-b border-[var(--border-muted)] pb-3" />
            <CardBody className="pt-5 px-6">
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                required
                className="w-full h-56 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary resize-none focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all duration-200"
                placeholder="Paste experience and baseline capabilities here..."
              />
            </CardBody>
          </Card>
          <Card className="premium-card">
            <CardHeader title="Job Description" description="Paste requirements from the posting." className="border-b border-[var(--border-muted)] pb-3" />
            <CardBody className="pt-5 px-6 flex flex-col h-full justify-between">
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                required
                className="w-full h-56 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary resize-none focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all duration-200"
                placeholder="Paste required skills and qualifications here..."
              />
              <Button type="submit" className="mt-4 w-full h-11 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary cursor-pointer" disabled={loading}>
                {loading ? "Comparing Gaps…" : "Compare Resume with Target JD"}
              </Button>
            </CardBody>
          </Card>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Analysis Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="col-span-2 lg:col-span-1 premium-card relative overflow-hidden animated-border">
              <div className="absolute inset-0 dot-grid-overlay opacity-20 pointer-events-none" />
              <CardBody className="py-6 px-6 text-center flex flex-col justify-center h-full relative z-10">
                <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider">Role Match Rating</span>
                <p className="text-4xl font-bold text-accent-primary mt-1 tracking-tight">{result.score}%</p>
                <div className="w-full bg-[var(--surface-muted)] h-1 rounded-full mt-3 overflow-hidden max-w-[120px] mx-auto">
                  <div className="bg-accent-primary h-full" style={{ width: `${result.score}%` }} />
                </div>
              </CardBody>
            </Card>
            
            <SkillColumn title="Matched Skills" skills={result.matched} variant="ok" />
            <SkillColumn title="Skill Gaps" skills={result.missing} variant="gap" />
            <SkillColumn title="Extra Skills" skills={result.supplementary} variant="muted" />
          </div>

          {/* Recommended Course Bridges */}
          {result.missing.length > 0 && (
            <Card className="premium-card">
              <CardHeader title="Recommended Course Bridges" description="Coursera pathways targeted directly at closing your identified gaps." className="border-b border-[var(--border-muted)] pb-3" />
              <CardBody className="pt-5 px-6 space-y-3">
                {bridges.length === 0 ? (
                  <div className="text-center py-6 text-text-secondary">
                    <HelpCircle className="w-5 h-5 text-text-muted mx-auto mb-2" />
                    <p className="text-xs font-mono">No direct course bridges found for these specific tags.</p>
                  </div>
                ) : (
                  bridges.map((course) => (
                    <div
                      key={course.title}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[var(--border-muted)] p-4 hover:border-accent-primary/30 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-text-primary text-xs font-mono uppercase tracking-wider">{course.title}</p>
                        <p className="text-[11px] text-text-secondary mt-1.5">
                          Duration: {course.duration} · Provider: {course.provider}
                        </p>
                      </div>
                      <a
                        href={`https://www.coursera.org/search?query=${encodeURIComponent(course.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-accent-primary hover:underline shrink-0"
                      >
                        <span>Study Course</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          )}

          <Button variant="secondary" className="font-mono uppercase tracking-widest text-xs border-[var(--border-muted)] hover:bg-surface-hover/80 cursor-pointer" onClick={() => setResult(null)}>
            Analyze Another Job
          </Button>
        </div>
      )}
    </div>
  );
}

function SkillColumn({
  title,
  skills,
  variant,
}: {
  title: string;
  skills: DetectedSkill[];
  variant: "ok" | "gap" | "muted";
}) {
  const colors = {
    ok: "text-accent-green",
    gap: "text-accent-primary",
    muted: "text-text-secondary",
  };

  return (
    <Card className="premium-card">
      <CardBody className="py-5 px-6 flex flex-col justify-between h-full">
        <p className={`text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold ${colors[variant]}`}>
          {variant === "ok" && <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />}
          {variant === "gap" && <AlertTriangle className="w-4 h-4 text-accent-primary shrink-0" />}
          <span>{title} ({skills.length})</span>
        </p>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {skills.length === 0 ? (
            <span className="text-xs text-text-muted font-mono uppercase">None</span>
          ) : (
            skills.map((s) => <SkillTag key={s.canonical} skill={s} />)
          )}
        </div>
      </CardBody>
    </Card>
  );
}
