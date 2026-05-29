import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth/get-user";
import LandingAnimations from "@/components/landing/LandingAnimations";
import MarketingHeader from "@/components/landing/MarketingHeader";
import {
  ArrowRight,
  Compass,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  MailX,
  FileText,
} from "lucide-react";

export default async function LandingPage() {
  const user = await getCurrentUser();

  // Signal pills for the endless scrolling marquee
  const signals = [
    "Built for students",
    "Resume to roadmap",
    "Role-fit scoring",
    "900+ interview questions",
    "Skill parser",
    "Job-match engine",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] warm-noise-bg overflow-x-hidden relative font-sans text-text-primary">
      {/* Dynamic Glowing Mesh Orbs */}
      <div className="orb-bg w-[500px] h-[500px] bg-accent-primary/10 top-[-150px] left-[-150px] opacity-70" />
      <div className="orb-bg w-[600px] h-[600px] bg-accent-secondary/5 top-[350px] right-[-150px] opacity-50" />
      <div className="orb-bg w-[550px] h-[550px] bg-accent-tertiary/10 bottom-[150px] left-[5%] opacity-60" />

      {/* GSAP Client Animations */}
      <LandingAnimations />

      {/* 1. Header (Frosted & Collapsible Client Component) */}
      <MarketingHeader user={user} />

      {/* 2. Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero Details */}
        <div className="lg:col-span-7 flex flex-col text-left">
          <div className="hero-reveal-eyebrow opacity-0 flex items-center gap-2 mb-4">
            <span className="eyebrow text-[#EF7A5F] dark:text-[#E36B4F]">Career intelligence for students</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
          </div>

          <h1 className="hero-reveal-title opacity-0 hero-display text-text-primary leading-[1.05] tracking-tight text-3xl sm:text-5xl font-extrabold">
            Turn scattered skills <br />
            into a clear <br />
            <span className="text-serif font-normal italic text-accent-primary">career roadmap.</span>
          </h1>

          <p className="hero-reveal-sub opacity-0 mt-6 text-base md:text-lg text-text-secondary leading-relaxed max-w-xl font-sans normal-case">
            SortMySkills analyzes your resume, compares it with real job descriptions, detects skill gaps, and shows the fastest path to become placement-ready.
          </p>

          <div className="hero-reveal-ctas opacity-0 mt-10 flex flex-wrap gap-4 items-center">
            {user ? (
              <ButtonLink
                href="/dashboard"
                className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </ButtonLink>
            ) : (
              <>
                <ButtonLink
                  href="/signup"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
                >
                  <span>Start Skill Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </ButtonLink>
                <ButtonLink
                  href="/login"
                  variant="secondary"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest border border-[var(--border-strong)] rounded-full hover:bg-surface-hover"
                >
                  Try Job Match
                </ButtonLink>
              </>
            )}

          </div>

          {/* Core Signals Strip */}
          <div className="hero-reveal-pills opacity-0 mt-12 grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
            {[
              "Built for students",
              "Resume to roadmap",
              "Role-fit scoring",
              "900+ questions Mapped",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3.5 py-1.5 text-xs text-text-secondary font-medium tracking-tight font-sans"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Hero Visual: Floating Dashboard Mockup */}
        <div className="lg:col-span-5 relative w-full flex justify-center visual-card-reveal opacity-0">
          <div className="w-full max-w-[420px] rounded-3xl border border-[var(--border-muted)] bg-surface-card p-6 shadow-lg relative overflow-hidden animated-border">
            {/* Dot grid decoration */}
            <div className="absolute inset-0 dot-grid-overlay opacity-25 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-[var(--border-muted)] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-primary/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent-secondary/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent-tertiary/60" />
              </div>
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">
                NORMALIZER_SANDBOX_V1
              </span>
            </div>

            {/* Input state */}
            <div className="relative z-10 mb-4 text-left">
              <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2">
                Chaotic Resume Input
              </span>
              <div className="rounded-xl bg-[var(--surface-soft)]/60 border border-[var(--border-muted)] p-3 text-[11px] text-text-secondary font-mono leading-relaxed select-none">
                {"\"Have experience styling with css/tailwind, coding in python, react.js components, deployed basic docker on AWS...\""}
              </div>
            </div>

            {/* Arrow logic */}
            <div className="relative z-10 flex justify-center my-3 text-accent-primary">
              <div className="w-8 h-8 rounded-full border border-[var(--border-muted)] bg-surface-card flex items-center justify-center animate-pulse">
                <ArrowRight className="w-4 h-4 rotate-90 text-accent-primary" />
              </div>
            </div>

            {/* Simulated Normalized tags */}
            <div className="relative z-10 mb-5 text-left">
              <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2">
                Normalized Standard Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: "React.js", bg: "rgba(227, 107, 79, 0.1)", textCol: "var(--accent-primary)", cl: "floating-chip-1" },
                  { text: "Python", bg: "rgba(217, 166, 111, 0.1)", textCol: "var(--accent-secondary)", cl: "floating-chip-2" },
                  { text: "Tailwind CSS", bg: "rgba(126, 159, 130, 0.1)", textCol: "var(--accent-tertiary)", cl: "floating-chip-3" },
                  { text: "Docker", bg: "rgba(227, 107, 79, 0.1)", textCol: "var(--accent-primary)", cl: "visual-tag-stagger opacity-0" },
                  { text: "AWS Cloud", bg: "rgba(217, 166, 111, 0.1)", textCol: "var(--accent-secondary)", cl: "visual-tag-stagger opacity-0" },
                ].map((chip, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-mono font-medium border border-[var(--border-muted)] ${chip.cl}`}
                    style={{ backgroundColor: chip.bg, color: chip.textCol }}
                  >
                    {chip.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats dials */}
            <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-[var(--border-muted)] pt-4 mt-2">
              <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/45 p-3 text-left">
                <span className="block font-mono text-[9px] text-text-muted uppercase">JD Match Score</span>
                <p className="text-xl font-bold text-accent-primary mt-1">87%</p>
                <div className="w-full bg-[var(--surface-soft)] h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-accent-primary h-full rounded-full" style={{ width: "87%" }} />
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/45 p-3 flex items-center gap-3 text-left">
                <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="20" cy="20" r="16" stroke="var(--border-muted)" strokeWidth="3" fill="none" />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="var(--accent-primary)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * 0.25}
                    />
                  </svg>
                  <span className="text-[9px] font-mono font-bold text-text-primary">75%</span>
                </div>
                <div>
                  <span className="block font-mono text-[8px] text-text-muted uppercase">Readiness</span>
                  <p className="text-[10px] font-semibold text-text-primary mt-0.5">Placement Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trusted Trust/Signal Pills Scrolling Marquee */}
      <section className="relative z-10 border-t border-b border-[var(--border-muted)] bg-[var(--surface-card-warm)]/40 py-5 overflow-hidden">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-start relative">
          <div className="animate-marquee whitespace-nowrap flex gap-8 py-1.5">
            {[...signals, ...signals].map((sig, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-surface-card px-4 py-1.5 text-xs text-text-secondary font-semibold font-mono uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
                <span>{sig}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Product Preview Showcase Section (Features) */}
      <section id="product-showcase" className="section-shell reveal-section">
        <div className="container-shell text-center">
          <span className="eyebrow reveal-item opacity-0">Unified Career Operating System</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-2 reveal-item opacity-0 font-sans">
            A cohesive career intelligence engine
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto reveal-item opacity-0">
            Everything you need to move from scattered tech keywords to clear placement readiness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 text-left">
            {/* Feature 1: Why No Reply */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0 hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-5">
                  <MailX className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary tracking-tight font-sans uppercase text-xs font-mono">Why No Reply</h3>
                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed font-sans">
                  The ultimate recruiter callback diagnosis. Isolate specific emotional, structure, or competency reasons why employers might be ignoring your applications.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-muted)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-muted">CALLBACK DIAGNOSIS</span>
                <Link href="/why-no-reply" className="text-accent-primary font-bold hover:underline flex items-center gap-1">
                  <span>Start Diagnosis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 2: Career Analyser */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0 hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center text-accent-secondary mb-5">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary tracking-tight font-sans uppercase text-xs font-mono">Career Analyser</h3>
                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed font-sans">
                  Consolidated analysis workspace. Paste your target job and credentials once to check ATS compatibility, match keyword deficits, and compile dynamic study roadmaps.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-muted)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-muted">UNIFIED WORKSPACE</span>
                <Link href="/career-analyser" className="text-accent-primary font-bold hover:underline flex items-center gap-1">
                  <span>Run Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 3: Resume Builder */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0 hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-5">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary tracking-tight font-sans uppercase text-xs font-mono">Resume Builder</h3>
                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed font-sans">
                  Revamp your bullets in real-time. Use active technical verbs, recruiter-ready language, and layout sweeps to score perfectly on automated ATS scanners.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-muted)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-muted">PROFILE ENGINE</span>
                <Link href="/resume-builder" className="text-accent-primary font-bold hover:underline flex items-center gap-1">
                  <span>Open Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 4: Interview Packs */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0 hover-lift">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center text-accent-secondary mb-5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary tracking-tight font-sans uppercase text-xs font-mono">Interview Packs</h3>
                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed font-sans">
                  Practice 900+ curated placement questions across 6 core technical role families, sorted systematically by easy, medium, and hard levels.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-muted)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-muted">PLACEMENT PREP</span>
                <Link href="/interview-packs" className="text-accent-primary font-bold hover:underline flex items-center gap-1">
                  <span>Browse Packs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Process Section */}
      <section className="section-shell border-t border-[var(--border-muted)] bg-[var(--surface-card-warm)]/15 reveal-section">
        <div className="container-shell text-center">
          <span className="eyebrow reveal-item opacity-0">Clarity Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-2 reveal-item opacity-0 font-sans">
            Your career clarity flow
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto reveal-item opacity-0">
            Skip complex steps. SortMySkills normalizes your background and charts your preparation in real-time.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mt-16 text-left relative z-10">
            {[
              {
                num: "01",
                title: "Import your skills",
                desc: "Paste your resume, skills, or project description. Our parser reads it securely.",
              },
              {
                num: "02",
                title: "Decode your profile",
                desc: "SortMySkills normalizes messy skills and unstructured keywords into standard structured signals.",
              },
              {
                num: "03",
                title: "Compare with real roles",
                desc: "See your match score, critical missing skills, placement-readiness ratings, and rejection risks.",
              },
              {
                num: "04",
                title: "Follow the roadmap",
                desc: "Get instant tailored learning actions, Coursera study bridges, interview packs, and actionable next steps.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="soft-card p-6 flex flex-col justify-between h-full relative group hover:border-accent-primary/30 transition-all reveal-item opacity-0"
              >
                <div>
                  <span className="font-mono text-3xl font-bold text-accent-primary/20 group-hover:text-accent-primary/35 block mb-4 transition-colors">
                    {step.num}
                  </span>
                  <h3 className="font-bold text-text-primary text-sm tracking-tight font-sans">{step.title}</h3>
                  <p className="text-xs text-text-secondary mt-3 leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Stats Section */}
      <section className="section-shell border-t border-[var(--border-muted)] reveal-section">
        <div className="container-shell text-center">
          <span className="eyebrow reveal-item opacity-0">Real System Metrics</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-2 reveal-item opacity-0 font-sans">
            Workspace Intelligence Metrics
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { stat: "900+", label: "Interview Questions", desc: "Mapped across 6 Tracks" },
              { stat: "6 Tracks", label: "Role Tracks", desc: "Frontend, UX, Analyst & ML" },
              { stat: "20+", label: "Skill Categories", desc: "Normalized canonical tags" },
              { stat: "3-Minute", label: "Career Audit", desc: "Average setup time" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="premium-card p-6 text-center hover:border-accent-primary/30 transition-all reveal-item opacity-0 hover-lift"
              >
                <p className="text-3xl font-bold text-accent-primary font-mono">{item.stat}</p>
                <p className="text-xs font-semibold text-text-primary mt-2 font-sans">{item.label}</p>
                <p className="text-[10px] text-text-muted mt-1 leading-snug font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Skill Ecosystem Section (Orbit) */}
      <section className="section-shell border-t border-[var(--border-muted)] reveal-section overflow-hidden">
        <div className="container-shell text-center relative z-10 flex flex-col items-center">
          <span className="eyebrow reveal-item opacity-0">Skill Taxonomy</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-2 reveal-item opacity-0 font-sans">
            Map your skills into one unified orbit
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto mb-16 reveal-item opacity-0">
            Standardizing unstructured CV components into clean, interconnected pathways.
          </p>

          {/* SVG Orbit Visual */}
          <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] flex items-center justify-center reveal-item opacity-0">
            {/* Inner Ring */}
            <div className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] rounded-full border border-[var(--border-muted)] border-dashed animate-spin-slow" />
            
            {/* Outer Ring */}
            <div className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full border border-[var(--border-muted)] border-dashed animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "35s" }} />

            {/* Core Center Node */}
            <div className="absolute w-20 h-20 rounded-full bg-accent-primary/10 border-2 border-accent-primary flex flex-col items-center justify-center shadow-lg z-25 transition-transform hover:scale-105">
              <Logo className="w-7 h-7" />
              <span className="text-[8px] font-mono font-bold mt-1 text-text-primary uppercase tracking-wider">SMS CORE</span>
            </div>

            {/* Orbiting standard skill nodes */}
            <div className="absolute translate-y-[-90px] sm:translate-y-[-120px] rounded-lg border border-[var(--border-strong)] bg-surface-card px-2.5 py-1 text-[10px] font-mono font-semibold text-text-primary shadow-xs z-20">
              React
            </div>
            <div className="absolute translate-y-[90px] sm:translate-y-[120px] rounded-lg border border-[var(--border-strong)] bg-surface-card px-2.5 py-1 text-[10px] font-mono font-semibold text-text-primary shadow-xs z-20">
              Python
            </div>
            <div className="absolute translate-x-[-90px] sm:translate-x-[-120px] rounded-lg border border-[var(--border-strong)] bg-surface-card px-2.5 py-1 text-[10px] font-mono font-semibold text-text-primary shadow-xs z-20">
              SQL
            </div>
            <div className="absolute translate-x-[90px] sm:translate-x-[120px] rounded-lg border border-[var(--border-strong)] bg-surface-card px-2.5 py-1 text-[10px] font-mono font-semibold text-text-primary shadow-xs z-20">
              TypeScript
            </div>

            <div className="absolute translate-y-[-140px] translate-x-[-100px] sm:translate-y-[-200px] sm:translate-x-[-140px] rounded-lg border border-[var(--border-muted)] bg-surface-card/85 px-2 py-0.5 text-[9px] font-mono text-text-secondary shadow-xs z-15">
              Git
            </div>
            <div className="absolute translate-y-[-140px] translate-x-[100px] sm:translate-y-[-200px] sm:translate-x-[140px] rounded-lg border border-[var(--border-muted)] bg-surface-card/85 px-2 py-0.5 text-[9px] font-mono text-text-secondary shadow-xs z-15">
              Figma
            </div>
            <div className="absolute translate-y-[140px] translate-x-[-100px] sm:translate-y-[200px] sm:translate-x-[-140px] rounded-lg border border-[var(--border-muted)] bg-surface-card/85 px-2 py-0.5 text-[9px] font-mono text-text-secondary shadow-xs z-15">
              Node.js
            </div>
            <div className="absolute translate-y-[140px] translate-x-[100px] sm:translate-y-[200px] sm:translate-x-[140px] rounded-lg border border-[var(--border-muted)] bg-surface-card/85 px-2 py-0.5 text-[9px] font-mono text-text-secondary shadow-xs z-15">
              Machine Learning
            </div>
            <div className="absolute translate-y-[-60px] translate-x-[-150px] sm:translate-y-[-90px] sm:translate-x-[-200px] rounded-lg border border-[var(--border-muted)] bg-surface-card/85 px-2 py-0.5 text-[9px] font-mono text-text-secondary shadow-xs z-15">
              Product
            </div>
            <div className="absolute translate-y-[-60px] translate-x-[150px] sm:translate-y-[-90px] sm:translate-x-[200px] rounded-lg border border-[var(--border-muted)] bg-surface-card/85 px-2 py-0.5 text-[9px] font-mono text-text-secondary shadow-xs z-15">
              Cloud
            </div>
          </div>
        </div>
      </section>

      {/* 9. Sample Outcome Section */}
      <section className="section-shell border-t border-[var(--border-muted)] bg-[var(--surface-card-warm)]/15 reveal-section">
        <div className="container-shell text-center">
          <span className="eyebrow reveal-item opacity-0">Outcome Profile</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-2 reveal-item opacity-0 font-sans">
            A Typical Student Outcome
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16 text-left relative z-10">
            {/* Before */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0 border-red-500/20 hover:border-red-500/40">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3 mb-4">
                  <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-widest">
                    Before SortMySkills
                  </span>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-mono select-none">
                  “I know React and Python but don’t know where I fit. I’ve sent out dozens of generic CVs and have no visibility over critical missing skills.”
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-muted)] text-[10px] text-text-muted">
                Status: <strong>Directionless & Gapped</strong>
              </div>
            </div>

            {/* After */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0 border-success/20 hover:border-success/40">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3 mb-4">
                  <span className="font-mono text-xs font-bold text-success uppercase tracking-widest">
                    After SortMySkills
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <div className="text-xs space-y-2.5 text-text-secondary leading-relaxed font-mono">
                  <p>✔ <strong>Best-fit role:</strong> Frontend Intern</p>
                  <p>✔ <strong>Readiness rating:</strong> 72% computed</p>
                  <p>✔ <strong>Audited Gaps:</strong> TypeScript, API Integration</p>
                  <p>✔ <strong>Fastest fix:</strong> Build one typed React dashboard</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-muted)] text-[10px] text-accent-primary font-bold">
                Status: <strong>Structured Roadmap Engaged</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Final Call To Action Card */}
      <section className="section-shell border-t border-[var(--border-muted)] reveal-section">
        <div className="container-shell text-center">
          <div className="rounded-3xl border border-[var(--border-muted)] bg-surface-card p-8 md:p-14 shadow-lg relative overflow-hidden animated-border reveal-item opacity-0">
            {/* Ambient pattern */}
            <div className="absolute inset-0 dot-grid-overlay opacity-25 pointer-events-none" />

            <span className="eyebrow">placement intelligence</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mt-3 font-serif italic">
              Ready to stop guessing your career path?
            </h2>
            <p className="text-sm text-text-secondary mt-4 max-w-md mx-auto leading-relaxed font-sans">
              Create your skill profile, compare it with real roles, and get a roadmap you can act on today.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {user ? (
                <ButtonLink
                  href="/dashboard"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink
                    href="/signup"
                    className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </ButtonLink>
                  <ButtonLink
                    href="/login"
                    variant="secondary"
                    className="px-6 py-3 text-xs font-mono uppercase tracking-widest border border-[var(--border-strong)] rounded-full hover:bg-surface-hover"
                  >
                    Open Dashboard
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 11. Premium SaaS Footer */}
      <footer className="relative z-10 py-12 border-t border-[var(--border-muted)] bg-[var(--background)] text-xs text-text-muted">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Col 1 Brand */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-6 h-6" />
              <span className="font-semibold text-text-primary text-base tracking-tight font-serif italic">
                SortMySkills
              </span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              An offline-first, client-synchronized career operating system built to help students evaluate, map, and prepare modern developer placements.
            </p>
          </div>

          {/* Col 2 Utilities */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-text-primary uppercase tracking-widest font-bold">Workspace</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/why-no-reply" className="hover:text-accent-primary transition-colors">
                  Why No Reply
                </Link>
              </li>
              <li>
                <Link href="/career-analyser" className="hover:text-accent-primary transition-colors">
                  Career Analyser
                </Link>
              </li>
              <li>
                <Link href="/resume-builder" className="hover:text-accent-primary transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/interview-packs" className="hover:text-accent-primary transition-colors">
                  Interview Packs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 Account */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-text-primary uppercase tracking-widest font-bold">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-accent-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-accent-primary transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-accent-primary transition-colors">
                  Workspace
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-accent-primary transition-colors">
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-[var(--border-muted)] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <span>SortMySkills © 2026 · Premium Career Intelligence Platform</span>
        </div>
      </footer>
    </div>
  );
}
