"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { extractSkillsFromText } from "@/lib/skill-map";
import {
  Sparkles,
  Clipboard,
  Download,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
  Edit3,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type Mode = "build" | "improve";
type Screen = "select" | "input" | "result";

interface ExperienceEntry {
  jobTitle: string;
  company: string;
  duration: string;
  bullets: string;
}

interface ProjectEntry {
  title: string;
  description: string;
}

// Helper to render Markdown cleanly without dependencies
function renderMarkdown(text: string) {
  if (!text) return null;

  const lines = text.split("\n");

  const renderTextWithBold = (txt: string) => {
    const parts = txt.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong key={i} className="font-semibold text-text-primary">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ")) {
      return (
        <h1
          key={idx}
          className="text-xl font-bold font-serif text-text-primary mt-6 mb-3 border-b border-[var(--border-muted)] pb-1.5 uppercase tracking-wide"
        >
          {trimmed.slice(2)}
        </h1>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={idx}
          className="text-sm font-bold font-serif text-text-primary mt-5 mb-2 uppercase tracking-wide"
        >
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={idx}
          className="text-xs font-semibold text-text-secondary mt-3 mb-1 font-mono uppercase tracking-wider"
        >
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const content = trimmed.slice(2);
      return (
        <li
          key={idx}
          className="text-xs text-text-secondary ml-5 list-disc leading-relaxed mt-1"
        >
          {renderTextWithBold(content)}
        </li>
      );
    }
    if (trimmed === "") {
      return <div key={idx} className="h-2" />;
    }

    return (
      <p
        key={idx}
        className="text-xs text-text-secondary leading-relaxed font-sans mt-1"
      >
        {renderTextWithBold(line)}
      </p>
    );
  });
}

