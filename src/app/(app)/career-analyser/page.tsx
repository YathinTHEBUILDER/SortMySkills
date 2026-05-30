"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { createClient } from "@/lib/supabase/client";
import { deleteMyAnalysisSessionsAction } from "@/app/actions/analysis";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  parseSkills,
  extractSkillsFromText,
  type DetectedSkill,
} from "@/lib/skill-map";
import { COURSERA_COURSES } from "@/data/coursera-courses";
import {
  AlertTriangle,
  BookOpen,
  Code,
  Briefcase,
  Wrench,
  CheckSquare,
  Square,
  Check,
  Copy,
  ArrowRight,
  Calendar,
  FileCheck,
  Info,
  Sparkles,
} from "lucide-react";

// --- Tooltip Component -------------------------------------------------------
function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <span className="relative group inline-flex items-center">
      {children}
      <span
        role="tooltip"
        className="
          pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
          w-56 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-card)]
          px-3 py-2 text-[11px] leading-relaxed text-text-secondary shadow-lg
          opacity-0 scale-95 transition-all duration-150
          group-hover:opacity-100 group-hover:scale-100
        "
      >
        {content}
      </span>
    </span>
  );
}

// --- Action Verbs for ATS Scoring -------------------------------------------
const ACTION_VERBS = [
  "built", "led", "designed", "improved", "reduced", 
  "shipped", "launched", "scaled", "optimized", "created", 
  "managed", "delivered", "increased", "automated"
];

// --- Legacy Sample Data -----------------------------------------------------
const SAMPLE_RESUME = `JOHN DOE
Objective: I am looking for a job as a frontend developer. I want to build responsive websites using React, JavaScript, and HTML/CSS.
Education:
- Bachelor of Computer Science

Experience:
- Frontend Engineer: Built scalable web components. Led responsive styling refactors.
- Project Member: Developed simple Python scripts. Created Docker containers.

Skills:
- HTML5, CSS3, JavaScript (js), React (reactjs)
- Git, Docker, GCP

Contact:
Email: john.doe@gmail.com
Phone: 1234567890
LinkedIn: linkedin.com/in/johndoe
GitHub: github.com/johndoe`;

const SAMPLE_JD = `Senior Frontend Engineer at TechCorp.
We are looking for a Software Engineer with expertise in JavaScript, React, TypeScript, Tailwind CSS, Git, and Webpack.
Requirements:
- 5+ years of experience in Frontend development.
- Outstanding communication and team leadership skills.
- Docker on GCP knowledge is a plus.`;

// --- ATS Types --------------------------------------------------------------
interface SubscoreDetail {
  id: string;
  label: string;
  weight: number;
  score: number;
  diagnosis: string;
  hurtPoints: string[];
  wins: string[];
}

interface ATSAnalysis {
  finalScore: number;
  subscores: SubscoreDetail[];
  quickWins: string[];
  missingSkills: string[];
  wordCount: number;
}

// --- Job Match Types ---------------------------------------------------------
interface JobMatchAnalysis {
  score: number;
  matched: DetectedSkill[];
  missing: DetectedSkill[];
  supplementary: DetectedSkill[];
}

// --- Roadmap Types -----------------------------------------------------------
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

