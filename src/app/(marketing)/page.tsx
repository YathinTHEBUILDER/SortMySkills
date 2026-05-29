import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth/get-user";
import LandingAnimations from "@/components/landing/LandingAnimations";
import MarketingHeader from "@/components/landing/MarketingHeader";
import CareerTwinSimulator from "@/components/landing/CareerTwinSimulator";
import {
  ArrowRight,
  Compass,
  Briefcase,
  BookOpen,
  Code,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default async function LandingPage() {
  const user = await getCurrentUser();

  // Signal pills for the endless scrolling marquee
  const signals = [
    "Built for students",
    "Resume to roadmap",
    "Role-fit scoring",
    "900+ interview questions",
    "Local skill parser",
    "Job-match engine",
    "Career Twin simulator",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] warm-noise-bg overflow-x-hidden relative">
      {/* Dynamic Glowing Mesh Orbs (Torivo-Style) */}
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
            <span className="eyebrow">A Career Operating System for Students</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
          </div>

          <h1 className="hero-reveal-title opacity-0 hero-display text-text-primary leading-[1.05] tracking-tight">
            Turn scattered skills <br />
            into a structured <br />
            <span className="text-serif font-normal italic text-accent-primary">career path.</span>
          </h1>

          <p className="hero-reveal-sub opacity-0 mt-6 text-base md:text-lg text-text-secondary leading-relaxed max-w-xl">
            SortMySkills analyzes your resume, compares it against real job descriptions, detects critical gaps, and builds the fastest placement-ready learning roadmap.
          </p>

          <div className="hero-reveal-ctas opacity-0 mt-10 flex flex-wrap gap-4 items-center">
            {user ? (
              <ButtonLink
                href="/dashboard"
                className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </ButtonLink>
            ) : (
              <>
                <ButtonLink
                  href="/signup"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md"
                >
                  <span>Start Career Audit</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
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
            <a
              href="#career-twin-sandbox"
              className="text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-accent-primary transition-colors flex items-center gap-1.5 ml-2"
            >
              <span>Simulate Career Twin</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-ping" />
            </a>
          </div>

          {/* Core Signals Strip */}
          <div className="hero-reveal-pills opacity-0 mt-12 grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
            {[
              "Local skill parser",
              "900 interview questions",
              "Role-based roadmaps",
              "Supabase DB synced",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3.5 py-1.5 text-xs text-text-secondary font-medium tracking-tight"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Hero Visual: Torivo-Style Floating Dashboard Mockup */}
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
                SKILL_RADAR_V1
              </span>
            </div>

            {/* Input state */}
            <div className="relative z-10 mb-4 text-left">
              <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2">
                Chaotic Resume Input
              </span>
              <div className="rounded-xl bg-[var(--surface-soft)]/60 border border-[var(--border-muted)] p-3 text-[11px] text-text-secondary font-mono leading-relaxed select-none">
                {"\"Proficient in React, python coding, styling with TailwindCSS, deployed to AWS S3...\""}
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
                Normalized Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: "React.js", bg: "rgba(124, 124, 255, 0.12)", textCol: "var(--accent-primary)", cl: "floating-chip-1" },
                  { text: "Python", bg: "rgba(169, 169, 254, 0.15)", textCol: "var(--accent-secondary)", cl: "floating-chip-2" },
                  { text: "Tailwind CSS", bg: "rgba(25, 25, 96, 0.12)", textCol: "var(--accent-tertiary)", cl: "floating-chip-3" },
                  { text: "AWS Cloud", bg: "rgba(124, 124, 255, 0.12)", textCol: "var(--accent-primary)", cl: "visual-tag-stagger opacity-0" },
                  { text: "Data Science", bg: "rgba(169, 169, 254, 0.15)", textCol: "var(--accent-secondary)", cl: "visual-tag-stagger opacity-0" },
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
                <span className="block font-mono text-[9px] text-text-muted uppercase">Match Score</span>
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
                  <p className="text-[10px] font-semibold text-text-primary mt-0.5">Role Ready</p>
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

      {/* 4. Product Preview Showcase Section */}
      <section id="product-showcase" className="section-shell reveal-section">
        <div className="container-shell text-center">
          <span className="eyebrow reveal-item opacity-0">Product Showcase</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 reveal-item opacity-0">
            A cohesive career intelligence engine
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto reveal-item opacity-0">
            Everything you need to move from scattered tech keywords to clear placement readiness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 text-left">
            {/* Feature 1 */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-5">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary tracking-tight">Skill Audit & Plan</h3>
                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                  Map your current competencies against standardized industry requirements. View your readiness percentage and bridge technical gaps instantly using tailored Coursera pathing algorithms.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-muted)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-muted">READY TO PLOT</span>
                <Link href="/skill-development" className="text-accent-primary font-bold hover:underline flex items-center gap-1">
                  <span>Open Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-secondary/10 border border-accent-secondary/20 flex items-center justify-center text-accent-secondary mb-5">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary tracking-tight">Job Match Engine</h3>
                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                  Dual-panel comparison laboratory. Paste your resume and target placement posts to compute instant matching weights, missing keywords, and supplementary assets securely in your workspace.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-muted)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-muted">MATCH ANALYSIS</span>
                <Link href="/job-match" className="text-accent-primary font-bold hover:underline flex items-center gap-1">
                  <span>Run Comparison</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-tertiary/10 border border-accent-tertiary/20 flex items-center justify-center text-accent-tertiary mb-5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary tracking-tight">Placement Prep packs</h3>
                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                  Practice 900+ high-end placement evaluation questions across 6 core technical role families, categorized by junior, mid, and senior levels to structure your interview readiness.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-muted)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-muted">900+ QUESTIONS MAPPED</span>
                <Link href="/interview-packs" className="text-accent-primary font-bold hover:underline flex items-center gap-1">
                  <span>Browse Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0">
              <div>
                <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-5">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-text-primary tracking-tight">Skill Normalization Engine</h3>
                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">
                  Standardizes raw and messy CV terms (e.g. `k8s`, `py`, `react.js`) into clean, canonical competency taxonomies locally to ensure resume checks match what employers scan for.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border-muted)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-muted">LOCAL PARSER PLAYGROUND</span>
                <Link href="/tools/parser" className="text-accent-primary font-bold hover:underline flex items-center gap-1">
                  <span>Test Parser</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Process Clarity Flow Timeline */}
      <section className="section-shell border-t border-[var(--border-muted)] bg-[var(--surface-card-warm)]/15 reveal-section">
        <div className="container-shell text-center">
          <span className="eyebrow reveal-item opacity-0">Your Career Clarity Flow</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 reveal-item opacity-0">
            A linear path from confusion to placement
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto reveal-item opacity-0">
            Skip complex steps. SortMySkills normalizes your background and charts your preparation in real-time.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mt-16 text-left relative z-10">
            {[
              {
                num: "01",
                title: "Import Profile",
                desc: "Paste raw resume text, skills, or portfolio terms. The local parser structures your technical details instantly.",
              },
              {
                num: "02",
                title: "Normalize Skills",
                desc: "Messy aliases are normalized into canonical taxonomies, structuring your digital credentials.",
              },
              {
                num: "03",
                title: "Evaluate Readiness",
                desc: "Compare your normalized profile against live target roles to calculate matching rates and gaps.",
              },
              {
                num: "04",
                title: "Action the Roadmap",
                desc: "Audited gaps pair directly with specific Coursera bridges and placement mock prep sets.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="soft-card p-6 flex flex-col justify-between h-full relative group hover:border-accent-primary/30 transition-all reveal-item opacity-0"
              >
                <div>
                  <span className="font-mono text-3xl font-bold text-accent-primary/20 group-hover:text-accent-primary/30 block mb-4 transition-colors">
                    {step.num}
                  </span>
                  <h3 className="font-bold text-text-primary text-sm tracking-tight">{step.title}</h3>
                  <p className="text-xs text-text-secondary mt-3 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Results / Stats Board Section */}
      <section className="section-shell border-t border-[var(--border-muted)] reveal-section">
        <div className="container-shell text-center">
          <span className="eyebrow reveal-item opacity-0">Platform Statistics</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 reveal-item opacity-0">
            Workspace Intelligence Metrics
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { stat: "900+", label: "Prep Questions", desc: "Across Junior & Senior levels" },
              { stat: "6 Tracks", label: "Career Paths", desc: "Frontend, UX, Analyst & ML" },
              { stat: "60+", label: "Skill Categories", desc: "Normalized canonical tags" },
              { stat: "3-Min", label: "Skill Audit", desc: "Average setup time" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="premium-card p-6 text-center hover:border-accent-primary/30 transition-all reveal-item opacity-0"
              >
                <p className="text-3xl font-bold text-accent-primary font-mono">{item.stat}</p>
                <p className="text-xs font-semibold text-text-primary mt-2">{item.label}</p>
                <p className="text-[10px] text-text-muted mt-1 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Career Twin Sandbox client component highlight */}
      <section id="career-twin-sandbox" className="section-shell border-t border-[var(--border-muted)] bg-[var(--surface-card-warm)]/15 reveal-section">
        <div className="container-shell text-center">
          <span className="eyebrow reveal-item opacity-0">Interactive Simulator</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 reveal-item opacity-0">
            Meet your Career Twin.
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-xl mx-auto mb-16 reveal-item opacity-0">
            A live simulation of your technical identity. Toggle the What-If Sandbox to see where you might trigger placement risks, what your match scores represent, and what changes when you bridge missing components.
          </p>

          <div className="reveal-item opacity-0">
            <CareerTwinSimulator />
          </div>
        </div>
      </section>

      {/* 8. Connected Skill Ecosystem Orbit Graphic */}
      <section className="section-shell border-t border-[var(--border-muted)] reveal-section overflow-hidden">
        <div className="container-shell text-center relative z-10 flex flex-col items-center">
          <span className="eyebrow reveal-item opacity-0">Skill Taxonomy</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 reveal-item opacity-0">
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

            {/* Inner Ring Orbit Nodes */}
            <div className="absolute translate-y-[-90px] sm:translate-y-[-120px] rounded-lg border border-[var(--border-strong)] bg-surface-card px-2.5 py-1 text-[10px] font-mono font-semibold text-text-primary shadow-xs z-20">
              React.js
            </div>
            <div className="absolute translate-y-[90px] sm:translate-y-[120px] rounded-lg border border-[var(--border-strong)] bg-surface-card px-2.5 py-1 text-[10px] font-mono font-semibold text-text-primary shadow-xs z-20">
              Python
            </div>
            <div className="absolute translate-x-[-90px] sm:translate-x-[-120px] rounded-lg border border-[var(--border-strong)] bg-surface-card px-2.5 py-1 text-[10px] font-mono font-semibold text-text-primary shadow-xs z-20">
              SQL DB
            </div>
            <div className="absolute translate-x-[90px] sm:translate-x-[120px] rounded-lg border border-[var(--border-strong)] bg-surface-card px-2.5 py-1 text-[10px] font-mono font-semibold text-text-primary shadow-xs z-20">
              DevOps
            </div>

            {/* Outer Ring Orbit Nodes */}
            <div className="absolute translate-y-[-140px] translate-x-[-100px] sm:translate-y-[-200px] sm:translate-x-[-140px] rounded-lg border border-[var(--border-muted)] bg-surface-card/85 px-2 py-0.5 text-[9px] font-mono text-text-secondary shadow-xs z-15">
              TypeScript
            </div>
            <div className="absolute translate-y-[-140px] translate-x-[100px] sm:translate-y-[-200px] sm:translate-x-[140px] rounded-lg border border-[var(--border-muted)] bg-surface-card/85 px-2 py-0.5 text-[9px] font-mono text-text-secondary shadow-xs z-15">
              Figma
            </div>
            <div className="absolute translate-y-[140px] translate-x-[-100px] sm:translate-y-[200px] sm:translate-x-[-140px] rounded-lg border border-[var(--border-muted)] bg-surface-card/85 px-2 py-0.5 text-[9px] font-mono text-text-secondary shadow-xs z-15">
              REST APIs
            </div>
            <div className="absolute translate-y-[140px] translate-x-[100px] sm:translate-y-[200px] sm:translate-x-[140px] rounded-lg border border-[var(--border-muted)] bg-surface-card/85 px-2 py-0.5 text-[9px] font-mono text-text-secondary shadow-xs z-15">
              Git
            </div>
          </div>
        </div>
      </section>

      {/* 9. Testimonial / Sample Before After Outcome Section */}
      <section className="section-shell border-t border-[var(--border-muted)] bg-[var(--surface-card-warm)]/15 reveal-section">
        <div className="container-shell text-center">
          <span className="eyebrow reveal-item opacity-0">Clarity Metric</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 reveal-item opacity-0">
            A Typical Student Outcome
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16 text-left relative z-10">
            {/* Before */}
            <div className="premium-card p-6 flex flex-col justify-between reveal-item opacity-0 border-red-500/20 hover:border-red-500/40">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3 mb-4">
                  <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-widest">
                    Pre-Evaluation State
                  </span>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-mono select-none">
                  “I know basic JavaScript and Python but don&apos;t know where I fit. I&apos;ve sent 50 generic applications out and received 0 replies. Gaps are completely invisible to me.”
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
                    Post-SortMySkills State
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <div className="text-xs space-y-2.5 text-text-secondary leading-relaxed font-mono">
                  <p>✔ <strong>Best-fit role:</strong> Junior Frontend Engineer</p>
                  <p>✔ <strong>Readiness rating:</strong> 72% computed</p>
                  <p>✔ <strong>Audited Gaps:</strong> TypeScript, API Integration</p>
                  <p>✔ <strong>Fastest fix:</strong> Complete Course 3 (Coursera) & build 1 dynamic typed repo.</p>
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
              Ready to stop guessing your path?
            </h2>
            <p className="text-sm text-text-secondary mt-4 max-w-md mx-auto leading-relaxed">
              Analyze your current skillset, compare your profile against actual job posts, detect gaps, and map a clean placement preparation strategy.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {user ? (
                <ButtonLink
                  href="/dashboard"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink
                    href="/signup"
                    className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </ButtonLink>
                  <ButtonLink
                    href="/login"
                    variant="secondary"
                    className="px-6 py-3 text-xs font-mono uppercase tracking-widest border border-[var(--border-strong)] rounded-full hover:bg-surface-hover"
                  >
                    Sign In
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
              An offline-first, client-synchronized career operating system built to help technical students evaluate, map, and prepare their competency portfolios for modern developer placements.
            </p>
          </div>

          {/* Col 2 Utilities */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-text-primary uppercase tracking-widest">Workspace</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/skill-development" className="hover:text-accent-primary transition-colors">
                  Skill Planner
                </Link>
              </li>
              <li>
                <Link href="/job-match" className="hover:text-accent-primary transition-colors">
                  Job Matcher
                </Link>
              </li>
              <li>
                <Link href="/interview-packs" className="hover:text-accent-primary transition-colors">
                  Interview Packs
                </Link>
              </li>
              <li>
                <Link href="/tools/parser" className="hover:text-accent-primary transition-colors">
                  Parser Playground
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 Account */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-text-primary uppercase tracking-widest">Account</h4>
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
          <span className="font-mono text-[9px] text-text-muted">DESIGN_INSPIRE: TORIVO</span>
        </div>
      </footer>
    </div>
  );
}
