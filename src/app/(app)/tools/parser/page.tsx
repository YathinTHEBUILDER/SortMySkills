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

function ProficiencyBadge({ level }: { level: ProficiencyLevel }) {
  if (level === "unspecified") return null;
  const styles = {
    beginner: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    moderate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    expert: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border ${styles[level]}`}
    >
      {level}
    </span>
  );
}

function SkillChip({ skill }: { skill: DetectedSkill }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-accent-green/10 text-accent-green border border-accent-green/20">
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
    <>
      <PageHeader
        title="Skill parser"
        description="Paste resume snippets, job requirements, or a skill list. We map aliases to standard tags using a local registry."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Input" description="Plain text only — no PDF yet." />
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Expert in Python with 5+ years. Learning React. Docker on GCP."
                className="w-full h-40 rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent-green/30 resize-none"
              />
              <Button type="submit" className="w-full sm:w-auto">
                Normalize skills
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Output" />
          <CardBody className="pt-0">
            {!result ? (
              <p className="text-sm text-text-secondary py-8 text-center">
                Results appear here after you run the parser.
              </p>
            ) : result.skills.length === 0 ? (
              <p className="text-sm text-text-secondary py-8 text-center">
                No known skills detected. Try terms like react, python, aws, docker.
              </p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill) => (
                    <SkillChip key={skill.canonical} skill={skill} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-[var(--background)] p-4 border border-[var(--border-muted)]">
                    <p className="text-text-secondary text-xs">Discipline</p>
                    <p className="text-text-primary font-medium mt-1">
                      {result.discipline ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--background)] p-4 border border-[var(--border-muted)]">
                    <p className="text-text-secondary text-xs">Tags found</p>
                    <p className="text-text-primary font-medium mt-1">{result.skills.length}</p>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowTrace((v) => !v)}
                    className="text-sm text-text-secondary hover:text-accent-green"
                  >
                    {showTrace ? "Hide debug trace" : "Show debug trace"}
                  </button>
                  {showTrace && (
                    <ul className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-[var(--border-muted)] p-3 space-y-1 text-xs font-mono">
                      {result.tokenTrace.map((row, i) => (
                        <li
                          key={`${row.token}-${i}`}
                          className={
                            row.hit
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-text-secondary line-through"
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
                                <span className="no-underline opacity-60"> ({row.skipReason})</span>
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
    </>
  );
}
