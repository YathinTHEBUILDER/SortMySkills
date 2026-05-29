"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Briefcase,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Globe,
  Upload,
  Activity,
  FileText,
  Award,
} from "lucide-react";
import Logo from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import MarketingHeader from "@/components/landing/MarketingHeader";
import type { User } from "@supabase/supabase-js";

interface LandingClientProps {
  user: User | null;
}

// ── Particle connection background canvas ──
function FlowingConnectionsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      label: string;
      color: string;
    }

    const labels = [
      "React", "Node.js", "Docker", "AWS", "Git", "Figma", 
      "TypeScript", "System Design", "CI/CD", "Postgres", "MongoDB",
      "Readiness", "ATS Match", "Gaps", "Coursera", "Roadmap"
    ];

    const colors = ["rgba(238, 133, 144, 0.4)", "rgba(197, 235, 142, 0.4)", "rgba(213, 220, 226, 0.4)"];

    const particles: Particle[] = Array.from({ length: 28 }, () => {
      const radius = Math.random() * 2 + 1;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius,
        label: Math.random() > 0.45 ? labels[Math.floor(Math.random() * labels.length)] : "",
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw grid intersections lightly
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.15;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        if (p.label) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.font = "8.5px ui-monospace, monospace";
          ctx.fillText(p.label.toUpperCase(), p.x + 8, p.y + 3);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" />;
}

// ── Intersection observer for scroll reveal ──
function useScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px -40px 0px -40px",
      threshold: 0.08,
    };

    const revealCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

