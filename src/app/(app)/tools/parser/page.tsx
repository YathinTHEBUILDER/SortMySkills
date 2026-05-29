"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  parseSkills,
  type DetectedSkill,
  type ParseResult,
  type ProficiencyLevel,
} from "@/lib/skill-map";
import { Info, HelpCircle } from "lucide-react";

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

function SkillChip({ skill }: { skill: DetectedSkill }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-accent-green/10 text-accent-green border border-accent-green/20">
      {skill.canonical}
      <ProficiencyBadge level={skill.level} />
    </span>
  );
}

export default function ParserPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [showTrace, setShowTrace] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(parseSkills(input, "resume"));
    setShowTrace(false);
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <PageHeader
        title="Skill Parser"
        description="Paste resume snippets, job requirements, or a skill list. We map aliases to standard tags using a local registry."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="premium-card">
          <CardHeader title="Unstructured Input" description="Paste plain text details from resumes or job postings." className="border-b border-[var(--border-muted)] pb-3" />
          <CardBody className="pt-5 px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Expert in Python with 5+ years. Learning React. Docker on GCP."
                className="w-full h-44 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 resize-none transition-all duration-200"
              />
              <Button type="submit" className="w-full sm:w-auto h-10 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary cursor-pointer">
                Normalize Skills
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Output Card */}
        <Card className="premium-card">
          <CardHeader title="Normalized Results" className="border-b border-[var(--border-muted)] pb-3" />
          <CardBody className="pt-5 px-6 h-full flex flex-col justify-between">
            {!result ? (
              <div className="text-center py-12 text-text-secondary flex-1 flex flex-col justify-center">
                <HelpCircle className="w-5 h-5 text-text-muted mx-auto mb-2" />
                <p className="text-xs font-mono">Results appear here after running parser normalization.</p>
              </div>
            ) : result.skills.length === 0 ? (
              <div className="text-center py-12 text-text-secondary flex-1 flex flex-col justify-center">
                <Info className="w-5 h-5 text-accent-primary mx-auto mb-2" />
                <p className="text-xs font-mono">No mapped skills detected. Try terms like React, Python, AWS, Docker.</p>
              </div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-3">Detected Skill Chips</span>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((skill) => (
                      <SkillChip key={skill.canonical} skill={skill} />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono uppercase">
                  <div className="rounded-lg bg-[var(--surface-soft)]/50 p-4 border border-[var(--border-muted)]">
                    <p className="text-text-muted text-[9px] tracking-wider">Discipline</p>
                    <p className="text-text-primary font-bold mt-1.5">
                      {result.discipline ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--surface-soft)]/50 p-4 border border-[var(--border-muted)]">
                    <p className="text-text-muted text-[9px] tracking-wider">Tags Found</p>
                    <p className="text-text-primary font-bold mt-1.5">{result.skills.length} Nodes</p>
                  </div>
                </div>

                <div className="border-t border-[var(--border-muted)] pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowTrace((v) => !v)}
                    className="text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
                  >
                    {showTrace ? "Hide Debug Trace" : "Show Debug Trace"}
                  </button>
                  {showTrace && (
                    <ul className="mt-3 max-h-40 overflow-y-auto rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/30 p-3 space-y-1 text-[10px] font-mono leading-relaxed">
                      {result.tokenTrace.map((row, i) => (
                        <li
                          key={`${row.token}-${i}`}
                          className={
                            row.hit
                              ? "text-accent-green font-semibold"
                              : "text-text-muted line-through opacity-70"
                          }
                        >
                          {row.hit ? (
                            <>
                              <span className="no-underline">{row.token}</span>
                              <span className="no-underline opacity-70"> → {row.canonical}</span>
                            </>
                          ) : (
                            <>
                              {row.token}
                              {row.skipReason && (
                                <span className="no-underline opacity-50"> ({row.skipReason})</span>
                              )}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
