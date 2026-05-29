"use client";

import React, { useState, useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Info, RefreshCw, Sparkles, FileText } from "lucide-react";
import { extractSkillsFromText } from "@/lib/skill-map";

// ── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_WEAK_RESUME = `JOHN DOE
Objective: I am looking for a job as a developer. I want to build websites and learn cool things.

Education:
- High school diploma

Skills:
- HTML
- Coding
- Computer skills

Experience:
- Worked on some school projects.
- Helped friends fix their computers.`;

const SAMPLE_JD = `Senior Frontend Engineer at TechCorp.
We are looking for a Software Engineer with expertise in JavaScript, React, TypeScript, Tailwind CSS, Git, and Webpack.
You will build responsive web applications, collaborate with designers using Figma, write unit tests with Jest, and deploy to AWS.

Requirements:
- 5+ years of experience in Frontend development.
- Bachelor's degree in Computer Science.
- Outstanding communication and team leadership skills.`;

const ACTION_VERBS = [
  "built", "led", "designed", "improved", "reduced", 
  "shipped", "launched", "scaled", "optimized", "created", 
  "managed", "delivered", "increased", "automated"
];

// ── Types ────────────────────────────────────────────────────────────────────

interface SubscoreDetail {
  id: string;
  label: string;
  weight: number;
  score: number;
  diagnosis: string;
  hurtPoints: string[];
  wins: string[];
}

export default function ATSScorerPage() {
  const { resume, setResume, jd, setJd } = useResume();
  const [hasScored, setHasScored] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load sample data
  const handleLoadSample = () => {
    setResume(SAMPLE_WEAK_RESUME);
    setJd(SAMPLE_JD);
    setHasScored(false);
  };

  // Run ATS scan
  const handleRunScan = () => {
    setLoading(true);
    // Simulate short scanning time for visual satisfaction
    setTimeout(() => {
      setLoading(false);
      setHasScored(true);
    }, 600);
  };

  const handleReset = () => {
    setResume("");
    setJd("");
    setHasScored(false);
  };

  // ── ATS SCORING LOGIC ──
  const analysis = useMemo(() => {
    if (!resume || !jd) return null;

    // 1. Keyword match (35%)
    const resumeSkills = extractSkillsFromText(resume);
    const jdSkills = extractSkillsFromText(jd);
    const matchedSkills = jdSkills.filter((s) => resumeSkills.includes(s));
    const missingSkills = jdSkills.filter((s) => !resumeSkills.includes(s));
    const keywordScore = jdSkills.length > 0 ? Math.round((matchedSkills.length / jdSkills.length) * 100) : 0;

    // 2. Format score (20%)
    const headers = ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS", "SUMMARY"];
    const foundHeaders: string[] = [];
    const missingHeaders: string[] = [];
    
    headers.forEach((h) => {
      const regex = new RegExp(`\\b${h}\\b`, "i");
      if (regex.test(resume)) {
        foundHeaders.push(h);
      } else {
        missingHeaders.push(h);
      }
    });
    const formatScore = Math.round((foundHeaders.length / 5) * 100);
    const hasTables = resume.includes("|");

    // 3. Length & Density (15%)
    const words = resume.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    let lengthScore = 40;
    if (wordCount >= 400 && wordCount <= 800) {
      lengthScore = 100;
    } else if ((wordCount >= 300 && wordCount < 400) || (wordCount > 800 && wordCount <= 1000)) {
      lengthScore = 70;
    }

    // 4. Impact Language (15%)
    let verbCount = 0;
    const foundVerbs: string[] = [];
    ACTION_VERBS.forEach((verb) => {
      const regex = new RegExp(`\\b${verb}\\b`, "gi");
      const matches = resume.match(regex);
      if (matches) {
        verbCount += matches.length;
        if (!foundVerbs.includes(verb)) foundVerbs.push(verb);
      }
    });
    const impactScore = wordCount > 0 ? Math.round(Math.min((verbCount / (wordCount / 100)) * 25, 100)) : 0;

    // 5. Contact Completeness (15%)
    let contactScore = 0;
    const contactChecks = {
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resume),
      linkedin: /linkedin\.com/i.test(resume),
      github: /github\.com/i.test(resume),
      phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d{10}\b/.test(resume),
      website: /https?:\/\/[^\s]+|www\.[^\s]+/.test(resume) && !/linkedin\.com|github\.com/i.test(resume),
    };
    
    if (contactChecks.email) contactScore += 20;
    if (contactChecks.linkedin) contactScore += 20;
    if (contactChecks.github) contactScore += 20;
    if (contactChecks.phone) contactScore += 20;
    if (contactChecks.website) contactScore += 20;

    // Calculate final weighted score
    const finalScore = Math.round(
      keywordScore * 0.35 +
      formatScore * 0.20 +
      lengthScore * 0.15 +
      impactScore * 0.15 +
      contactScore * 0.15
    );

    // ── Generate detailed findings ──
    const subscores: SubscoreDetail[] = [
      {
        id: "keywords",
        label: "Keyword Match",
        weight: 35,
        score: keywordScore,
        diagnosis: `Matched ${matchedSkills.length} out of ${jdSkills.length} skills detected in the job description.`,
        hurtPoints: missingSkills.length > 0 ? [`Missing critical keywords: ${missingSkills.slice(0, 4).join(", ")}.`] : [],
        wins: missingSkills.length > 0 
          ? [`Add the missing skills requested by the JD (like ${missingSkills.slice(0, 3).join(", ")}) into your skills section.`]
          : [`Excellent keyword match. Keep monitoring JD requirements for updates.`]
      },
      {
        id: "format",
        label: "Format & Layout",
        weight: 20,
        score: formatScore,
        diagnosis: `Found ${foundHeaders.length} of 5 standard sections. ${hasTables ? "Warning: Tables detected." : "No tables detected."}`,
        hurtPoints: [
          ...missingHeaders.map((h) => `Missing standard section header: ${h}.`),
          ...(hasTables ? ["Tables or vertical divider bars (|) detected. ATS parsers often scramble table layouts."] : [])
        ],
        wins: [
          ...missingHeaders.map((h) => `Add a clear "${h}" section header to help the parser map your details.`),
          ...(hasTables ? ["Remove markdown grids or tables. Use simple, flat bulleted lists to describe your work."] : [])
        ]
      },
      {
        id: "length",
        label: "Length & Word Count",
        weight: 15,
        score: lengthScore,
        diagnosis: `Your resume is ${wordCount} words long. Recommended length is 400-800 words.`,
        hurtPoints: wordCount < 400 
          ? ["Your resume is too brief. Standard ATS profiles expect at least 400 words detailing your history."]
          : wordCount > 800
            ? ["Your resume is too wordy. Resumes exceeding 800 words risk losing recruiter engagement."]
            : [],
        wins: wordCount < 400 
          ? ["Expand your projects or experience. Detail the technologies and methodologies you used in school/work."]
          : wordCount > 800
            ? ["Trim unnecessary adjectives or old, irrelevant experience to bring your word count below 800 words."]
            : ["Word count is in the ideal sweet spot. No action needed."]
      },
      {
        id: "impact",
        label: "Impact Language",
        weight: 15,
        score: impactScore,
        diagnosis: `Identified ${verbCount} action verbs. Recommended frequency is at least 3-4 action verbs per 100 words.`,
        hurtPoints: impactScore < 60
          ? ["Your resume uses passive or weak verbs. ATS scorers look for action-oriented language."]
          : [],
        wins: impactScore < 100
          ? ["Rewrite bullet points to begin with strong action verbs (e.g. replace 'Responsible for building...' with 'Built and scaled...')."]
          : ["Excellent action verb variety and density."]
      },
      {
        id: "contact",
        label: "Contact Info",
        weight: 15,
        score: contactScore,
        diagnosis: `Found ${Object.values(contactChecks).filter(Boolean).length} of 5 essential contact details.`,
        hurtPoints: [
          ...(!contactChecks.email ? ["Missing a valid email address."] : []),
          ...(!contactChecks.phone ? ["Missing phone number."] : []),
          ...(!contactChecks.linkedin ? ["Missing LinkedIn profile link."] : []),
          ...(!contactChecks.github ? ["Missing GitHub profile link."] : []),
          ...(!contactChecks.website ? ["Missing portfolio website link."] : [])
        ],
        wins: [
          ...(!contactChecks.email ? ["Add your email address in a prominent place at the top."] : []),
          ...(!contactChecks.phone ? ["Include a contact phone number."] : []),
          ...(!contactChecks.linkedin ? ["Create and paste your LinkedIn profile URL."] : []),
          ...(!contactChecks.github ? ["Add your GitHub URL to showcase your code repositories."] : []),
          ...(!contactChecks.website ? ["Add a link to your personal portfolio site or online projects."] : [])
        ]
      }
    ];

    // Get "hurt score" findings
    const allHurtPoints = subscores.flatMap((s) => s.hurtPoints);

    // Get "quick wins" from lowest 3 scores
    const sortedSubscores = [...subscores].sort((a, b) => a.score - b.score);
    const quickWins = sortedSubscores.slice(0, 3).flatMap((s) => s.wins).slice(0, 3);

    return {
      finalScore,
      subscores,
      allHurtPoints,
      quickWins,
      wordCount,
      matchedSkills,
      missingSkills
    };
  }, [resume, jd]);

  // Circular score styling
  const scoreDetails = useMemo(() => {
    if (!analysis) return { colorClass: "text-text-muted", strokeClass: "stroke-border-muted" };
    const score = analysis.finalScore;
    if (score >= 75) {
      return {
        colorClass: "text-success",
        strokeClass: "stroke-success",
        bgClass: "bg-success/[0.04]",
        borderClass: "border-success/20"
      };
    }
    if (score >= 50) {
      return {
        colorClass: "text-warning",
        strokeClass: "stroke-warning",
        bgClass: "bg-warning/[0.04]",
        borderClass: "border-warning/20"
      };
    }
    return {
      colorClass: "text-danger",
      strokeClass: "stroke-danger",
      bgClass: "bg-danger/[0.04]",
      borderClass: "border-danger/20"
    };
  }, [analysis]);

  // SVG arc calculation
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = analysis
    ? circumference - (analysis.finalScore / 100) * circumference
    : circumference;

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <PageHeader
        title="ATS Scorer"
        description="Paste your resume and a job description to audit your ATS compatibility score and identify structure/keyword gaps."
      />

      {!hasScored ? (
        <Card>
          <CardBody className="pt-6 space-y-6">
            {resume.trim() && jd.trim() && (
              <div className="flex justify-start animate-fade-in">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--success)]/20 bg-[var(--success)]/10 text-[var(--success)] text-xs font-mono">
                  <span>✓ Resume & JD carried over</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="ats-resume" className="block text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
                  Your Resume
                </label>
                <textarea
                  id="ats-resume"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your complete resume as plain text here."
                  className="w-full min-h-[220px] rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4 text-sm font-mono text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 transition-all"
                />
              </div>

              <div>
                <label htmlFor="ats-jd" className="block text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
                  Job Description
                </label>
                <textarea
                  id="ats-jd"
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the target job description here."
                  className="w-full min-h-[220px] rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4 text-sm font-mono text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-muted)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-muted)] hover:border-[var(--accent-primary)] bg-transparent px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Load weak sample
              </button>

              <Button
                type="button"
                onClick={handleRunScan}
                disabled={loading || resume.length < 20 || jd.length < 20}
                className="px-6 py-2.5"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running ATS scan...
                  </>
                ) : (
                  <>
                    Scan Resume →
                  </>
                )}
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        analysis && (
          <div className="space-y-6">
            {/* Top Score Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Score Badge */}
              <Card className={`${scoreDetails.bgClass} ${scoreDetails.borderClass} flex flex-col items-center justify-center py-8 text-center`}>
                <CardBody className="flex flex-col items-center">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        className="stroke-[var(--border-muted)]"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        className={`${scoreDetails.strokeClass} transition-all duration-1000 ease-out`}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-text-primary">{analysis.finalScore}</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted">ATS Score</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium mt-4 text-text-primary leading-relaxed">
                    {analysis.finalScore >= 75
                      ? "ATS Compatible. Your resume is well optimized."
                      : analysis.finalScore >= 50
                        ? "Moderate issues. Recommending structural updates."
                        : "High Risk. ATS scanners may discard this layout."}
                  </p>
                </CardBody>
              </Card>

              {/* Card 2: Quick Stats */}
              <Card className="col-span-2">
                <CardBody className="pt-6 h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                      Resume Metadata
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-text-secondary">Word Count</span>
                        <p className="text-xl font-bold text-text-primary mt-0.5">{analysis.wordCount} words</p>
                      </div>
                      <div>
                        <span className="text-xs text-text-secondary">Skills Matched</span>
                        <p className="text-xl font-bold text-text-primary mt-0.5">
                          {analysis.matchedSkills.length} / {analysis.matchedSkills.length + analysis.missingSkills.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[var(--surface-soft)] p-4 border border-[var(--border-muted)] text-xs text-text-secondary flex items-start gap-2 leading-relaxed">
                    <Info className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                    <span>
                      <strong>Heuristic Disclaimer</strong>: This is a simulation based on standard search-matching rules, layout structures, and word densities. Real ATS parsers behave differently, but catching these basic issues yields the highest success rates.
                    </span>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Subscores Breakdown Card */}
            <Card>
              <CardBody className="pt-6 space-y-5">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                  Scoring Breakdown
                </span>

                <div className="space-y-4 pt-1">
                  {analysis.subscores.map((sub) => (
                    <div key={sub.id} className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-text-primary font-mono">{sub.label} <span className="text-[10px] text-text-muted">({sub.weight}%)</span></span>
                        <span className="text-text-primary font-bold">{sub.score} / 100</span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div className="w-full h-2 rounded-full bg-[var(--surface-soft)] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            sub.score >= 75 
                              ? "bg-success" 
                              : sub.score >= 50 
                                ? "bg-warning" 
                                : "bg-danger"
                          }`}
                          style={{ width: `${sub.score}%` }}
                        />
                      </div>

                      <p className="text-xs text-text-secondary leading-relaxed">
                        {sub.diagnosis}
                      </p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Hurt Score & Quick Wins Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What Hurt Your Score */}
              <Card>
                <CardBody className="pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-danger" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                      What hurt your score
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {analysis.allHurtPoints.length > 0 ? (
                      analysis.allHurtPoints.map((point, index) => (
                        <div key={index} className="text-xs text-text-secondary leading-relaxed pl-3 border-l border-danger/30">
                          {point}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-text-muted italic">
                        No critical errors identified. Your layout is highly optimized.
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Quick Wins */}
              <Card>
                <CardBody className="pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                      Quick wins
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {analysis.quickWins.map((win, index) => (
                      <div key={index} className="flex gap-2 text-xs text-text-primary leading-relaxed">
                        <span className="text-[var(--accent-primary)] font-bold font-mono">#{index + 1}</span>
                        <span>{win}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center pt-2">
              <Button variant="secondary" onClick={handleReset} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Scan another resume
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