export default function LandingClient({ user }: LandingClientProps) {
  useScrollReveal();

  // Interactive Work flow state
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // Auto transition workflow steps periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 7);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Demo simulator interactive states
  const [demoStep, setDemoStep] = useState<"upload" | "analyze" | "roadmap">("upload");
  const [demoLoading, setDemoLoading] = useState(false);

  const triggerDemoScan = () => {
    setDemoLoading(true);
    setTimeout(() => {
      setDemoLoading(false);
      setDemoStep("analyze");
    }, 1200);
  };

  const triggerDemoRoadmap = () => {
    setDemoLoading(true);
    setTimeout(() => {
      setDemoLoading(false);
      setDemoStep("roadmap");
    }, 1000);
  };

  // Signal pills marquee elements
  const signals = [
    "Built for students",
    "Resume to roadmap",
    "Role-fit scoring",
    "900+ questions mapped",
    "Skill parser",
    "Job-match engine",
  ];

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden relative font-sans text-neutral-200 bg-[#080807] selection:bg-rose-500/20 selection:text-rose-200"
      style={{
        "--background": "#080807",
        "--background-soft": "#0E0E0C",
        "--foreground": "#FAF8F6",
        "--surface-card": "#131310",
        "--surface-card-warm": "#191915",
        "--surface-soft": "#11110E",
        "--surface-muted": "#2C2C26",
        "--surface-hover": "#22221A",
        "--text-secondary": "#B8ADA3",
        "--text-muted": "#7A7067",
        "--border-muted": "rgba(255, 255, 255, 0.05)",
        "--border-strong": "rgba(255, 255, 255, 0.12)",
        "--dot-grid": "rgba(255, 255, 255, 0.02)",
        "--grid-line": "rgba(255, 255, 255, 0.008)",
        "--accent-primary": "#EE8590",
        "--accent-primary-dark": "#E7717D",
        "--accent-secondary": "#C5EB8E",
        "--accent-tertiary": "#D5DCE2",
        "--accent-ink": "#080807",
        "--success": "#C5EB8E",
        "--warning": "#F5BE6D",
        "--danger": "#EE8590",
      } as React.CSSProperties}
    >
      {/* Stripe-style ambient glow meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#EE8590]/[0.02] filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[300px] right-1/4 w-[600px] h-[600px] rounded-full bg-[#C5EB8E]/[0.015] filter blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[400px] left-10 w-[550px] h-[550px] rounded-full bg-[#EE8590]/[0.012] filter blur-[120px] pointer-events-none z-0" />

      {/* Pure CSS Noise Overlay */}
      <div className="warm-noise-bg::before fixed inset-0 opacity-[0.012] pointer-events-none z-50 pointer-events-none" />

      {/* Navbar header */}
      <MarketingHeader user={user} />

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-20 pb-28 lg:pt-28 lg:pb-36 grid lg:grid-cols-12 gap-12 items-center">
        {/* Animated connection canvas */}
        <FlowingConnectionsCanvas />

        {/* Left Info Column */}
        <div className="lg:col-span-7 flex flex-col text-left relative z-10">
          <div className="inline-flex items-center gap-2 mb-5 rounded-full border border-white/5 bg-white/[0.02] px-3.5 py-1.5 w-fit">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#EE8590] font-bold">
              CAREER OPERATING SYSTEM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5EB8E] animate-pulse" />
          </div>

          <h1 className="hero-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-white">
            Know Your Skills.<br />
            Close Your Gaps.<br />
            <span className="text-[#EE8590] font-serif italic font-normal">Get Job Ready.</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl font-sans normal-case">
            SortMySkills analyzes resumes, compares them against job descriptions, identifies missing skills, recommends learning paths, and helps students prepare using 600 curated interview questions.
          </p>

          <div className="mt-9 flex flex-wrap gap-4 items-center">
            {user ? (
              <ButtonLink
                href="/dashboard"
                className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#080807] bg-[#EE8590] hover:bg-[#EE8590]/90 transition-all rounded-full font-bold shadow-md flex items-center gap-1.5"
              >
                <span>Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </ButtonLink>
            ) : (
              <>
                <ButtonLink
                  href="/signup"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#080807] bg-[#EE8590] hover:bg-[#EE8590]/90 transition-all rounded-full font-bold shadow-md flex items-center gap-1.5"
                >
                  <span>Try Resume Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </ButtonLink>
                <ButtonLink
                  href="/login"
                  variant="secondary"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest border border-white/10 text-white rounded-full bg-white/[0.01] hover:bg-white/[0.05] transition-all"
                >
                  Explore Career Roadmaps
                </ButtonLink>
              </>
            )}
          </div>
        </div>

        {/* Right Glassmorphic Dashboard Mockup Column */}
        <div className="lg:col-span-5 relative w-full flex justify-center z-10">
          <div className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-[#131310]/75 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-size-[20px] bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EE8590]" />
                <span className="w-2 h-2 rounded-full bg-[#C5EB8E]" />
                <span className="w-2 h-2 rounded-full bg-neutral-600" />
              </div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                career_readiness_snapshot
              </span>
            </div>

            {/* Scores and dials */}
            <div className="relative z-10 space-y-5">
              {/* Score panel */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left">
                  <span className="block font-mono text-[8px] text-neutral-400 uppercase tracking-wider">
                    Readiness Score
                  </span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <p className="text-3xl font-bold text-[#C5EB8E] font-mono">72%</p>
                    <span className="text-[10px] text-neutral-500">quotient</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#C5EB8E] h-full rounded-full" style={{ width: "72%" }} />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left">
                  <span className="block font-mono text-[8px] text-neutral-400 uppercase tracking-wider">
                    Resume Match Score
                  </span>
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <p className="text-3xl font-bold text-[#EE8590] font-mono">84%</p>
                    <span className="text-[10px] text-neutral-500">weight</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#EE8590] h-full rounded-full" style={{ width: "84%" }} />
                  </div>
                </div>
              </div>

              {/* Missing skills panel */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left space-y-3">
                <span className="block font-mono text-[8px] text-neutral-400 uppercase tracking-wider">
                  Critical Competency Gaps
                </span>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {["Docker", "AWS", "System Design"].map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.04] text-[#EE8590] px-3 py-1 text-xs font-mono font-medium"
                    >
                      <AlertTriangle className="w-3 h-3 text-[#EE8590]/80" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning plan progress */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="block font-mono text-[8px] text-neutral-400 uppercase tracking-wider">
                    Learning Plan Progress
                  </span>
                  <span className="font-mono text-xs text-[#C5EB8E] font-bold">68% Complete</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#C5EB8E] h-full rounded-full transition-all duration-1000" style={{ width: "68%" }} />
                </div>
                <p className="text-[10px] text-neutral-500 mt-2 font-mono uppercase tracking-wider">
                  Target Date: 4 WEEKS REMAINING
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO/TRUST MARQUEE STRIP ── */}
      <section className="relative z-10 border-t border-b border-white/5 bg-[#0E0E0C]/40 py-5 overflow-hidden">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-start relative">
          <div className="animate-marquee whitespace-nowrap flex gap-8 py-1">
            {[...signals, ...signals].map((sig, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-xs text-neutral-400 font-semibold font-mono uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#EE8590]" />
                <span>{sig}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION: WHY STUDENTS STRUGGLE ── */}
      <section className="relative z-10 py-24 border-b border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full px-6 text-center">
          <div className="max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#EE8590] font-bold">
              THE PREPARATION GAP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Why placement preparation feels broken.
            </h2>
            <p className="text-sm text-neutral-400 mt-4 leading-relaxed">
              Early career job hunters are faced with noise, generic algorithms, and static checklists that lead directly to recruiter rejection.
            </p>
          </div>

          {/* Reveal cards on scroll */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              {
                title: "No clear learning roadmap",
                desc: "Students learn random concepts without visual direction, wasting hundreds of self-study hours on stacks employers don't request.",
                glow: "hover:shadow-[#EE8590]/5",
              },
              {
                title: "Generic online courses",
                desc: "Completing standard MOOC classes provides generalized conceptual knowledge, but fails to address the specific missing tags required by real postings.",
                glow: "hover:shadow-[#C5EB8E]/5",
              },
              {
                title: "Resume rejections",
                desc: "Corporate applicant tracking systems auto-filter profiles immediately. Without standardized skill aliases, resumes fail keyword scanning rules.",
                glow: "hover:shadow-[#EE8590]/5",
              },
              {
                title: "Interview uncertainty",
                desc: "Students enter technical rounds guessing the questions. Reviewing random mock lists fails to simulate actual placement complexity.",
                glow: "hover:shadow-[#C5EB8E]/5",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`reveal-on-scroll reveal-delay-${idx} rounded-2xl border border-white/5 bg-[#131310] p-6 hover:border-white/10 transition-all duration-300 flex flex-col justify-between min-h-[220px] ${card.glow}`}
              >
                <div className="space-y-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono text-[#EE8590] font-bold">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">{card.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION: HOW IT WORKS ── */}
      <section className="relative z-10 py-24 border-b border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left static detail */}
            <div className="lg:col-span-5 text-left space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5EB8E] font-bold">
                ENGINE PIPELINE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                From raw profile to placement ready.
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                SortMySkills passes your credentials through a multi-stage parser and compiler, matching your skills directly with employer descriptions.
              </p>
              <div className="pt-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#C5EB8E] hover:underline"
                >
                  <span>Explore the sandbox engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right active timeline workflow */}
            <div className="lg:col-span-7 space-y-3">
              {[
                "Resume Upload",
                "Skill Extraction",
                "Skill Normalization",
                "Job Description Comparison",
                "Gap Analysis",
                "Learning Roadmap",
                "Interview Preparation",
              ].map((step, idx) => {
                const isActive = activeWorkflowStep === idx;
                return (
                  <div
                    key={step}
                    onClick={() => setActiveWorkflowStep(idx)}
                    className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer select-none transition-all duration-300 ${
                      isActive
                        ? "border-[#C5EB8E]/30 bg-[#C5EB8E]/[0.02] shadow-sm shadow-[#C5EB8E]/5"
                        : "border-white/5 bg-transparent hover:bg-white/[0.01]"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono transition-colors font-bold ${
                        isActive ? "bg-[#C5EB8E] text-[#080807]" : "bg-white/5 text-neutral-500"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="text-left flex-1">
                      <p className={`text-sm font-semibold transition-colors ${isActive ? "text-white" : "text-neutral-400"}`}>
                        {step}
                      </p>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#C5EB8E] animate-ping" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: CORE FEATURES (BENTO GRID) ── */}
      <section className="relative z-10 py-24 border-b border-white/5 bg-[#0E0E0C]/20">
        <div className="max-w-6xl mx-auto w-full px-6 text-center">
          <div className="max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#EE8590] font-bold">
              CAPABILITY MATRIX
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Bento dashboard components.
            </h2>
            <p className="text-sm text-neutral-400 mt-4 leading-relaxed">
              Every card connects your local user profile directly with actual database transactions via secure Postgres Row Level Security.
            </p>
          </div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 text-left">
            {/* Card 1: Skill Extraction (Col span 3) */}
            <div className="md:col-span-3 rounded-2xl border border-white/5 bg-[#131310] p-6 hover:border-white/10 transition-all relative overflow-hidden flex flex-col justify-between min-h-[250px]">
              <div className="absolute inset-0 bg-size-[15px] bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] pointer-events-none" />
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-xl bg-[#EE8590]/10 border border-[#EE8590]/20 flex items-center justify-center text-[#EE8590] mb-5">
                  <Compass className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white">Skill Extraction</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                  Instantly parse raw block resume text into standardized canonical competency profiles. Standardize tags like `py` to `Python` automatically.
                </p>
              </div>
              <div className="relative z-10 pt-4 mt-4 border-t border-white/5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C5EB8E]/20 border border-[#C5EB8E]/40" />
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                  AUTOMATED PARSING ENGINE
                </span>
              </div>
            </div>

            {/* Card 2: Match Analysis (Col span 3) */}
            <div className="md:col-span-3 rounded-2xl border border-white/5 bg-[#131310] p-6 hover:border-white/10 transition-all relative overflow-hidden flex flex-col justify-between min-h-[250px]">
              <div className="absolute inset-0 bg-size-[15px] bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] pointer-events-none" />
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-xl bg-[#C5EB8E]/10 border border-[#C5EB8E]/20 flex items-center justify-center text-[#C5EB8E] mb-5">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white">Resume vs JD Match Analysis</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                  Dual-panel comparison sandbox. Calculate role-match scores, isolate critical gapped keywords, and view supplementary skills.
                </p>
              </div>
              <div className="relative z-10 pt-4 mt-4 border-t border-white/5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EE8590]/20 border border-[#EE8590]/40" />
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                  JD GAP EVALUATOR
                </span>
              </div>
            </div>

            {/* Card 3: Readiness tracking (Col span 2) */}
            <div className="md:col-span-2 rounded-2xl border border-white/5 bg-[#131310] p-6 hover:border-white/10 transition-all flex flex-col justify-between min-h-[240px]">
              <div>
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400 mb-5">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white">Readiness Tracking</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                  Track your preparation metrics dynamically. Readiness updates with each skill audit.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mb-1.5 uppercase">
                  <span>Progress Trend</span>
                  <span className="text-[#C5EB8E] font-bold">+18%</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#C5EB8E] h-full rounded-full" style={{ width: "68%" }} />
                </div>
              </div>
            </div>

            {/* Card 4: Learning Planner (Col span 2) */}
            <div className="md:col-span-2 rounded-2xl border border-white/5 bg-[#131310] p-6 hover:border-white/10 transition-all flex flex-col justify-between min-h-[240px]">
              <div>
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400 mb-5">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white">Coursera Learning Plan</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                  Maps identified skills gaps directly to specific study course bridges to minimize learning delays.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
                COHESIVE PLATFORM PATHWAYS
              </div>
            </div>

            {/* Card 5: Interview packs (Col span 2) */}
            <div className="md:col-span-2 rounded-2xl border border-white/5 bg-[#131310] p-6 hover:border-white/10 transition-all flex flex-col justify-between min-h-[240px]">
              <div>
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-neutral-400 mb-5">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white">600+ Interview Questions</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                  Browse curated question catalogs. Prepare for technical rounds across 6 primary role tracks.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex gap-1.5 flex-wrap">
                {["Easy", "Medium", "Hard"].map((lvl) => (
                  <span
                    key={lvl}
                    className="px-2 py-0.5 rounded border border-white/5 bg-white/[0.02] text-[8.5px] font-mono text-neutral-500 uppercase tracking-wide"
                  >
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: INTERACTIVE DEMO ── */}
      <section className="relative z-10 py-24 border-b border-white/5">
        <div className="max-w-6xl mx-auto w-full px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5EB8E] font-bold">
              LIVE SIMULATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Test drive the matching sandbox.
            </h2>
            <p className="text-sm text-neutral-400 mt-4 leading-relaxed">
              See how our algorithm parses credentials, weights missing skills, and structures roadmap milestones instantly.
            </p>
          </div>

          {/* Interactive Demo Layout */}
          <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-4xl mx-auto">
            {/* Left Controls Column */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDemoStep("upload")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  demoStep === "upload"
                    ? "border-[#EE8590]/30 bg-[#EE8590]/[0.02] text-white"
                    : "border-white/5 bg-[#131310]/40 text-neutral-400 hover:bg-[#131310]/80"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-bold text-xs font-mono uppercase tracking-wider">
                  <Upload className="w-3.5 h-3.5" />
                  <span>1. Upload Resume</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Raw credentials with React, Node.js, and MongoDB loaded.
                </p>
              </button>

              <button
                type="button"
                onClick={triggerDemoScan}
                disabled={demoLoading}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  demoStep === "analyze"
                    ? "border-[#C5EB8E]/30 bg-[#C5EB8E]/[0.02] text-white"
                    : "border-white/5 bg-[#131310]/40 text-neutral-400 hover:bg-[#131310]/80"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-bold text-xs font-mono uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" />
                  <span>2. Scan Gaps</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Compare against Frontend Engineer JD requirements.
                </p>
              </button>

              <button
                type="button"
                onClick={triggerDemoRoadmap}
                disabled={demoLoading}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  demoStep === "roadmap"
                    ? "border-[#EE8590]/30 bg-[#EE8590]/[0.02] text-white"
                    : "border-white/5 bg-[#131310]/40 text-neutral-400 hover:bg-[#131310]/80"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-bold text-xs font-mono uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>3. Generate Roadmap</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Create a structured learning plan with study bridges.
                </p>
              </button>
            </div>

            {/* Right Monitor Column */}
            <div className="lg:col-span-8">
              <div className="w-full h-full min-h-[300px] rounded-2xl border border-white/10 bg-[#131310] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-size-[15px] bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] pointer-events-none" />

                {/* Top header bar */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                    matching_sandbox_output.log
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500/60" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                    <span className="w-2 h-2 rounded-full bg-green-500/60" />
                  </div>
                </div>

                {/* Simulated Loading state */}
                {demoLoading ? (
                  <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-10 space-y-4">
                    <RefreshCw className="w-7 h-7 text-[#EE8590] animate-spin" />
                    <p className="text-xs font-mono uppercase tracking-widest text-[#EE8590] animate-pulse">
                      Analyzing stack nodes...
                    </p>
                  </div>
                ) : (
                  <div className="relative z-10 flex-1 flex flex-col justify-between text-left">
                    {/* Screen 1: Upload state */}
                    {demoStep === "upload" && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-neutral-400" />
                          <span className="font-mono text-xs text-white">john_doe_resume.pdf</span>
                        </div>
                        <div className="space-y-2 rounded-lg bg-white/[0.02] p-4 border border-white/5 text-xs font-mono leading-relaxed">
                          <p className="text-neutral-500">{"// Parsed Skills Detected:"}</p>
                          <div className="flex flex-wrap gap-2 pt-1.5">
                            {["React", "Node.js", "MongoDB"].map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 rounded-md border border-white/5 bg-[#191915] text-[#C5EB8E] text-[10px] font-mono"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Screen 2: Analyze state */}
                    {demoStep === "analyze" && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex items-center gap-3">
                            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                              <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="none" />
                                <circle
                                  cx="24"
                                  cy="24"
                                  r="20"
                                  stroke="#C5EB8E"
                                  strokeWidth="3"
                                  fill="none"
                                  strokeDasharray={2 * Math.PI * 20}
                                  strokeDashoffset={2 * Math.PI * 20 * 0.22}
                                />
                              </svg>
                              <span className="text-xs font-mono font-bold text-white">78%</span>
                            </div>
                            <div>
                              <p className="text-[10px] font-mono uppercase text-neutral-500">Role Match Rating</p>
                              <p className="text-xs text-white font-semibold mt-0.5">Frontend Engineer</p>
                            </div>
                          </div>

                          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 space-y-1">
                            <p className="text-[10px] font-mono uppercase text-neutral-500">Target Track Gaps</p>
                            <p className="text-xs text-white font-semibold">3 Missing Skills</p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-white/[0.02] p-4 border border-white/5 space-y-2">
                          <p className="text-[10px] font-mono uppercase text-neutral-500">{"// Missing Skills Extracted:"}</p>
                          <div className="flex flex-wrap gap-2">
                            {["TypeScript", "Testing", "CI/CD"].map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 rounded-md border border-red-500/20 bg-red-500/[0.02] text-[#EE8590] text-[10px] font-mono"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Screen 3: Roadmap state */}
                    {demoStep === "roadmap" && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="rounded-xl bg-[#C5EB8E]/[0.02] border border-[#C5EB8E]/20 p-4">
                          <p className="text-[10px] font-mono uppercase text-[#C5EB8E] font-bold">
                            ✓ ROADMAP GENERATED FOR TARGET GAP: TYPESCRIPT
                          </p>
                          <div className="mt-3 space-y-2 text-xs">
                            <div className="flex items-start gap-2">
                              <span className="text-[#C5EB8E] shrink-0 font-mono">Week 1:</span>
                              <span className="text-white">Learn syntax, types, and compiler config setups.</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-[#C5EB8E] shrink-0 font-mono">Week 2:</span>
                              <span className="text-white">Build project components converting Javascript to TS.</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3 border border-white/5 text-xs font-mono">
                          <span className="text-neutral-500">Study Bridge:</span>
                          <span className="text-[#EE8590] hover:underline cursor-pointer">
                            TypeScript Programming (Coursera) →
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer simulation */}
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5 mt-4 text-[10px] font-mono text-neutral-500">
                  <span>Target Role: FRONTEND_ENGINEER</span>
                  <span>STATUS: READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: WHY WE'RE DIFFERENT ── */}
      <section className="relative z-10 py-24 border-b border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full px-6 text-center">
          <div className="max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#EE8590] font-bold">
              THE PLATFORM ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Why we are different.
            </h2>
            <p className="text-sm text-neutral-400 mt-4 leading-relaxed">
              We replace standard ATS scanning checkers with a complete, structured career preparation operating system.
            </p>
          </div>

          {/* Comparison grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Traditional Tools */}
            <div className="rounded-2xl border border-white/5 bg-[#131310]/50 p-6 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-400 border-b border-white/5 pb-3 font-mono uppercase tracking-wide">
                  Traditional Tools
                </h3>
                <ul className="space-y-4 pt-4 text-xs text-neutral-400 leading-relaxed text-left">
                  <li className="flex items-start gap-3">
                    <span className="text-[#EE8590] shrink-0 font-bold">✕</span>
                    <span><strong>ATS Score Only:</strong> Shows a basic percentage without mapping missing tags.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#EE8590] shrink-0 font-bold">✕</span>
                    <span><strong>Generic Recommendations:</strong> Advises adding random words instead of structured preparation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#EE8590] shrink-0 font-bold">✕</span>
                    <span><strong>No Career Roadmap:</strong> Fails to provide week-by-week actions or platform integrations.</span>
                  </li>
                </ul>
              </div>
              <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest pt-4 border-t border-white/5 text-left">
                RESTRICTED ATS SCORE CHECKER
              </p>
            </div>

            {/* SortMySkills */}
            <div className="rounded-2xl border border-[#C5EB8E]/20 bg-[#C5EB8E]/[0.01] p-6 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#C5EB8E] border-b border-white/5 pb-3 font-mono uppercase tracking-wide">
                  SortMySkills Advantage
                </h3>
                <ul className="space-y-4 pt-4 text-xs text-neutral-200 leading-relaxed text-left">
                  <li className="flex items-start gap-3">
                    <span className="text-[#C5EB8E] shrink-0 font-bold">✓</span>
                    <span><strong>Skill Normalization:</strong> Automatically maps chaotic terms locally using custom registries.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C5EB8E] shrink-0 font-bold">✓</span>
                    <span><strong>Gap Detection & Readiness:</strong> Traces exact missing tags and computes readiness quotient metrics.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C5EB8E] shrink-0 font-bold">✓</span>
                    <span><strong>Learning Planning & Prep:</strong> Provides full time-bound study roadmaps and interview packs.</span>
                  </li>
                </ul>
              </div>
              <p className="text-[9px] font-mono text-[#C5EB8E] uppercase tracking-widest pt-4 border-t border-white/5 text-left font-bold">
                STRUCTURED PLACEMENT OPERATING SYSTEM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: WORKSPACE STATISTICS ── */}
      <section className="relative z-10 py-24 border-b border-white/5 bg-[#0E0E0C]/10">
        <div className="max-w-6xl mx-auto w-full px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { stat: "600+", label: "Interview Questions", desc: "Curated technical prep cards" },
              { stat: "6 Tracks", label: "Career Tracks", desc: "Software, UX, Data & PM roles" },
              { stat: "100%", label: "Personalized Analysis", desc: "Calculated from your audits" },
              { stat: "Real-time", label: "Resume Matching", desc: "Isolates stack gaps instantly" },
            ].map((metric, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/5 bg-[#131310]/80 p-6 hover:border-white/10 transition-all flex flex-col justify-center min-h-[140px]"
              >
                <p className="text-3xl font-extrabold text-[#C5EB8E] font-mono">{metric.stat}</p>
                <p className="text-xs font-bold text-white mt-2 font-mono uppercase tracking-wider">{metric.label}</p>
                <p className="text-[10.5px] text-neutral-400 mt-1">{metric.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION: FINAL CTA CARD ── */}
      <section className="relative z-10 py-24 max-w-6xl mx-auto w-full px-6">
        <div className="rounded-3xl border border-white/10 bg-[#131310]/80 backdrop-blur-md p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-size-[20px] bg-[radial-gradient(rgba(255,255,255,0.012)_1px,transparent_1px)] pointer-events-none" />

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#EE8590] font-bold">
            audit your skills
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 tracking-tight">
            Turn Your Resume Into A<br />
            <span className="text-[#EE8590] font-serif italic font-normal">Career Roadmap.</span>
          </h2>
          <p className="text-sm text-neutral-400 mt-4 max-w-md mx-auto leading-relaxed">
            Stop guessing your placement readiness. Run a free skill gap audit and get a structured preparation roadmap instantly.
          </p>

          <div className="mt-8 flex justify-center">
            {user ? (
              <ButtonLink
                href="/dashboard"
                className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#080807] bg-[#EE8590] hover:bg-[#EE8590]/90 transition-all rounded-full font-bold shadow-md flex items-center gap-1.5"
              >
                <span>Open Dashboard Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </ButtonLink>
            ) : (
              <ButtonLink
                href="/signup"
                className="px-7 py-3.5 text-xs font-mono uppercase tracking-widest text-[#080807] bg-[#EE8590] hover:bg-[#EE8590]/90 transition-all rounded-full font-bold shadow-md flex items-center gap-1.5"
              >
                <span>Start My Skill Audit</span>
                <ArrowRight className="w-4 h-4" />
              </ButtonLink>
            )}
          </div>
        </div>
      </section>

      {/* ── PREMIUM SAAS FOOTER ── */}
      <footer className="relative z-10 py-16 border-t border-white/5 bg-[#080807] text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="w-7 h-7 text-[#EE8590]" />
              <span className="font-semibold text-white text-base tracking-tight font-serif italic">
                SortMySkills
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              An offline-first, client-synchronized career operating system built to help students evaluate, map, and prepare modern developer placements.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-mono text-[9px] text-white uppercase tracking-widest font-bold">Workspace</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/skill-development" className="hover:text-[#EE8590] transition-colors">
                  Skill Roadmap
                </Link>
              </li>
              <li>
                <Link href="/job-match" className="hover:text-[#EE8590] transition-colors">
                  Job Matcher
                </Link>
              </li>
              <li>
                <Link href="/interview-packs" className="hover:text-[#EE8590] transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link href="/tools/parser" className="hover:text-[#EE8590] transition-colors">
                  Skill Parser
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-mono text-[9px] text-white uppercase tracking-widest font-bold">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-[#EE8590] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#EE8590] transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#EE8590] transition-colors">
                  Workspace
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#EE8590] transition-colors">
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <span>SortMySkills © 2026 · Premium Career Intelligence Platform</span>
          <span className="font-mono text-[10px] text-neutral-600">LINEAR_STRIPE_VERCEL_DESIGN_THEME</span>
        </div>
      </footer>
    </div>
  );
}

// ── Simple inline loader icon component ──
function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