export default function ResumeBuilderPage() {
  const [screen, setScreen] = useState<Screen>("select");
  const [mode, setMode] = useState<Mode | null>(null);

  // Loading and result states
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [generatedResume, setGeneratedResume] = useState<string>("");
  const [changesSummary, setChangesSummary] = useState<string>("");
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Rotating loading messages
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const loadingMessages = [
    "Structuring profile details...",
    "Extracting key capabilities...",
    "Aligning with ATS formatting rules...",
    "Crafting bullet points with strong action verbs...",
    "Finalizing resume template structure...",
  ];

  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isPending, loadingMessages.length]);

  // ── SCREEN 2A: BUILD STATE ──
  const [buildStep, setBuildStep] = useState(1);
  const [buildData, setBuildData] = useState({
    name: "",
    title: "",
    experienceYears: "0-1",
    status: "Student",
    skillsInput: "",
    certs: "",
    degree: "",
    institution: "",
    gradYear: "",
    tone: "Professional",
    format: "Chronological",
    instructions: "",
  });
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([
    { jobTitle: "", company: "", duration: "", bullets: "" },
  ]);
  const [noExperience, setNoExperience] = useState(false);
  const [projects, setProjects] = useState<ProjectEntry[]>([
    { title: "", description: "" },
  ]);

  // Live skill parser for build mode
  const parsedBuildSkills = useMemo(() => {
    return extractSkillsFromText(buildData.skillsInput);
  }, [buildData.skillsInput]);

  // Handle build mode repeating blocks
  const handleAddExperience = () => {
    if (experiences.length < 4) {
      setExperiences([
        ...experiences,
        { jobTitle: "", company: "", duration: "", bullets: "" },
      ]);
    }
  };

  const handleRemoveExperience = (idx: number) => {
    setExperiences(experiences.filter((_, i) => i !== idx));
  };

  const handleUpdateExperience = (idx: number, field: keyof ExperienceEntry, val: string) => {
    const next = [...experiences];
    next[idx][field] = val;
    setExperiences(next);
  };

  const handleAddProject = () => {
    if (projects.length < 3) {
      setProjects([...projects, { title: "", description: "" }]);
    }
  };

  const handleRemoveProject = (idx: number) => {
    setProjects(projects.filter((_, i) => i !== idx));
  };

  const handleUpdateProject = (idx: number, field: keyof ProjectEntry, val: string) => {
    const next = [...projects];
    next[idx][field] = val;
    setProjects(next);
  };

  // ── SCREEN 2B: IMPROVE STATE ──
  const [improveResumeText, setImproveResumeText] = useState("");
  const [improveOptions, setImproveOptions] = useState({
    grammar: true,
    bullets: false,
    tailor: false,
  });
  const [improveJdText, setImproveJdText] = useState("");
  const [improveInstructions, setImproveInstructions] = useState("");

  // Live skill parser for improve mode
  const parsedImproveSkills = useMemo(() => {
    return extractSkillsFromText(improveResumeText);
  }, [improveResumeText]);

  // ── ACTIONS ──

  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode);
    setScreen("input");
    setBuildStep(1);
    setError(null);
  };

  const handleStartOver = () => {
    setScreen("select");
    setMode(null);
    setGeneratedResume("");
    setChangesSummary("");
    setError(null);
  };

  const handleBuildSubmit = () => {
    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          mode: "build",
          name: buildData.name,
          title: buildData.title,
          experienceYears: buildData.experienceYears,
          status: buildData.status,
          skills: buildData.skillsInput,
          experience: noExperience ? [] : experiences,
          education: buildData.degree
            ? {
                degree: buildData.degree,
                institution: buildData.institution,
                gradYear: buildData.gradYear,
              }
            : undefined,
          certs: buildData.certs,
          projects: projects.filter((p) => p.title.trim() !== ""),
          tone: buildData.tone,
          format: buildData.format,
          instructions: buildData.instructions,
        };

        const res = await fetch("/api/resume-builder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to generate resume.");
        }

        setGeneratedResume(data.resume);
        setScreen("result");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        setError(msg);
      }
    });
  };

  const handleImproveSubmit = () => {
    if (!improveResumeText.trim() || improveResumeText.length < 30) {
      setError("Please paste a valid resume containing at least 30 characters.");
      return;
    }

    const selectedImps = Object.entries(improveOptions)
      .filter(([, checked]) => checked)
      .map(([name]) => name);

    if (selectedImps.length === 0) {
      setError("Please check at least one improvement option.");
      return;
    }

    if (improveOptions.tailor && (!improveJdText.trim() || improveJdText.length < 30)) {
      setError("Please paste a target job description to tailor your resume.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          mode: "improve",
          resumeText: improveResumeText,
          improvements: selectedImps,
          jd: improveOptions.tailor ? improveJdText : undefined,
          instructions: improveInstructions,
        };

        const res = await fetch("/api/resume-builder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to improve resume.");
        }

        setGeneratedResume(data.resume);
        setChangesSummary(data.summary || "");
        setScreen("result");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        setError(msg);
      }
    });
  };

  const handleCopyToClipboard = () => {
    if (!generatedResume) return;
    navigator.clipboard.writeText(generatedResume).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadTxt = () => {
    if (!generatedResume) return;
    const blob = new Blob([generatedResume], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = mode === "build" 
      ? `${buildData.name.trim().replace(/\s+/g, "_") || "My"}_Resume.txt`
      : "Improved_Resume.txt";
    link.download = filename;
    link.click();
  };

  // ── RENDERING ──

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {screen !== "result" && (
        <PageHeader
          title="Resume Builder"
          description="Craft an ATS-optimized, professional editorial resume from scratch or polish your existing profile using AI."
        />
      )}

      {error && screen !== "result" && (
        <Card className="border-danger/30 bg-danger/[0.04]">
          <CardBody className="py-4 px-6 text-sm font-medium text-danger">
            {error}
          </CardBody>
        </Card>
      )}

      {/* ── LOADING SKELETON SCREEN ── */}
      {isPending && (
        <Card className="premium-card">
          <CardBody className="py-20 flex flex-col items-center justify-center text-center space-y-6">
            <RefreshCw className="w-10 h-10 text-accent-primary animate-spin" />
            <div className="space-y-2">
              <p className="text-sm font-mono uppercase tracking-widest text-text-primary animate-pulse">
                {loadingMessages[loadingMsgIdx]}
              </p>
              <p className="text-xs text-text-muted">
                Groq LLM is preparing your custom ATS-optimized resume. This may take 10-15 seconds.
              </p>
            </div>
            <div className="w-64 h-1.5 bg-[var(--surface-muted)] rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-accent-primary animate-pulse-progress rounded-full" />
            </div>
          </CardBody>
        </Card>
      )}

      {!isPending && (
        <>
          {/* ── SCREEN 1: MODE SELECT ── */}
          {screen === "select" && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="premium-card cursor-pointer group hover:border-accent-primary/40 hover:bg-surface-hover/30 transition-all duration-300"
                onClick={() => handleModeSelect("build")}
              >
                <CardBody className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif italic text-text-primary font-bold">
                      Build from scratch
                    </h3>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                      Start fresh. We&apos;ll ask you a few targeted questions about your credentials and write a professional resume for you.
                    </p>
                  </div>
                  <Button variant="secondary" className="text-xs font-mono uppercase tracking-widest mt-4">
                    Create Fresh →
                  </Button>
                </CardBody>
              </Card>

              <Card
                className="premium-card cursor-pointer group hover:border-accent-primary/40 hover:bg-surface-hover/30 transition-all duration-300"
                onClick={() => handleModeSelect("improve")}
              >
                <CardBody className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
                    <Edit3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif italic text-text-primary font-bold">
                      Improve existing resume
                    </h3>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                      Paste what you have. We&apos;ll fix grammar, strengthen bullets using active wording, or tailor the content to a job description.
                    </p>
                  </div>
                  <Button variant="secondary" className="text-xs font-mono uppercase tracking-widest mt-4">
                    Import & Edit →
                  </Button>
                </CardBody>
              </Card>
            </div>
          )}

          {/* ── SCREEN 2: INPUT FORM ── */}
          {screen === "input" && mode === "build" && (
            <Card className="premium-card">
              <CardBody className="pt-6 space-y-6">
                {/* Step indicators */}
                <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((stepNum) => (
                      <React.Fragment key={stepNum}>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                            buildStep === stepNum
                              ? "bg-accent-primary text-[#F6F1E8]"
                              : buildStep > stepNum
                              ? "bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/30"
                              : "bg-[var(--surface-soft)] text-text-muted border border-[var(--border-muted)]"
                          }`}
                        >
                          {buildStep > stepNum ? <Check className="w-3.5 h-3.5" /> : stepNum}
                        </div>
                        {stepNum < 5 && (
                          <div
                            className={`h-0.5 w-4 sm:w-8 transition-colors ${
                              buildStep > stepNum ? "bg-[var(--success)]" : "bg-[var(--border-muted)]"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                    Step {buildStep} of 5
                  </span>
                </div>

                {/* Wizard form steps */}
                {buildStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold font-serif text-text-primary uppercase tracking-wider border-b border-[var(--border-muted)] pb-1">
                      Step 1: About You
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={buildData.name}
                          onChange={(e) => setBuildData({ ...buildData, name: e.target.value })}
                          className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                          Target Title
                        </label>
                        <input
                          type="text"
                          required
                          value={buildData.title}
                          onChange={(e) => setBuildData({ ...buildData, title: e.target.value })}
                          className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                          placeholder="Frontend Engineer"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                          Years of Experience
                        </label>
                        <select
                          value={buildData.experienceYears}
                          onChange={(e) => setBuildData({ ...buildData, experienceYears: e.target.value })}
                          className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                        >
                          <option value="0-1">0–1 years</option>
                          <option value="1-3">1–3 years</option>
                          <option value="3-5">3–5 years</option>
                          <option value="5+">5+ years</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                          Current Status
                        </label>
                        <select
                          value={buildData.status}
                          onChange={(e) => setBuildData({ ...buildData, status: e.target.value })}
                          className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                        >
                          <option value="Student">Student</option>
                          <option value="Recent grad">Recent Graduate</option>
                          <option value="Working professional">Working Professional</option>
                          <option value="Career switcher">Career Switcher</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {buildStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold font-serif text-text-primary uppercase tracking-wider border-b border-[var(--border-muted)] pb-1">
                      Step 2: Skills
                    </h3>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                        Describe your skills / tools (freeform)
                      </label>
                      <textarea
                        value={buildData.skillsInput}
                        onChange={(e) => setBuildData({ ...buildData, skillsInput: e.target.value })}
                        className="w-full h-32 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary resize-none focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                        placeholder="List languages, frameworks, design tools, methods (e.g. JavaScript, React, Tailwind, Figma, agile)"
                      />
                    </div>
                    {parsedBuildSkills.length > 0 && (
                      <div className="space-y-2 bg-[var(--surface-soft)]/40 p-4 border border-[var(--border-muted)] rounded-xl">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                          Detected Canonical Tags ({parsedBuildSkills.length}):
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {parsedBuildSkills.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--border-muted)] bg-[var(--surface-soft)] text-text-secondary uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {buildStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-1">
                      <h3 className="text-sm font-semibold font-serif text-text-primary uppercase tracking-wider">
                        Step 3: Experience
                      </h3>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={noExperience}
                          onChange={(e) => setNoExperience(e.target.checked)}
                          className="rounded border-[var(--border-muted)] text-accent-primary focus:ring-accent-primary/30"
                        />
                        <span className="text-[11px] font-mono uppercase tracking-wider text-text-secondary">
                          No experience yet
                        </span>
                      </label>
                    </div>

                    {!noExperience ? (
                      <div className="space-y-6">
                        {experiences.map((exp, idx) => (
                          <div
                            key={idx}
                            className="p-4 border border-[var(--border-muted)] bg-[var(--surface-soft)]/30 rounded-xl space-y-4 relative"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                                Role #{idx + 1}
                              </span>
                              {experiences.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExperience(idx)}
                                  className="text-text-muted hover:text-danger transition-colors p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] font-mono uppercase tracking-wider text-text-secondary mb-1">
                                  Job Title
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={exp.jobTitle}
                                  onChange={(e) =>
                                    handleUpdateExperience(idx, "jobTitle", e.target.value)
                                  }
                                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                                  placeholder="Software Engineer"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono uppercase tracking-wider text-text-secondary mb-1">
                                  Company
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={exp.company}
                                  onChange={(e) =>
                                    handleUpdateExperience(idx, "company", e.target.value)
                                  }
                                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                                  placeholder="Tech Corp"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono uppercase tracking-wider text-text-secondary mb-1">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={exp.duration}
                                  onChange={(e) =>
                                    handleUpdateExperience(idx, "duration", e.target.value)
                                  }
                                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                                  placeholder="2023 - Present"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono uppercase tracking-wider text-text-secondary mb-1">
                                Bullet Points (2–3 items)
                              </label>
                              <textarea
                                value={exp.bullets}
                                onChange={(e) =>
                                    handleUpdateExperience(idx, "bullets", e.target.value)
                                }
                                className="w-full h-24 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3 py-2 text-xs text-text-primary resize-none focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                                placeholder="- Led development of React component library&#10;- Optimized page loading speeds by 40%"
                              />
                            </div>
                          </div>
                        ))}

                        {experiences.length < 4 && (
                          <button
                            type="button"
                            onClick={handleAddExperience}
                            className="w-full py-2.5 rounded-lg border border-dashed border-[var(--border-strong)] hover:border-accent-primary bg-transparent text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-surface-hover/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Plus className="w-4 h-4" /> Add another role
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-text-muted font-mono text-xs">
                        Work history will be skipped. Ensure you add projects in the next step to fill the space!
                      </div>
                    )}
                  </div>
                )}

                {buildStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold font-serif text-text-primary uppercase tracking-wider border-b border-[var(--border-muted)] pb-1">
                        Step 4: Education & Projects
                      </h3>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-text-secondary mb-1">
                            Degree / Certification
                          </label>
                          <input
                            type="text"
                            value={buildData.degree}
                            onChange={(e) => setBuildData({ ...buildData, degree: e.target.value })}
                            className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                            placeholder="B.S. Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-text-secondary mb-1">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={buildData.institution}
                            onChange={(e) => setBuildData({ ...buildData, institution: e.target.value })}
                            className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                            placeholder="State University"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-text-secondary mb-1">
                            Graduation Year
                          </label>
                          <input
                            type="text"
                            value={buildData.gradYear}
                            onChange={(e) => setBuildData({ ...buildData, gradYear: e.target.value })}
                            className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                            placeholder="2025"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-[var(--border-muted)]">
                      <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                        Other Certifications (Freeform - Optional)
                      </label>
                      <textarea
                        value={buildData.certs}
                        onChange={(e) => setBuildData({ ...buildData, certs: e.target.value })}
                        className="w-full h-20 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary resize-none focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                        placeholder="AWS Solutions Architect, Figma Professional, etc."
                      />
                    </div>

                    <div className="space-y-4 pt-2 border-t border-[var(--border-muted)]">
                      <span className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                        Key Projects (Up to 3 - Optional)
                      </span>
                      <div className="space-y-4">
                        {projects.map((proj, idx) => (
                          <div
                            key={idx}
                            className="p-3 border border-[var(--border-muted)] bg-[var(--surface-soft)]/20 rounded-lg space-y-3 relative"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-text-muted">
                                Project #{idx + 1}
                              </span>
                              {projects.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProject(idx)}
                                  className="text-text-muted hover:text-danger transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div>
                                <input
                                  type="text"
                                  value={proj.title}
                                  onChange={(e) =>
                                    handleUpdateProject(idx, "title", e.target.value)
                                  }
                                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3 py-1.5 text-xs text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                                  placeholder="Project Title (e.g. E-Commerce App)"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={proj.description}
                                  onChange={(e) =>
                                    handleUpdateProject(idx, "description", e.target.value)
                                  }
                                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3 py-1.5 text-xs text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                                  placeholder="One-line description (e.g. built using Next.js)"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        {projects.length < 3 && (
                          <button
                            type="button"
                            onClick={handleAddProject}
                            className="w-full py-2 rounded-lg border border-dashed border-[var(--border-strong)] hover:border-accent-primary bg-transparent text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-text-primary hover:bg-surface-hover/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add project
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {buildStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold font-serif text-text-primary uppercase tracking-wider border-b border-[var(--border-muted)] pb-1">
                      Step 5: Preferences
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                          Writing Tone
                        </label>
                        <select
                          value={buildData.tone}
                          onChange={(e) => setBuildData({ ...buildData, tone: e.target.value })}
                          className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                        >
                          <option value="Professional">Professional</option>
                          <option value="Concise">Concise</option>
                          <option value="Detailed">Detailed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                          Resume Layout Style
                        </label>
                        <select
                          value={buildData.format}
                          onChange={(e) => setBuildData({ ...buildData, format: e.target.value })}
                          className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-2.5 text-sm text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                        >
                          <option value="Chronological">Chronological</option>
                          <option value="Skills-first">Skills-first</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                        Specific Instructions (Max 200 chars - Optional)
                      </label>
                      <textarea
                        maxLength={200}
                        value={buildData.instructions}
                        onChange={(e) => setBuildData({ ...buildData, instructions: e.target.value })}
                        className="w-full h-24 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary resize-none focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                        placeholder="e.g. emphasize my backend capabilities, or target web development roles..."
                      />
                      <p className="text-[10px] text-text-muted mt-1 text-right font-mono">
                        {buildData.instructions.length} / 200 characters
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="pt-4 border-t border-[var(--border-muted)] flex justify-between gap-3">
                  {buildStep > 1 ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setBuildStep(buildStep - 1)}
                      className="px-4 py-2.5 font-mono uppercase tracking-widest text-xs cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1.5" /> Back
                    </Button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartOver}
                      className="text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                      ← Start Over
                    </button>
                  )}

                  {buildStep < 5 ? (
                    <Button
                      type="button"
                      onClick={() => {
                        if (buildStep === 1 && (!buildData.name || !buildData.title)) {
                          setError("Name and target title are required.");
                          return;
                        }
                        setError(null);
                        setBuildStep(buildStep + 1);
                      }}
                      className="px-6 py-2.5 font-mono uppercase tracking-widest text-xs cursor-pointer"
                    >
                      Next <ChevronRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleBuildSubmit}
                      className="px-6 py-2.5 font-mono uppercase tracking-widest text-xs bg-accent-primary text-[#F6F1E8] cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 mr-1.5" /> Generate Resume
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* ── SCREEN 2B: IMPROVE EXISTING FORM ── */}
          {screen === "input" && mode === "improve" && (
            <Card className="premium-card">
              <CardBody className="pt-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2 mb-3">
                    <h3 className="text-sm font-semibold font-serif text-text-primary uppercase tracking-wider">
                      Paste existing resume text
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                      Minimum 30 chars
                    </span>
                  </div>
                  <textarea
                    value={improveResumeText}
                    onChange={(e) => setImproveResumeText(e.target.value)}
                    className="w-full min-h-[180px] rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4 text-sm font-mono text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all"
                    placeholder="Paste plain text from your current resume here..."
                  />
                </div>

                {parsedImproveSkills.length > 0 && (
                  <div className="space-y-2 bg-[var(--surface-soft)]/40 p-4 border border-[var(--border-muted)] rounded-xl">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                      Parsed skills detected in real time ({parsedImproveSkills.length}):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedImproveSkills.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded border border-[var(--border-muted)] bg-[var(--surface-soft)] text-text-secondary uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-2 border-t border-[var(--border-muted)]">
                  <span className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                    Select improvements (pick at least one)
                  </span>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2.5 p-3 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/20 cursor-pointer select-none hover:bg-surface-hover/30 transition-colors">
                      <input
                        type="checkbox"
                        checked={improveOptions.grammar}
                        onChange={(e) =>
                          setImproveOptions({ ...improveOptions, grammar: e.target.checked })
                        }
                        className="rounded border-[var(--border-muted)] text-accent-primary focus:ring-accent-primary/30"
                      />
                      <span className="text-xs text-text-primary font-mono uppercase tracking-wider">
                        Fix Grammar & Clarity
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/20 cursor-pointer select-none hover:bg-surface-hover/30 transition-colors">
                      <input
                        type="checkbox"
                        checked={improveOptions.bullets}
                        onChange={(e) =>
                          setImproveOptions({ ...improveOptions, bullets: e.target.checked })
                        }
                        className="rounded border-[var(--border-muted)] text-accent-primary focus:ring-accent-primary/30"
                      />
                      <span className="text-xs text-text-primary font-mono uppercase tracking-wider">
                        Strengthen Bullets
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/20 cursor-pointer select-none hover:bg-surface-hover/30 transition-colors">
                      <input
                        type="checkbox"
                        checked={improveOptions.tailor}
                        onChange={(e) =>
                          setImproveOptions({ ...improveOptions, tailor: e.target.checked })
                        }
                        className="rounded border-[var(--border-muted)] text-accent-primary focus:ring-accent-primary/30"
                      />
                      <span className="text-xs text-text-primary font-mono uppercase tracking-wider">
                        Tailor to a JD
                      </span>
                    </label>
                  </div>
                </div>

                {improveOptions.tailor && (
                  <div className="space-y-2 pt-2 border-t border-[var(--border-muted)] animate-fade-in">
                    <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                      Target Job Description
                    </label>
                    <textarea
                      value={improveJdText}
                      onChange={(e) => setImproveJdText(e.target.value)}
                      className="w-full min-h-[140px] rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4 text-sm font-mono text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all"
                      placeholder="Paste the target requirements / role description here..."
                    />
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-[var(--border-muted)]">
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">
                    Optional instructions (Max 200 chars)
                  </label>
                  <textarea
                    maxLength={200}
                    value={improveInstructions}
                    onChange={(e) => setImproveInstructions(e.target.value)}
                    className="w-full h-20 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary resize-none focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                    placeholder="e.g. emphasize my leadership experience, rewrite in a concise style..."
                  />
                  <p className="text-[10px] text-text-muted mt-1 text-right font-mono">
                    {improveInstructions.length} / 200 characters
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-[var(--border-muted)] flex justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    ← Start Over
                  </button>

                  <Button
                    type="button"
                    onClick={handleImproveSubmit}
                    className="px-6 py-2.5 font-mono uppercase tracking-widest text-xs bg-accent-primary text-[#F6F1E8] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 mr-1.5" /> Analyze & Improve
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ── SCREEN 3: RESULT SCREEN ── */}
          {screen === "result" && (
            <div className="space-y-6">
              <PageHeader
                title="Your Resume is Ready"
                description={
                  mode === "build"
                    ? "We generated a professional ATS-friendly markdown resume matching your preferences."
                    : "Your resume was enhanced and aligned with standard active recruiting wording rules."
                }
                action={
                  <button
                    onClick={handleStartOver}
                    className="text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    Start over
                  </button>
                }
              />

              {/* Collapsible what-changed panel */}
              {mode === "improve" && changesSummary && (
                <Card className="premium-card">
                  <button
                    type="button"
                    onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                    className="w-full px-6 py-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-text-secondary hover:text-text-primary select-none cursor-pointer"
                  >
                    <span className="font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent-primary" /> Recruiter Changes Summary
                    </span>
                    {isSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isSummaryOpen && (
                    <CardBody className="pt-0 pb-5 px-6 border-t border-[var(--border-muted)]">
                      <ul className="space-y-1.5 mt-4">
                        {changesSummary.split("\n").map((line, idx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;
                          const content = trimmed.startsWith("* ") || trimmed.startsWith("- ") ? trimmed.slice(2) : trimmed;
                          return (
                            <li key={idx} className="text-xs text-text-secondary leading-relaxed list-disc ml-5">
                              {content}
                            </li>
                          );
                        })}
                      </ul>
                    </CardBody>
                  )}
                </Card>
              )}

              {/* Styled Resume Preview Card */}
              <Card className="premium-card bg-[var(--surface-card-warm)] border-[var(--border-strong)] relative">
                <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
                <CardBody className="p-8 md:p-10 font-sans relative z-10 select-text selection:bg-accent-primary/20">
                  <div className="space-y-4 max-w-2xl mx-auto">
                    {renderMarkdown(generatedResume)}
                  </div>
                </CardBody>
              </Card>

              {/* Actions row */}
              <div className="flex flex-wrap gap-3 justify-end items-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCopyToClipboard}
                  className="font-mono uppercase tracking-widest text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[var(--success)]" /> Copied ✓
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-4 h-4" /> Copy markdown
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDownloadTxt}
                  className="font-mono uppercase tracking-widest text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download .txt
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
