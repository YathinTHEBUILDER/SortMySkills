"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  parseSkills,
  type DetectedSkill,
  type ParseResult,
} from "@/lib/skill-map";
import {
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  Trash2,
  Play,
  CheckCircle2,
  FileText,
  BadgeAlert,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// --- Sample Templates --------------------------------------------------------
const TEMPLATES = {
  resume: "Experienced Software Developer. Skilled in js, es6, reactjs, css, and html5. Managed scalable deployments via aws. Worked extensively with nodejs and expressjs to build REST APIs.",
  jd: "Senior Frontend Engineer\nRequirements: Expert in React.js, TypeScript (ts), and TailwindCSS. Strong testing capabilities using Jest or Cypress. Knowledge of Docker on GCP is a plus.",
  list: "python, scss, git, docker, gcp, graphql, gql, pg, postgresql, next.js, tailwind, c++"
};

// --- Quick Add Chips ---------------------------------------------------------
const QUICK_CHIPS = [
  "js", "reactjs", "aws", "typescript", "c++", "next.js", "sass", "docker", "postgresql", "figma"
];

function SkillChip({ skill }: { skill: DetectedSkill }) {
  const badgeStyles = {
    unspecified: "bg-[var(--surface-soft)] text-text-secondary border-[var(--border-muted)]",
    beginner: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    moderate: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    expert: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-all duration-200 hover:scale-105 ${badgeStyles[skill.level]}`}
    >
      <span className="font-semibold">{skill.canonical}</span>
      {skill.level !== "unspecified" && (
        <span className="text-[8px] px-1 py-0.5 rounded bg-current/10 font-extrabold tracking-widest">
          {skill.level}
        </span>
      )}
    </div>
  );
}

export default function ParserPage() {
  const router = useRouter();
  const { setResume } = useResume();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [showTrace, setShowTrace] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setResult(parseSkills(input, "resume"));
    setShowTrace(false);
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setShowTrace(false);
  };

  const loadTemplate = (key: keyof typeof TEMPLATES) => {
    setInput(TEMPLATES[key]);
    setResult(null);
    setShowTrace(false);
  };

  const appendChip = (chip: string) => {
    setInput((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return chip;
      if (trimmed.endsWith(",") || trimmed.endsWith(".")) {
        return `${prev} ${chip}`;
      }
      return `${prev}, ${chip}`;
    });
  };

  // Group skills by proficiency level
  const groupedSkills = result
    ? {
        expert: result.skills.filter((s) => s.level === "expert"),
        moderate: result.skills.filter((s) => s.level === "moderate"),
        beginner: result.skills.filter((s) => s.level === "beginner"),
        unspecified: result.skills.filter((s) => s.level === "unspecified"),
      }
    : null;

  // Send to Job Match
  const handleSendToJobMatch = () => {
    if (!result) return;
    // Pre-populate resume input for Job Match page
    const skillList = result.skills.map((s) => s.canonical).join(", ");
    setResume(`Normalized Skills extracted from parser:\n${skillList}\n\nOriginal Input:\n${input}`);
    router.push("/job-match");
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <PageHeader
        title="Skill Parser"
        description="Paste resume snippets, job requirements, or a skill list. We map aliases to standard tags using a local registry."
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (Card has no hover transform) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[var(--surface-card)] border border-[var(--border-muted)] rounded-2xl shadow-sm">
            <CardHeader 
              title="Unstructured Input" 
              description="Paste raw plain text below to normalize and extract skills."
              className="border-b border-[var(--border-muted)] pb-4 px-6 pt-5" 
            />
            <CardBody className="py-5 px-6 space-y-5">
              
              {/* Quick Template Selectors */}
              <div className="space-y-2">
                <span className="block text-[9px] font-mono text-text-muted uppercase tracking-wider">Quick Templates</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => loadTemplate("resume")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-xs text-text-secondary transition-all cursor-pointer font-mono"
                  >
                    <FileText className="w-3.5 h-3.5 text-accent-primary" />
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => loadTemplate("jd")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-xs text-text-secondary transition-all cursor-pointer font-mono"
                  >
                    <Layers className="w-3.5 h-3.5 text-accent-secondary" />
                    Job Posting
                  </button>
                  <button
                    type="button"
                    onClick={() => loadTemplate("list")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-card)] hover:bg-[var(--surface-hover)] text-xs text-text-secondary transition-all cursor-pointer font-mono"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accent-tertiary" />
                    Skill List
                  </button>
                </div>
              </div>

              {/* Main Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. Senior dev with 8 years of React, expert in js/es6, and docker on aws..."
                    className="w-full h-48 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/30 px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 resize-none transition-all duration-200 font-sans"
                  />
                  {input && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 bottom-3 p-1.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-muted)] text-text-muted hover:text-danger hover:border-danger/30 transition-all cursor-pointer"
                      title="Clear Input"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 h-11 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary cursor-pointer" disabled={!input.trim()}>
                    <Play className="w-3.5 h-3.5 mr-1" /> Normalize Skills
                  </Button>
                </div>
              </form>

              {/* Interactive Quick Add Chips */}
              <div className="space-y-2 border-t border-[var(--border-muted)] pt-4">
                <span className="block text-[9px] font-mono text-text-muted uppercase tracking-wider">Interactive Scratchpad (Click to Insert)</span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => appendChip(chip)}
                      className="px-2.5 py-1 rounded bg-[var(--surface-soft)]/50 border border-[var(--border-muted)] text-[10px] font-mono text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-all cursor-pointer uppercase"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

            </CardBody>
          </Card>
        </div>

        {/* Right Column: Normalized Results (Card has no hover transform) */}
        <div className="lg:col-span-7">
          <Card className="bg-[var(--surface-card)] border border-[var(--border-muted)] rounded-2xl shadow-sm h-full flex flex-col justify-between">
            <CardHeader 
              title="Normalized Results" 
              className="border-b border-[var(--border-muted)] pb-4 px-6 pt-5" 
            />
            <CardBody className="py-6 px-6 flex-1 flex flex-col justify-between min-h-[420px]">
              {!result ? (
                <div className="text-center py-16 text-text-secondary flex-1 flex flex-col justify-center items-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--surface-soft)] border border-[var(--border-muted)] flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-text-muted" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-text-primary">Clarity Engine Ready</p>
                    <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                      Paste unstructured text on the left and run normalization to map synonyms and aliases to standardized career tags.
                    </p>
                  </div>
                </div>
              ) : result.skills.length === 0 ? (
                <div className="text-center py-16 text-text-secondary flex-1 flex flex-col justify-center items-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
                    <BadgeAlert className="w-6 h-6 text-danger" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-text-primary">No Standard Skills Mapped</p>
                    <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                      The parser could not detect standard technical skills in this text. Try using terms like React, Python, AWS, Docker, or git.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  
                  {/* Stats / Dashboard row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[var(--surface-soft)]/45 border border-[var(--border-muted)] rounded-xl p-3 text-center">
                      <span className="block text-[8px] font-mono text-text-muted uppercase tracking-wider">Discipline</span>
                      <span className="block font-semibold text-text-primary text-xs font-mono uppercase mt-1 truncate">
                        {result.discipline ?? "General / Misc"}
                      </span>
                    </div>
                    <div className="bg-[var(--surface-soft)]/45 border border-[var(--border-muted)] rounded-xl p-3 text-center">
                      <span className="block text-[8px] font-mono text-text-muted uppercase tracking-wider">Skills Mapped</span>
                      <span className="block font-semibold text-text-primary text-xs font-mono mt-1">
                        {result.skills.length} Nodes
                      </span>
                    </div>
                    <div className="bg-[var(--surface-soft)]/45 border border-[var(--border-muted)] rounded-xl p-3 text-center">
                      <span className="block text-[8px] font-mono text-text-muted uppercase tracking-wider">Engine Status</span>
                      <span className="block font-semibold text-success text-xs font-mono mt-1 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% OK
                      </span>
                    </div>
                  </div>

                  {/* Grouped Skills Display */}
                  <div className="space-y-4 flex-1">
                    <span className="block text-[9px] font-mono text-text-muted uppercase tracking-wider">Normalized Skill Categorization</span>
                    
                    <div className="space-y-3.5">
                      {/* Expert Group */}
                      {groupedSkills && groupedSkills.expert.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="block text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Expert Capabilities</span>
                          <div className="flex flex-wrap gap-2">
                            {groupedSkills.expert.map((skill) => (
                              <SkillChip key={skill.canonical} skill={skill} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Moderate Group */}
                      {groupedSkills && groupedSkills.moderate.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="block text-[9px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Moderate/Intermediate</span>
                          <div className="flex flex-wrap gap-2">
                            {groupedSkills.moderate.map((skill) => (
                              <SkillChip key={skill.canonical} skill={skill} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Beginner Group */}
                      {groupedSkills && groupedSkills.beginner.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="block text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Beginner/Exploring</span>
                          <div className="flex flex-wrap gap-2">
                            {groupedSkills.beginner.map((skill) => (
                              <SkillChip key={skill.canonical} skill={skill} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Unspecified Group */}
                      {groupedSkills && groupedSkills.unspecified.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="block text-[9px] font-mono font-bold text-text-secondary uppercase tracking-wider">Mapped Capabilities</span>
                          <div className="flex flex-wrap gap-2">
                            {groupedSkills.unspecified.map((skill) => (
                              <SkillChip key={skill.canonical} skill={skill} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Debug / Mapped Token Trace Panel */}
                  <div className="border-t border-[var(--border-muted)] pt-4">
                    <button
                      type="button"
                      onClick={() => setShowTrace((v) => !v)}
                      className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
                    >
                      {showTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {showTrace ? "Hide Debug Trace" : "Show Mapped Token Trace"}
                    </button>
                    
                    {showTrace && (
                      <div className="mt-3 max-h-40 overflow-y-auto rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/20 p-4 font-mono text-[10px] leading-relaxed">
                        <div className="grid grid-cols-2 gap-2 text-[8px] uppercase font-bold text-text-muted border-b border-[var(--border-muted)] pb-1.5 mb-2">
                          <span>Raw Token / Word</span>
                          <span>Mapping Status</span>
                        </div>
                        <ul className="space-y-2">
                          {result.tokenTrace.map((row, i) => (
                            <li
                              key={`${row.token}-${i}`}
                              className="flex items-center justify-between border-b border-[var(--border-muted)]/40 pb-1"
                            >
                              <span className={row.hit ? "font-semibold text-text-primary" : "text-text-muted/60 line-through"}>
                                {row.token}
                              </span>
                              {row.hit ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                  ➔ {row.canonical}
                                </span>
                              ) : (
                                <span className="text-text-muted/40 text-[9px] italic">
                                  {row.skipReason ?? "ignored"}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Clean CTA to Job Match */}
                  <div className="border-t border-[var(--border-muted)] pt-5 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-accent-primary/[0.03] border border-accent-primary/10 rounded-xl p-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-text-primary font-mono uppercase tracking-wider">Compare Gaps in Job Match</p>
                      <p className="text-[10px] text-text-secondary leading-relaxed">
                        Cross-reference these parsed skills against a target Job Description.
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={handleSendToJobMatch}
                      className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase cursor-pointer py-1.5 px-3 shrink-0"
                    >
                      Run Job Match <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
