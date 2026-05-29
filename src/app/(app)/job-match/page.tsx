"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { extractSkillsFromText } from "@/lib/skill-map";
import { COURSERA_COURSES } from "@/data/coursera-courses";
import { CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";

const SAMPLE_RESUME = `Frontend engineer with JavaScript, React, HTML, CSS. Version control with Git.`;

const SAMPLE_JD = `Frontend Engineer — React, TypeScript, Tailwind CSS, Git required. 2+ years experience.`;

type Analysis = {
  score: number;
  matched: string[];
  missing: string[];
  supplementary: string[];
};

export default function JobMatchPage() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);

  const runAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume.trim() || !jd.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const resumeSkills = extractSkillsFromText(resume);
      const jdSkills = extractSkillsFromText(jd);
      const matched = jdSkills.filter((s) => resumeSkills.includes(s));
      const missing = jdSkills.filter((s) => !resumeSkills.includes(s));
      const supplementary = resumeSkills.filter((s) => !jdSkills.includes(s));
      const score = jdSkills.length ? Math.round((matched.length / jdSkills.length) * 100) : 0;
      setResult({ score, matched, missing, supplementary });
      setLoading(false);
    }, 800);
  };

  const bridges = result
    ? COURSERA_COURSES.filter((c) => c.skills.some((s) => result.missing.includes(s)))
    : [];

  return (
    <>
      <PageHeader
        title="Job match"
        description="Compare your resume to a job description. We extract skills from both and highlight gaps."
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setResume(SAMPLE_RESUME);
                setJd(SAMPLE_JD);
                setResult(null);
              }}
            >
              Load sample
            </Button>
            {result && (
              <Button variant="ghost" type="button" onClick={() => setResult(null)}>
                <RotateCcw className="w-4 h-4" /> Reset
              </Button>
            )}
          </div>
        }
      />

      {!result ? (
        <form onSubmit={runAnalysis} className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Resume" description="Paste plain text from your resume." />
            <CardBody className="pt-0">
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                required
                className="w-full h-56 rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-green/30"
                placeholder="Your experience and skills…"
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Job description" description="Paste requirements from the posting." />
            <CardBody className="pt-0 flex flex-col h-full">
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                required
                className="w-full h-56 rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-green/30"
                placeholder="Required skills and qualifications…"
              />
              <Button type="submit" className="mt-4 w-full" disabled={loading}>
                {loading ? "Analyzing…" : "Analyze match"}
              </Button>
            </CardBody>
          </Card>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="col-span-2 lg:col-span-1">
              <CardBody className="py-6 text-center">
                <p className="text-4xl font-semibold text-text-primary">{result.score}%</p>
                <p className="text-sm text-text-secondary mt-1">Match score</p>
              </CardBody>
            </Card>
            <SkillColumn title="Aligned" items={result.matched} variant="ok" />
            <SkillColumn title="Missing" items={result.missing} variant="gap" />
            <SkillColumn title="Extra on resume" items={result.supplementary} variant="muted" />
          </div>

          {result.missing.length > 0 && (
            <Card>
              <CardHeader title="Recommended courses" description="Coursera paths that cover your gaps." />
              <CardBody className="pt-0 space-y-3">
                {bridges.length === 0 ? (
                  <p className="text-sm text-text-secondary">No curated course mapped to these tags yet.</p>
                ) : (
                  bridges.map((course) => (
                    <div
                      key={course.title}
                      className="flex flex-col sm:flex-row sm:justify-between gap-2 rounded-lg border border-[var(--border-muted)] p-4"
                    >
                      <div>
                        <p className="font-medium text-text-primary">{course.title}</p>
                        <p className="text-sm text-text-secondary">
                          {course.duration} · {course.provider}
                        </p>
                      </div>
                      <a
                        href={`https://www.coursera.org/search?query=${encodeURIComponent(course.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent-green hover:underline"
                      >
                        Search Coursera
                      </a>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          )}

          <Button variant="secondary" onClick={() => setResult(null)}>
            Analyze another job
          </Button>
        </div>
      )}
    </>
  );
}

function SkillColumn({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "ok" | "gap" | "muted";
}) {
  const colors = {
    ok: "text-accent-green",
    gap: "text-accent-cyan",
    muted: "text-text-secondary",
  };

  return (
    <Card>
      <CardBody className="py-5">
        <p className={`text-sm font-medium flex items-center gap-1.5 ${colors[variant]}`}>
          {variant === "ok" && <CheckCircle2 className="w-4 h-4" />}
          {variant === "gap" && <AlertTriangle className="w-4 h-4" />}
          {title} ({items.length})
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {items.length === 0 ? (
            <span className="text-xs text-text-secondary">None</span>
          ) : (
            items.map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-1 rounded-md bg-[var(--background)] border border-[var(--border-muted)]"
              >
                {s}
              </span>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
}