export default function CareerAnalyserPage() {
  const router = useRouter();
  
  // Shared state via ResumeContext
  const { resume, setResume, jd, setJd } = useResume();
  
  // Local state variables for roadmap preferences
  const [targetDate, setTargetDate] = useState("");
  const [focus, setFocus] = useState("");
  
  // Progressive results
  const [atsResult, setAtsResult] = useState<ATSAnalysis | null>(null);
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchAnalysis | null>(null);
  const [roadmapResult, setRoadmapResult] = useState<RoadmapResult | null>(null);
  
  // Loading states
  const [atsLoading, setAtsLoading] = useState(false);
  const [jobMatchLoading, setJobMatchLoading] = useState(false);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  
  // Diagnostics
  const [atsError, setAtsError] = useState<string | null>(null);
  const [jobMatchError, setJobMatchError] = useState<string | null>(null);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);
  const [roadmapDebugRaw, setRoadmapDebugRaw] = useState<string | null>(null);
  
  // Copied & checked milestones
  const [copied, setCopied] = useState(false);
  const [milestones, setMilestones] = useState<Record<string, boolean>>({});

  // Supabase Persistent Session States (Step 8 & 9)
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isDemoData, setIsDemoData] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load latest Supabase session if authenticated (Step 8 & 9)
  useEffect(() => {
    const loadSession = async () => {
      try {
        const supabaseClient = createClient();
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;

        const { data: sessions } = await supabaseClient
          .from("analysis_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        const latest = sessions?.[0];
        if (latest) {
          setSessionId(latest.id);
          // Only pre-populate if currently empty
          if (latest.resume_text && !resume) setResume(latest.resume_text);
          if (latest.jd_text && !jd) setJd(latest.jd_text);
          if (latest.target_date) setTargetDate(latest.target_date);
          if (latest.focus_areas) setFocus(latest.focus_areas);
          
          if (latest.ats_result) setAtsResult(latest.ats_result);
          if (latest.job_match_result) setJobMatchResult(latest.job_match_result);
          if (latest.roadmap_result) setRoadmapResult(latest.roadmap_result);
        }
      } catch (err) {
        console.error("Failed to load active session from Supabase:", err);
      }
    };
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAtsResultToSupabase = async (ats: ATSAnalysis) => {
    try {
      const supabaseClient = createClient();
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;

      if (sessionId) {
        await supabaseClient
          .from("analysis_sessions")
          .update({
            resume_text: resume,
            jd_text: jd,
            target_date: targetDate || null,
            focus_areas: focus || null,
            ats_result: ats,
            updated_at: new Date().toISOString(),
          })
          .eq("id", sessionId);
      } else {
        const { data: newSession } = await supabaseClient
          .from("analysis_sessions")
          .insert({
            user_id: user.id,
            resume_text: resume,
            jd_text: jd,
            target_date: targetDate || null,
            focus_areas: focus || null,
            ats_result: ats,
          })
          .select()
          .single();
        if (newSession) setSessionId(newSession.id);
      }
    } catch (e) {
      console.error("Failed to sync ATS result to Supabase:", e);
    }
  };

  const saveJobMatchResultToSupabase = async (match: JobMatchAnalysis) => {
    try {
      const supabaseClient = createClient();
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;

      if (sessionId) {
        await supabaseClient
          .from("analysis_sessions")
          .update({
            resume_text: resume,
            jd_text: jd,
            target_date: targetDate || null,
            focus_areas: focus || null,
            job_match_result: match,
            updated_at: new Date().toISOString(),
          })
          .eq("id", sessionId);
      } else {
        const { data: newSession } = await supabaseClient
          .from("analysis_sessions")
          .insert({
            user_id: user.id,
            resume_text: resume,
            jd_text: jd,
            target_date: targetDate || null,
            focus_areas: focus || null,
            job_match_result: match,
          })
          .select()
          .single();
        if (newSession) setSessionId(newSession.id);
      }
    } catch (e) {
      console.error("Failed to sync Job Match result to Supabase:", e);
    }
  };


  // Today string for roadmap minimum date limit
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  // Compute weeks remaining dynamically
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

  // Load milestone checked states from localStorage
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

  // Sync roadmap inputs with localStorage to prevent loss
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDate = localStorage.getItem("analyser_target_date");
      const storedFocus = localStorage.getItem("analyser_focus_areas");
      if (storedDate) setTargetDate(storedDate);
      if (storedFocus) setFocus(storedFocus);
    }
  }, []);

  const handleDateChange = (val: string) => {
    setTargetDate(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("analyser_target_date", val);
    }
  };

  const handleFocusChange = (val: string) => {
    setFocus(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("analyser_focus_areas", val);
    }
  };

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

  // Helper actions
  const handleDeleteSession = async () => {
    if (!confirm("Are you sure you want to delete all your saved analysis sessions? This action is permanent and cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await deleteMyAnalysisSessionsAction();
      if (res.success) {
        setResume("");
        setJd("");
        setTargetDate("");
        setFocus("");
        setMilestones({});
        setIsDemoData(false);
        setSessionId(null);
        handleResetAll();
        
        localStorage.removeItem("roadmap_milestones");
        localStorage.removeItem("analyser_target_date");
        localStorage.removeItem("analyser_focus_areas");
        
        toast.success("All saved resume and job description analyses have been permanently deleted.");
      } else {
        toast.error("Error deleting analysis: " + res.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const checkDemoDataProceed = () => {
    if (isDemoData || resume === SAMPLE_RESUME) {
      return confirm("⚠️ You are using the demo sample data. Any analysis saved will be for 'John Doe'. We recommend pasting your real resume first.\n\nDo you want to proceed with the demo data anyway?");
    }
    return true;
  };

  const handleLoadSample = () => {
    setResume(SAMPLE_RESUME);
    setJd(SAMPLE_JD);
    setIsDemoData(true);
    handleResetAll();
  };

  const handleClearInputs = () => {
    setResume("");
    setJd("");
    setIsDemoData(false);
    handleResetAll();
  };

  const handleResetAll = () => {
    setAtsResult(null);
    setJobMatchResult(null);
    setRoadmapResult(null);
    setAtsError(null);
    setJobMatchError(null);
    setRoadmapError(null);
    setRoadmapDebugRaw(null);
  };

  // 1. RUN ATS COMPATIBILITY SCAN
  const runATSScan = () => {
    if (!resume || !jd) return;
    if (!checkDemoDataProceed()) return;
    setAtsLoading(true);
    setAtsError(null);
    
    // Simulate slight process delay for visual satisfaction
    setTimeout(() => {
      try {
        const resumeSkills = extractSkillsFromText(resume);
        const jdSkills = extractSkillsFromText(jd);
        const matchedSkills = jdSkills.filter((s) => resumeSkills.includes(s));
        const missingSkills = jdSkills.filter((s) => !resumeSkills.includes(s));
        
        const keywordScore = jdSkills.length > 0 ? Math.round((matchedSkills.length / jdSkills.length) * 100) : 0;

        // Headers
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

        // Word count
        const words = resume.trim().split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        let lengthScore = 40;
        if (wordCount >= 400 && wordCount <= 800) {
          lengthScore = 100;
        } else if ((wordCount >= 300 && wordCount < 400) || (wordCount > 800 && wordCount <= 1000)) {
          lengthScore = 70;
        }

        // Action verbs
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

        // Contacts
        let contactScore = 0;
        const contactChecks = {
          email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resume),
          phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d{10}\b/.test(resume),
          linkedin: /linkedin\.com/i.test(resume),
          github: /github\.com/i.test(resume),
          website: /https?:\/\/[^\s]+|www\.[^\s]+/.test(resume) && !/linkedin\.com|github\.com/i.test(resume),
        };
        if (contactChecks.email) contactScore += 20;
        if (contactChecks.phone) contactScore += 20;
        if (contactChecks.linkedin) contactScore += 20;
        if (contactChecks.github) contactScore += 20;
        if (contactChecks.website) contactScore += 20;

        const finalScore = Math.round(
          keywordScore * 0.35 +
          formatScore * 0.20 +
          lengthScore * 0.15 +
          impactScore * 0.15 +
          contactScore * 0.15
        );

        const subscores: SubscoreDetail[] = [
          {
            id: "keywords",
            label: "Keyword Match",
            weight: 35,
            score: keywordScore,
            diagnosis: `Matched ${matchedSkills.length} out of ${jdSkills.length} target role terms.`,
            hurtPoints: missingSkills.length > 0 ? [`Missing keywords: ${missingSkills.slice(0, 3).join(", ")}.`] : [],
            wins: missingSkills.length > 0 
              ? [`Incorporate missing keywords (e.g., ${missingSkills.slice(0, 2).join(", ")}) into your skills block.`]
              : [`Perfect capability keyword overlap. Perfect!`]
          },
          {
            id: "format",
            label: "Format & Structure",
            weight: 20,
            score: formatScore,
            diagnosis: `Identified ${foundHeaders.length} of 5 standard sections. ${hasTables ? "Found formatting tables." : "Clean layout syntax."}`,
            hurtPoints: [
              ...missingHeaders.map((h) => `Missing clear section header: ${h}.`),
              ...(hasTables ? ["Tables or columns detected. Automated screening systems often struggle with multi-column tables."] : [])
            ],
            wins: [
              ...missingHeaders.map((h) => `Add a clear bold heading named "${h}".`),
              ...(hasTables ? ["Use single-column text instead of grids/tables."] : [])
            ]
          },
          {
            id: "length",
            label: "Word Count Sweetspot",
            weight: 15,
            score: lengthScore,
            diagnosis: `Resume is ${wordCount} words. Standard target is 400-800 words.`,
            hurtPoints: wordCount < 400 
              ? ["Brief profile. Add context about school/work projects to hit at least 400 words."]
              : wordCount > 800
                ? ["Exceeds standard density. Shorten or trim old bullet points to stay under 800 words."]
                : [],
            wins: wordCount < 400 
              ? ["Expand bullets by detailing exact technical roles."]
              : wordCount > 800
                ? ["Remove outdated summaries or secondary highlights."]
                : ["Sweetspot achieved."]
          },
          {
            id: "impact",
            label: "Recruiter Tones",
            weight: 15,
            score: impactScore,
            diagnosis: `Detected ${verbCount} action verbs (recommend at least 3 per 100 words).`,
            hurtPoints: impactScore < 60 ? ["Resume uses passive or administrative verbs (e.g. 'Responsible for')."] : [],
            wins: impactScore < 100 
              ? ["Begin bullet points with active verbs (e.g. 'Built', 'Scaled', 'Optimized')."] 
              : ["Excellent verb variety."]
          },
          {
            id: "contact",
            label: "Contact Integrity",
            weight: 15,
            score: contactScore,
            diagnosis: `Found ${Object.values(contactChecks).filter(Boolean).length} of 5 vital profile links.`,
            hurtPoints: [
              ...(!contactChecks.email ? ["Missing email."] : []),
              ...(!contactChecks.phone ? ["Missing phone number."] : []),
              ...(!contactChecks.linkedin ? ["Missing LinkedIn profile link."] : []),
              ...(!contactChecks.github ? ["Missing GitHub repository Link."] : []),
              ...(!contactChecks.website ? ["Missing portfolio website link."] : [])
            ],
            wins: [
              ...(!contactChecks.email ? ["Add your email address."] : []),
              ...(!contactChecks.phone ? ["Provide a phone number."] : []),
              ...(!contactChecks.linkedin ? ["Link your active LinkedIn profile."] : []),
              ...(!contactChecks.github ? ["Showcase your code by listing your GitHub URL."] : []),
              ...(!contactChecks.website ? ["List your online portfolio website."] : [])
            ]
          }
        ];

        const sorted = [...subscores].sort((a, b) => a.score - b.score);
        const quickWins = sorted.slice(0, 3).flatMap((s) => s.wins).slice(0, 3);

        const parsedAts = {
          finalScore,
          subscores,
          quickWins,
          missingSkills,
          wordCount
        };

        setAtsResult(parsedAts);
        saveAtsResultToSupabase(parsedAts);
      } catch (err) {
        console.error("ATS calculation failed", err);
        setAtsError("Readiness scan failed. Check console or try again.");
      } finally {
        setAtsLoading(false);
      }
    }, 700);
  };

  // 2. RUN JOB DESCRIPTION MATCH
  const runJobMatch = () => {
    if (!resume || !jd) return;
    if (!checkDemoDataProceed()) return;
    setJobMatchLoading(true);
    setJobMatchError(null);

    setTimeout(() => {
      try {
        const resumeParsed = parseSkills(resume, "resume");
        const jdParsed = parseSkills(jd, "jd");

        const jdByCanonical = new Map(jdParsed.skills.map((s) => [s.canonical, s]));
        const jdCanonicals = jdParsed.skills.map((s) => s.canonical);
        const resumeCanonicals = new Set(resumeParsed.skills.map((s) => s.canonical));

        const matched = jdParsed.skills.filter((s) => resumeCanonicals.has(s.canonical));
        const missing = jdParsed.skills.filter((s) => !resumeCanonicals.has(s.canonical));
        const supplementary = resumeParsed.skills.filter((s) => !jdByCanonical.has(s.canonical));

        const score = jdCanonicals.length ? Math.round((matched.length / jdCanonicals.length) * 100) : 0;

        const parsedMatch = {
          score,
          matched,
          missing,
          supplementary,
        };

        setJobMatchResult(parsedMatch);
        saveJobMatchResultToSupabase(parsedMatch);
      } catch (err) {
        console.error("Job Match calculation failed", err);
        setJobMatchError("Job match calculation failed. Check console.");
      } finally {
        setJobMatchLoading(false);
      }
    }, 700);
  };

  // 3. GENERATE STUDY ROADMAP
  const runGenerateRoadmap = async () => {
    if (!resume || !jd || !targetDate) return;
    if (!checkDemoDataProceed()) return;
    setRoadmapLoading(true);
    setRoadmapError(null);
    setRoadmapDebugRaw(null);

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jd, date: targetDate, focus }),
      });

      const data = await res.json();
      if (!res.ok) {
        setRoadmapError(data.error || "Couldn't generate study roadmap. Please try again.");
        setRoadmapDebugRaw(data.raw || JSON.stringify(data));
        return;
      }

      setRoadmapResult(data.result);
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
    } catch (err: unknown) {
      setRoadmapError("Failed to fetch roadmap service.");
      const errMsg = err instanceof Error ? err.message : String(err);
      setRoadmapDebugRaw(errMsg);
    } finally {
      setRoadmapLoading(false);
    }
  };

  // Calculate Overall Snapshot metrics
  const overallReadyScore = useMemo(() => {
    if (atsResult && jobMatchResult) {
      return Math.round((atsResult.finalScore + jobMatchResult.score) / 2);
    }
    if (atsResult) return atsResult.finalScore;
    if (jobMatchResult) return jobMatchResult.score;
    return 0;
  }, [atsResult, jobMatchResult]);

  const courseBridges = useMemo(() => {
    if (!jobMatchResult || jobMatchResult.missing.length === 0) return [];
    return COURSERA_COURSES.filter((c) =>
      c.skills.some((s) => jobMatchResult.missing.some((m) => m.canonical === s))
    );
  }, [jobMatchResult]);

  // Markdown copy utility
  const handleCopyMarkdown = () => {
    if (!roadmapResult) return;

    let md = `# Career Development Roadmap (Target Ready Date: ${targetDate})\n\n`;
    md += `## Recruiter Callback Assessment\n`;
    md += `${roadmapResult.why_no_reply.summary}\n\n`;

    md += `### Identified Competency Gaps:\n`;
    roadmapResult.why_no_reply.top_gaps.forEach((g) => {
      md += `* **[${g.severity.toUpperCase()}] ${g.gap}**: ${g.explanation}\n`;
    });
    md += `\n`;

    md += `## Time-Bound Study Plan (${weeksAvailable} Weeks Total)\n\n`;
    roadmapResult.roadmap.forEach((phase) => {
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
    roadmapResult.success_metrics.forEach((m, idx) => {
      md += `${idx + 1}. ${m}\n`;
    });
    md += `\n`;
    md += `> ⚠️ **Recruiter Warning**: ${roadmapResult.honest_warning}\n`;

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "learn": return <BookOpen className="w-4 h-4 text-accent-secondary" />;
      case "build": return <Code className="w-4 h-4 text-[#AFD275]" />;
      case "apply": return <Briefcase className="w-4 h-4 text-[#E7717D]" />;
      case "fix": return <Wrench className="w-4 h-4 text-warning animate-pulse" />;
      default: return <Wrench className="w-4 h-4 text-text-muted" />;
    }
  };

  const hasInputs = !!(resume.trim() && jd.trim());

  return (
    <div className="space-y-8 animate-fade-in relative z-10 font-sans text-left">
      <PageHeader
        title="Career Analyser"
        description="Your all-in-one job-readiness workspace. Paste your resume and a job description once — then run resume readiness checks, skill gap analysis, and generate a personalised study plan."
      />

      {/* Beginner hint banner */}
      <div className="flex items-start gap-3 rounded-xl border border-accent-primary/20 bg-accent-primary/[0.03] px-4 py-3">
        <Info className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
        <p className="text-xs text-text-secondary leading-relaxed">
          <span className="font-semibold text-text-primary">New here?</span> Start by pasting your resume and the job description below. Then use the three tools — Readiness Scan, Job Match, and Roadmap — in order for the best experience.
        </p>
      </div>

      {/* Workspace Loaded Helper alert */}
      {hasInputs && (
        <div className="flex justify-start animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-strong)] bg-[var(--surface-soft)] text-xs text-text-secondary font-mono">
            <span>✓ Resume & JD loaded — ready to analyse</span>
          </div>
        </div>
      )}

      {/* --- Unified Shared Input Panel --- */}
      <Card className="premium-card">
        <CardHeader
          title="Your Resume & Job Description"
          description="Paste your details here once. Every analysis tool below will use these inputs automatically — no re-typing needed."
          className="border-b border-[var(--border-muted)] pb-3 px-6 pt-5"
        />
        {isDemoData && (
          <div className="mx-6 mt-4 p-3 bg-warning/[0.04] border border-warning/30 rounded-xl flex items-start gap-2 text-xs text-warning font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Demo data loaded</span> — replace with your real resume and target JD to save and get a personalized analysis.
            </div>
          </div>
        )}
        <CardBody className="py-5 px-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resume Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="resume-textarea" className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                  Your Resume
                </label>
                <Tooltip content="Copy your resume as plain text (Ctrl+A, Ctrl+C from a text editor or Google Docs). Avoid uploading a PDF — paste the text directly.">
                  <Info className="w-3 h-3 text-text-muted cursor-help" />
                </Tooltip>
              </div>
              <textarea
                id="resume-textarea"
                value={resume}
                onChange={(e) => {
                  setResume(e.target.value);
                  setIsDemoData(false);
                }}
                placeholder="Paste the plain text of your resume here..."
                className="w-full h-48 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/40 p-4 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 resize-y transition-all"
              />
              <p className="text-[10px] text-text-muted">
                💡 Tip: Use <span className="font-semibold">Load demo sample</span> below to see how a real resume looks.
              </p>
            </div>

            {/* JD Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="jd-textarea" className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                  Job Description
                </label>
                <Tooltip content="A Job Description (JD) is the posting from the company listing skills, responsibilities, and requirements. Copy it from LinkedIn, Naukri, or any job board.">
                  <Info className="w-3 h-3 text-text-muted cursor-help" />
                </Tooltip>
              </div>
              <textarea
                id="jd-textarea"
                value={jd}
                onChange={(e) => {
                  setJd(e.target.value);
                  setIsDemoData(false);
                }}
                placeholder="Paste the job posting here — copy from LinkedIn, Naukri, or any job site..."
                className="w-full h-48 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/40 p-4 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 resize-y transition-all"
              />
              <p className="text-[10px] text-text-muted">
                💡 Tip: Include the full posting — skills, responsibilities, and qualifications.
              </p>
            </div>
          </div>

          {/* Roadmap dates preferences inside the panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[var(--border-muted)] pt-5">
            {/* Target Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="target-date" className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                  Target Ready Date
                </label>
                <Tooltip content="The date you want to be job-ready. This is used only for the Roadmap tool to calculate how many weeks you have to prepare.">
                  <Info className="w-3 h-3 text-text-muted cursor-help" />
                </Tooltip>
              </div>
              <div className="relative">
                <input
                  id="target-date"
                  type="date"
                  min={todayStr}
                  value={targetDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/40 p-3 pl-10 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 cursor-pointer"
                />
                <Calendar className="w-3.5 h-3.5 text-text-muted absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
              {targetDate ? (
                <p className="text-[10px] text-text-muted font-mono">
                  You have <span className="font-semibold text-accent-primary">{weeksAvailable} weeks</span> to prepare.
                </p>
              ) : (
                <p className="text-[10px] text-text-muted">Required only for generating the Study Roadmap.</p>
              )}
            </div>

            {/* Focus Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label htmlFor="focus-input" className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                  Focus Areas <span className="text-[9px] normal-case tracking-normal">(optional)</span>
                </label>
                <Tooltip content="Tell the AI what you most want to focus on in your roadmap. For example: 'I want to learn system design' or 'focus on frontend projects'.">
                  <Info className="w-3 h-3 text-text-muted cursor-help" />
                </Tooltip>
              </div>
              <input
                id="focus-input"
                type="text"
                maxLength={180}
                value={focus}
                onChange={(e) => handleFocusChange(e.target.value)}
                placeholder="e.g., system design, backend APIs, frontend projects..."
                className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/40 p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50"
              />
              <p className="text-[10px] text-text-muted">Optional — skip if you want the AI to decide.</p>
            </div>
          </div>

          {/* Privacy Notice and Deletion */}
          <div className="border-t border-[var(--border-muted)] pt-5 pb-1 space-y-3">
            <div className="flex items-start gap-2.5 text-[11px] text-text-secondary leading-relaxed bg-[var(--surface-soft)]/30 border border-[var(--border-muted)] p-3.5 rounded-xl">
              <Info className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-text-primary">🔒 Resume Privacy Notice</p>
                <p>
                  Your resume text, target job description, target date, and generated roadmap may be saved to your account so you can continue later. You can permanently delete saved analysis data anytime from this page.
                </p>
              </div>
            </div>
            {sessionId && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={handleDeleteSession}
                  disabled={isDeleting}
                  className="text-[10px] font-mono uppercase tracking-widest px-3 h-8 text-danger hover:bg-danger/[0.04] border border-danger/25"
                >
                  {isDeleting ? "Deleting Data..." : "Delete Saved Analysis Data"}
                </Button>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--border-muted)] pt-4 flex flex-wrap justify-between gap-3">
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleLoadSample} className="text-[10px] font-mono uppercase tracking-widest px-3.5 h-9">
                Load demo sample
              </Button>
              <Button variant="ghost" onClick={handleClearInputs} className="text-[10px] font-mono uppercase tracking-widest px-3 h-9 text-text-muted hover:text-danger hover:bg-danger/[0.04]">
                Clear All
              </Button>
            </div>
            {hasInputs && (
              <span className="text-[10px] text-accent-green font-mono uppercase font-bold self-center">
                ● Inputs Ready
              </span>
            )}
          </div>
        </CardBody>
      </Card>

      {/* --- Action Launchers Grid (Disabled without inputs) --- */}
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-3">Step 2 — Run Your Analyses</p>
        {!hasInputs && (
          <p className="text-xs text-text-muted mb-4">
            ⬆️ Paste your resume and job description above to unlock the tools below.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Launcher 1: ATS Compatibility */}
          <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-text-primary tracking-tight font-sans">Readiness Score</h3>
                <Tooltip content="This score estimates your resume's readiness for this job posting based on structural format, keyword matching, impact verbs, and completeness. Please note this is a heuristic estimate to help you improve, not a guarantee of passing any specific applicant tracking system.">
                  <Info className="w-3.5 h-3.5 text-text-muted cursor-help" />
                </Tooltip>
              </div>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Checks your resume&apos;s structure, keyword density, action verbs, and contact details for recruiter software compatibility.
              </p>
              <p className="text-[10px] text-text-muted mt-2">⏱ Instant — no AI needed.</p>
            </div>
            <div className="pt-4 border-t border-[var(--border-muted)] mt-4">
              <Button
                onClick={runATSScan}
                disabled={!hasInputs || atsLoading}
                className="w-full h-9 text-[10px] font-mono uppercase tracking-widest text-[#FAF8F6] bg-accent-primary cursor-pointer"
              >
                {atsLoading ? "Scanning..." : "Scan Readiness Score"}
              </Button>
            </div>
          </div>

          {/* Launcher 2: Job Match */}
          <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#AFD275]/10 border border-[#AFD275]/20 flex items-center justify-center text-[#AFD275] mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-text-primary tracking-tight font-sans">Skill Gap Check</h3>
                <Tooltip content="Compares the skills listed in your resume against what the job requires. Shows what you already have, what's missing, and suggests free courses to close the gap.">
                  <Info className="w-3.5 h-3.5 text-text-muted cursor-help" />
                </Tooltip>
              </div>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                Finds exactly which skills the job wants that your resume doesn&apos;t mention — and recommends Coursera courses to fill those gaps.
              </p>
              <p className="text-[10px] text-text-muted mt-2">⏱ Instant — no AI needed.</p>
            </div>
            <div className="pt-4 border-t border-[var(--border-muted)] mt-4">
              <Button
                onClick={runJobMatch}
                disabled={!hasInputs || jobMatchLoading}
                className="w-full h-9 text-[10px] font-mono uppercase tracking-widest text-[#FAF8F6] bg-accent-primary cursor-pointer"
              >
                {jobMatchLoading ? "Comparing..." : "Check Skill Gaps"}
              </Button>
            </div>
          </div>

          {/* Launcher 3: Learning Roadmap */}
          <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#C2CAD0]/10 border border-[#C2CAD0]/20 flex items-center justify-center text-text-secondary mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-text-primary tracking-tight font-sans">Study Roadmap</h3>
                <Tooltip content="An AI-powered week-by-week study plan tailored to your skill gaps and target date. It tells you exactly what to learn, in what order, with real free resources.">
                  <Info className="w-3.5 h-3.5 text-text-muted cursor-help" />
                </Tooltip>
              </div>
              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                AI generates a personalised week-by-week learning plan with tasks, milestones, and free study resources to get you job-ready.
              </p>
              <p className="text-[10px] text-text-muted mt-2">🤖 Uses AI — takes 10–20 seconds.</p>
            </div>
            <div className="pt-4 border-t border-[var(--border-muted)] mt-4">
              {!targetDate && hasInputs && (
                <p className="text-[9px] font-mono text-warning font-semibold block mb-2">
                  ⚠️ Set a target date above first.
                </p>
              )}
              <Button
                onClick={runGenerateRoadmap}
                disabled={!hasInputs || !targetDate || roadmapLoading}
                className="w-full h-9 text-[10px] font-mono uppercase tracking-widest text-[#FAF8F6] bg-accent-primary cursor-pointer"
              >
                {roadmapLoading ? "Generating Plan..." : "Generate Study Plan"}
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* --- PROGRESSIVE RESULTS SECTION --- */}
      {(atsResult || jobMatchResult || roadmapResult || atsLoading || jobMatchLoading || roadmapLoading) && (
        <div className="space-y-8 border-t border-[var(--border-strong)] pt-8">
          
          {/* Section Indicator */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-primary animate-pulse" />
            <h2 className="text-lg font-bold tracking-tight text-text-primary">Your Results</h2>
          </div>

          {/* Skeletons/Loaders display during triggers */}
          {(atsLoading || jobMatchLoading || roadmapLoading) && (
            <div className="grid grid-cols-1 gap-4 animate-pulse">
              <div className="h-6 bg-[var(--surface-soft)] rounded w-1/4" />
              <div className="h-20 bg-[var(--surface-soft)] rounded w-full" />
            </div>
          )}

          {/* ATS Error Banner */}
          {atsError && (
            <Card className="border border-danger/30 bg-danger/[0.04]">
              <CardBody className="py-4 px-6 flex items-center gap-3 text-xs text-danger font-mono">
                <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
                <span>{atsError}</span>
              </CardBody>
            </Card>
          )}

          {/* Job Match Error Banner */}
          {jobMatchError && (
            <Card className="border border-danger/30 bg-danger/[0.04]">
              <CardBody className="py-4 px-6 flex items-center gap-3 text-xs text-danger font-mono">
                <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
                <span>{jobMatchError}</span>
              </CardBody>
            </Card>
          )}

          {/* --- Overall Score Snapshot --- */}
          {(atsResult || jobMatchResult) && (
            <Card className="border border-accent-primary/20 bg-accent-primary/[0.01] dark:bg-accent-primary/[0.03]">
              <CardBody className="py-6 px-6">
                <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider">Overall Analysis Snapshot</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 items-center">
                  
                  {/* Ready Score circular meter */}
                  <div className="text-center sm:text-left flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary shrink-0 font-mono text-2xl font-bold">
                      {overallReadyScore}%
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">Combined Readiness Score</p>
                      <p className="text-[10px] text-text-muted mt-0.5 leading-snug">Average placement weighting calculation.</p>
                    </div>
                  </div>

                  {/* Individual breakdown weights */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-mono text-text-secondary">
                      <span>Resume Structure:</span>
                      <span className="font-semibold text-text-primary">{atsResult ? `${atsResult.finalScore}%` : "Not Scanned"}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-text-secondary">
                      <span>JD Match Ratio:</span>
                      <span className="font-semibold text-text-primary">{jobMatchResult ? `${jobMatchResult.score}%` : "Not Compared"}</span>
                    </div>
                  </div>

                  {/* Contextual Prompts */}
                  <div className="text-xs bg-[var(--surface-soft)]/50 rounded-xl p-3 border border-[var(--border-muted)]">
                    {!atsResult && (
                      <p className="text-text-secondary">💡 Scan <span className="font-semibold">Resume Readiness</span> to compute your full structure score.</p>
                    )}
                    {!jobMatchResult && (
                      <p className="text-text-secondary">💡 Compare <span className="font-semibold">Job Match Gaps</span> to isolate specific requirement holes.</p>
                    )}
                    {atsResult && jobMatchResult && (
                      <p className="text-accent-green font-semibold">✓ Completed dual matching analyses. Generate a weekly roadmap next!</p>
                    )}
                  </div>

                </div>
              </CardBody>
            </Card>
          )}

          {/* --- ATS Analysis Section --- */}
          {atsResult && (
            <Card className="premium-card">
              <CardHeader
                title="Resume Readiness Breakdown"
                description={`Your resume was scanned across 5 essential structural factors. Total word count: ${atsResult.wordCount} words. Higher scores suggest better formatting and structural clarity for modern screening systems.`}
                className="border-b border-[var(--border-muted)] pb-3 px-6 pt-5"
              />
              <CardBody className="py-5 px-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {atsResult.subscores.map((sub) => (
                    <div key={sub.id} className="bg-[var(--surface-soft)]/40 border border-[var(--border-muted)] rounded-xl p-3 text-center">
                      <span className="block text-[8px] font-mono text-text-muted uppercase tracking-wider">{sub.label}</span>
                      <span className="block text-lg font-bold mt-1.5 text-text-primary font-mono">{sub.score}%</span>
                      <span className="block text-[8px] font-mono text-text-muted mt-1">Weight: {sub.weight}%</span>
                    </div>
                  ))}
                </div>

                {/* Subscore diagnoses detailed lists */}
                <div className="space-y-3 border-t border-[var(--border-muted)] pt-5">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">Structural Check Details</span>
                  <div className="space-y-3">
                    {atsResult.subscores.map((sub) => {
                      const hasHurt = sub.hurtPoints.length > 0;
                      return (
                        <div key={sub.id} className="text-xs flex gap-3 items-start border-b border-[var(--border-muted)]/30 pb-2">
                          {hasHurt ? (
                            <AlertTriangle className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                          ) : (
                            <Check className="w-4 h-4 text-accent-green shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <p className="font-bold text-text-primary">{sub.label} — <span className="font-normal text-text-secondary">{sub.diagnosis}</span></p>
                            {hasHurt && (
                              <ul className="list-disc pl-4 text-text-muted/80 text-[11px] leading-relaxed">
                                {sub.hurtPoints.map((hurt, i) => <li key={i}>{hurt}</li>)}
                              </ul>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Wins Banner */}
                {atsResult.quickWins.length > 0 && (
                  <div className="bg-accent-primary/[0.03] border border-accent-primary/20 rounded-xl p-4 space-y-2">
                    <span className="block text-[9px] font-mono text-accent-primary font-bold uppercase tracking-wider">Targeted Quick Wins</span>
                    <ul className="list-decimal pl-4 text-xs text-text-secondary leading-relaxed space-y-1">
                      {atsResult.quickWins.map((win, i) => <li key={i}>{win}</li>)}
                    </ul>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* --- Job Match Details Section --- */}
          {jobMatchResult && (
            <>
            <div className="flex items-center gap-2">
              <p className="text-xs text-text-muted leading-relaxed">
                <span className="font-semibold text-text-primary">Skill Gap Results:</span> Green = skills you already have ✅. Orange = skills the job wants but you&apos;re missing ⚠️. Blue = extra skills on your resume not mentioned in the job.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Matched Signals */}
              <Card className="premium-card">
                <CardBody className="py-5 px-6 flex flex-col justify-between h-full">
                  <p className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold text-accent-green">
                    <Check className="w-4 h-4 text-accent-green shrink-0" />
                    <span>Skills You Have ({jobMatchResult.matched.length})</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4 flex-1 items-start content-start">
                    {jobMatchResult.matched.length === 0 ? (
                      <span className="text-xs text-text-muted font-mono uppercase">None</span>
                    ) : (
                      jobMatchResult.matched.map((s) => (
                        <span key={s.canonical} className="inline-flex items-center text-xs px-2.5 py-1 rounded border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 font-mono text-[10px] text-text-secondary uppercase">
                          {s.canonical}
                          {s.level !== "unspecified" && (
                            <span className="text-[7px] text-accent-green font-bold ml-1 uppercase">{s.level}</span>
                          )}
                        </span>
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Requirement Gaps */}
              <Card className="premium-card">
                <CardBody className="py-5 px-6 flex flex-col justify-between h-full">
                  <p className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold text-accent-primary">
                    <AlertTriangle className="w-4 h-4 text-accent-primary shrink-0" />
                    <span>Missing Skills ({jobMatchResult.missing.length})</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4 flex-1 items-start content-start">
                    {jobMatchResult.missing.length === 0 ? (
                      <span className="text-xs text-accent-green font-mono uppercase">All Targets Met!</span>
                    ) : (
                      jobMatchResult.missing.map((s) => (
                        <span key={s.canonical} className="inline-flex items-center text-xs px-2.5 py-1 rounded border border-accent-primary/20 bg-accent-primary/[0.04] font-mono text-[10px] text-accent-primary uppercase">
                          {s.canonical}
                          {s.level !== "unspecified" && (
                            <span className="text-[7px] font-bold ml-1 uppercase">{s.level}</span>
                          )}
                        </span>
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Mapped Core Signals */}
              <Card className="premium-card">
                <CardBody className="py-5 px-6 flex flex-col justify-between h-full">
                  <p className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold text-text-secondary">
                    <Info className="w-4 h-4 text-text-muted shrink-0" />
                    <span>Bonus Skills ({jobMatchResult.supplementary.length})</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4 flex-1 items-start content-start">
                    {jobMatchResult.supplementary.length === 0 ? (
                      <span className="text-xs text-text-muted font-mono uppercase">None</span>
                    ) : (
                      jobMatchResult.supplementary.map((s) => (
                        <span key={s.canonical} className="inline-flex items-center text-xs px-2.5 py-1 rounded border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 font-mono text-[10px] text-text-secondary uppercase">
                          {s.canonical}
                        </span>
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Recommended Course Bridges */}
              {jobMatchResult.missing.length > 0 && (
                <Card className="lg:col-span-3 premium-card">
                  <CardHeader
                    title="Recommended Course Bridges"
                    description="Coursera pathways targeted directly at closing your identified requirement gaps."
                    className="border-b border-[var(--border-muted)] pb-3 px-6 pt-5"
                  />
                  <CardBody className="pt-5 px-6 space-y-3">
                    {courseBridges.length === 0 ? (
                      <div className="text-center py-6 text-text-secondary">
                        <Info className="w-5 h-5 text-text-muted mx-auto mb-2" />
                        <p className="text-xs font-mono">No direct course bridges found for these specific tags.</p>
                      </div>
                    ) : (
                      courseBridges.map((course) => (
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

            </div>
            </>
          )}

          {/* --- Learning Roadmap Section --- */}
          {roadmapError && (
            <Card className="border border-danger/30 bg-danger/[0.04]">
              <CardBody className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-danger">{roadmapError}</p>
                    {roadmapDebugRaw && (
                      <details className="mt-2 text-xs text-text-secondary cursor-pointer">
                        <summary className="font-semibold select-none hover:text-text-primary">View debug log details</summary>
                        <pre className="mt-2 p-3 bg-[var(--surface-soft)] border border-[var(--border-muted)] rounded-lg font-mono text-[10px] text-text-muted whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {roadmapDebugRaw}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {roadmapResult && (
            <div className="space-y-6">
              
              {/* Back / Reset actions bar */}
              <div className="flex justify-between items-center bg-[var(--surface-soft)]/40 p-4 rounded-xl border border-[var(--border-muted)]">
                <span className="text-xs text-text-secondary font-mono">Target Date: {targetDate} · Total Weeks: {weeksAvailable}</span>
                <button
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors cursor-pointer border border-[var(--border-muted)] rounded-md px-3 py-1.5 bg-[var(--surface-card)] hover:bg-[var(--surface-soft)]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-accent-green" />
                      <span>Copied ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Roadmap Markdown</span>
                    </>
                  )}
                </button>
              </div>

              {/* Recruiter Assessment Callout */}
              <Card className="border border-warning/45 bg-warning/[0.02]">
                <CardBody className="pt-6 space-y-4">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-warning font-semibold">
                    Recruiter callback assessment
                  </span>
                  <p className="text-sm font-medium text-text-primary leading-relaxed">
                    {roadmapResult.why_no_reply.summary}
                  </p>

                  {/* Roadmap Competency Gaps */}
                  <div className="space-y-2 pt-2 border-t border-warning/10">
                    <span className="block text-[9px] font-mono uppercase tracking-widest text-text-muted">
                      Roadmap gap radar
                    </span>
                    <div className="flex flex-col gap-2.5">
                      {roadmapResult.why_no_reply.top_gaps.map((g, idx) => {
                        const badgeColor = 
                          g.severity === "critical" 
                            ? "border-danger/30 text-danger bg-danger/[0.02]" 
                            : g.severity === "moderate"
                              ? "border-warning/30 text-warning bg-warning/[0.02]"
                              : "border-[var(--border-muted)] text-text-secondary bg-transparent";
                        return (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 text-xs">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border shrink-0 ${badgeColor}`}>
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
                  Time-Bound Plan Details
                </span>

                <div className="relative pl-4 sm:pl-6 border-l border-[var(--border-muted)] ml-3 space-y-6">
                  {roadmapResult.roadmap.map((phase, pIdx) => {
                    const milestoneId = `milestone_${pIdx}_${phase.week_range.replace(/\s+/g, "")}`;
                    const isMilestoneChecked = !!milestones[milestoneId];

                    return (
                      <div key={pIdx} className="relative">
                        {/* timeline connector node */}
                        <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 w-4 h-4 rounded-full border-2 border-[var(--accent-primary)] bg-[var(--background)] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                        </div>

                        <Card>
                          <CardBody className="pt-6 space-y-4">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="inline-block rounded-md bg-[var(--surface-soft)] font-mono text-[10px] font-semibold border border-[var(--border-muted)] px-2.5 py-1 text-text-primary">
                                {phase.week_range}
                              </span>
                              <h3 className="text-sm font-bold text-text-primary font-mono uppercase">
                                {phase.theme}
                              </h3>
                            </div>

                            <div className="bg-[var(--surface-soft)]/50 p-3 rounded-lg border border-[var(--border-muted)] text-xs text-text-secondary leading-relaxed">
                              <span className="font-bold text-[9px] font-mono uppercase text-text-muted block mb-1">Weekly target outcome:</span>
                              {phase.goal}
                            </div>

                            {/* Action Items list */}
                            <div className="space-y-3 pt-2">
                              <span className="block text-[9px] font-mono uppercase tracking-widest text-text-muted">
                                Tasks checklist
                              </span>
                              <div className="space-y-2.5">
                                {phase.tasks.map((t, tIdx) => (
                                  <div key={tIdx} className="flex items-start gap-3 text-xs leading-relaxed">
                                    <div className="mt-0.5 shrink-0">
                                      {getTaskIcon(t.type)}
                                    </div>
                                    <div className="flex-1">
                                      <span className="font-semibold text-text-primary capitalize font-mono text-[9px] mr-1.5">
                                        [{t.type}]
                                      </span>
                                      <span className="text-text-primary font-mono text-xs">{t.task}</span>
                                      
                                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[9px] text-text-muted">
                                        <span className="font-mono">Time: {t.time_estimate}</span>
                                        {t.resource && (
                                          <a
                                            href={t.resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-[var(--accent-secondary)]/[0.08] hover:bg-[var(--accent-secondary)]/[0.16] text-[var(--accent-primary)] hover:text-text-primary font-mono transition-colors border border-[var(--accent-primary)]/10"
                                          >
                                            Study: {t.resource.name} ({t.resource.platform})
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Milestoning checklist row */}
                            <div 
                              onClick={() => toggleMilestone(milestoneId)}
                              className={`mt-4 pt-3 border-t border-[var(--border-muted)] flex items-center gap-2.5 cursor-pointer select-none transition-colors ${
                                isMilestoneChecked ? "text-accent-green" : "text-text-secondary hover:text-text-primary"
                              }`}
                            >
                              <div className="shrink-0">
                                {isMilestoneChecked ? (
                                  <CheckSquare className="w-4 h-4 text-accent-green" />
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

              {/* Success metrics catalog */}
              <Card>
                <CardBody className="pt-6 space-y-4">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                    Roadmap Metrics for Success
                  </span>
                  <ol className="list-decimal pl-4 space-y-2 text-xs text-text-secondary leading-relaxed">
                    {roadmapResult.success_metrics.map((metric, idx) => (
                      <li key={idx}>{metric}</li>
                    ))}
                  </ol>
                </CardBody>
              </Card>

              {/* Honest Recruiter Disclaimer */}
              <Card className="border border-danger/25 bg-danger/[0.02]">
                <CardBody className="pt-6 space-y-2.5">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-danger font-semibold">
                    ⚠️ Recruiter Reality Disclaimer
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed font-mono">
                    {roadmapResult.honest_warning}
                  </p>
                </CardBody>
              </Card>

            </div>
          )}

        </div>
      )}

      {/* --- CONTEXTUAL NEXT STEP CTAS --- */}
      <div className="border-t border-[var(--border-strong)] pt-8">
        <span className="eyebrow block text-[10px] tracking-widest text-text-muted font-mono uppercase mb-1">
          More Tools
        </span>
        <p className="text-xs text-text-muted mb-4">Other tools that work alongside your analysis results.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Resume Builder (shown if ATS score is low or absent) */}
          <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest block">Fix structural scores</span>
              <h4 className="text-sm font-bold text-text-primary tracking-tight font-mono mt-1">Resume Builder</h4>
              <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                Improve your bullets or structure using active recruiting verbs.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border-muted)] mt-4">
              <button
                onClick={() => router.push("/resume-builder")}
                className="text-[10px] font-mono font-bold text-accent-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                Open Builder <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Interview Packs (shown if gaps exist) */}
          <div className="border border-[var(--border-muted)] bg-[var(--surface-card)] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest block">Prepare for targets</span>
              <h4 className="text-sm font-bold text-text-primary tracking-tight font-mono mt-1">Interview Prep Packs</h4>
              <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                Practice 900+ target questions categorized by role track families.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border-muted)] mt-4">
              <button
                onClick={() => router.push("/interview-packs")}
                className="text-[10px] font-mono font-bold text-accent-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                Open Packs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Why No Reply (always visible as key emotional callback) */}
          <div className="border border-warning/20 bg-warning/[0.01] rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[8px] font-mono text-warning uppercase tracking-widest block">Application callback check</span>
              <h4 className="text-sm font-bold text-text-primary tracking-tight font-mono mt-1">Why No Reply Diagnosis</h4>
              <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">
                Find out why you aren&apos;t getting calls. Isolate call rates.
              </p>
            </div>
            <div className="pt-3 border-t border-warning/10 mt-4">
              <button
                onClick={() => router.push("/why-no-reply")}
                className="text-[10px] font-mono font-bold text-warning hover:underline flex items-center gap-1 cursor-pointer"
              >
                Start Recruiter Scan <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
