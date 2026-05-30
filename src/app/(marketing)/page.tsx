import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth/get-user";
import LandingAnimations from "@/components/landing/LandingAnimations";
import MarketingHeader from "@/components/landing/MarketingHeader";
import ContactForm from "@/components/landing/ContactForm";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  UserCheck,
} from "lucide-react";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] warm-noise-bg overflow-x-hidden relative font-sans text-text-primary scroll-smooth">
      {/* Cinematic Glowing Background Mesh Orbs */}
      <div className="orb-bg w-[500px] h-[500px] bg-accent-primary/10 top-[-150px] left-[-150px] opacity-70" />
      <div className="orb-bg w-[600px] h-[600px] bg-accent-secondary/5 top-[350px] right-[-150px] opacity-50" />
      <div className="orb-bg w-[550px] h-[550px] bg-accent-tertiary/10 bottom-[150px] left-[5%] opacity-60" />

      {/* GSAP & ScrollTrigger Client Script Orchestration */}
      <LandingAnimations />

      {/* SECTION 1 — HEADER (Frosted and Sticky) */}
      <MarketingHeader user={user} />

      {/* SECTION 2 — CINEMATIC HERO */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero Details */}
        <div className="lg:col-span-7 flex flex-col text-left">
          <div className="hero-reveal-eyebrow opacity-0 flex items-center gap-2 mb-5">
            <span className="eyebrow text-[#EF7A5F] dark:text-[#E36B4F] font-mono text-xs uppercase tracking-widest font-bold">
              Placement prep without guesswork
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
          </div>

          <h1 className="hero-display text-text-primary leading-[1.05] tracking-tight font-extrabold mb-6">
            {["See", "what", "your", "resume", "is", "missing", "before", "you", "apply."].map((word, idx) => (
              <span key={idx} className="hero-headline-word inline-block mr-3 opacity-0">
                {word}
              </span>
            ))}
          </h1>

          <p className="hero-reveal-sub opacity-0 text-base md:text-lg text-text-secondary leading-relaxed max-w-xl font-sans normal-case">
            Paste your resume and a job description. SortMySkills finds visible skills, missing requirements, and the next steps to close the gap.
          </p>

          <div className="hero-reveal-ctas opacity-0 mt-10 flex flex-wrap gap-4 items-center">
            {user ? (
              <>
                <ButtonLink
                  href="/dashboard"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </ButtonLink>
                <ButtonLink
                  href="/career-analyser"
                  variant="secondary"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest border border-[var(--border-strong)] rounded-full hover:bg-surface-hover"
                >
                  Open Analyser
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink
                  href="/signup"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
                >
                  <span>Start Free Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </ButtonLink>
                <ButtonLink
                  href="#workflow"
                  variant="secondary"
                  className="px-6 py-3 text-xs font-mono uppercase tracking-widest border border-[var(--border-strong)] rounded-full hover:bg-surface-hover"
                >
                  See Workflow
                </ButtonLink>
              </>
            )}
          </div>

          {/* Hero Static Trust Pills */}
          <div className="hero-reveal-pills opacity-0 mt-12 flex flex-wrap gap-3">
            {["Resume readiness", "Skill gap check", "Verified resources", "Built for students"].map((text) => (
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

        {/* Right Hero Visual: Real-time Parser Simulation */}
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
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest font-bold">
                Resume Parser Mockup
              </span>
            </div>

            {/* Input state */}
            <div className="relative z-10 mb-4 text-left">
              <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2 font-bold">
                Raw Resume Text
              </span>
              <div className="rounded-xl bg-[var(--surface-soft)]/60 border border-[var(--border-muted)] p-3 text-[11px] text-text-secondary font-mono leading-relaxed select-none">
                {"\"Built React dashboards, used Python scripts, worked with SQL, Git, APIs, and basic Docker deployments.\""}
              </div>
            </div>

            {/* Parser connection state */}
            <div className="relative z-10 flex justify-center my-3 text-accent-primary">
              <div className="w-8 h-8 rounded-full border border-[var(--border-muted)] bg-surface-card flex items-center justify-center animate-pulse">
                <ArrowRight className="w-4 h-4 rotate-90 text-accent-primary" />
              </div>
            </div>

            {/* Detected standard tags */}
            <div className="relative z-10 mb-5 text-left">
              <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2 font-bold">
                Detected Skill Signals
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: "React", bg: "rgba(231, 113, 125, 0.1)", textCol: "var(--accent-primary)", cl: "floating-chip-1" },
                  { text: "Python", bg: "rgba(175, 210, 117, 0.1)", textCol: "var(--accent-secondary)", cl: "floating-chip-2" },
                  { text: "SQL", bg: "rgba(194, 202, 208, 0.1)", textCol: "var(--accent-tertiary)", cl: "floating-chip-3" },
                  { text: "Git", bg: "rgba(231, 113, 125, 0.1)", textCol: "var(--accent-primary)", cl: "visual-tag-stagger opacity-0" },
                  { text: "Docker", bg: "rgba(175, 210, 117, 0.1)", textCol: "var(--accent-secondary)", cl: "visual-tag-stagger opacity-0" },
                ].map((chip, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-mono font-semibold border border-[var(--border-muted)] ${chip.cl}`}
                    style={{ backgroundColor: chip.bg, color: chip.textCol }}
                  >
                    {chip.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Dial preview */}
            <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-[var(--border-muted)] pt-4 mt-2">
              <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/45 p-3 text-left">
                <span className="block font-mono text-[9px] text-text-muted uppercase font-bold">Job Match</span>
                <p className="text-xl font-bold text-accent-primary mt-1">72%</p>
                <div className="w-full bg-[var(--surface-soft)] h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-accent-primary h-full rounded-full" style={{ width: "72%" }} />
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
                      strokeDashoffset={2 * Math.PI * 16 * 0.28}
                    />
                  </svg>
                  <span className="text-[9px] font-mono font-bold text-text-primary">72%</span>
                </div>
                <div>
                  <span className="block font-mono text-[8px] text-text-muted uppercase font-bold">Fit Gaps</span>
                  <p className="text-[10px] font-semibold text-text-primary mt-0.5">TypeScript, Tests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — SCROLL-DRIVEN RESUME TRANSFORMATION */}
      <section id="product" className="section-shell border-t border-[var(--border-muted)] bg-[var(--surface-card-warm)]/10 py-24 relative overflow-hidden resume-transform-section">
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center relative z-10">
          <div className="text-center max-w-2xl mb-16">
            <span className="eyebrow block mb-3">Interactive transformation</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary font-sans">
              From messy resume text to clear signals.
            </h2>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              Students write skills in different ways. SortMySkills standardizes the language so your resume and job descriptions can be compared more clearly.
            </p>
          </div>

          {/* Desktop/Tablet side-by-side interactive zone */}
          <div className="w-full grid md:grid-cols-2 gap-8 items-stretch transform-trigger-container">
            {/* Raw resume text panel */}
            <div className="premium-card p-6 flex flex-col justify-between relative bg-surface-card transition-all transform-raw-panel">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase text-text-muted">
                Raw Input Block
              </div>
              <div>
                <h3 className="font-mono text-[10px] text-text-muted uppercase tracking-widest font-bold border-b border-[var(--border-muted)] pb-3 mb-4">
                  01 / Paste plain text
                </h3>
                <p className="text-xs sm:text-sm font-mono text-text-secondary leading-relaxed p-4 rounded-2xl bg-[var(--surface-soft)]/40 border border-[var(--border-muted)] relative select-none">
                  &ldquo;
                  <span className="transition-all duration-500 rounded px-1.5 py-0.5 transform-hl-1">React.js</span>, 
                  <span className="transition-all duration-500 rounded px-1.5 py-0.5 transform-hl-2"> JS</span>, 
                  <span className="transition-all duration-500 rounded px-1.5 py-0.5 transform-hl-3"> Python automation</span>, 
                  <span className="transition-all duration-500 rounded px-1.5 py-0.5 transform-hl-4"> SQL basics</span>, 
                  <span className="transition-all duration-500 rounded px-1.5 py-0.5 transform-hl-5"> docker deployment</span>, and worked with 
                  <span className="transition-all duration-500 rounded px-1.5 py-0.5 transform-hl-6"> APIs</span>
                  &hellip;&rdquo;
                </p>
              </div>
              <div className="mt-8 text-[11px] text-text-muted font-sans border-t border-[var(--border-muted)] pt-3 flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-accent-primary animate-spin-slow" />
                <span>Scroll down to trigger key-phrase standardization</span>
              </div>
            </div>

            {/* Standardized result panel */}
            <div className="premium-card p-6 flex flex-col justify-between bg-surface-card transform-result-panel relative">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-accent-primary/20 bg-accent-primary/5 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase text-accent-primary">
                Parsed Audit View
              </div>
              
              <div>
                <h3 className="font-mono text-[10px] text-text-muted uppercase tracking-widest font-bold border-b border-[var(--border-muted)] pb-3 mb-4">
                  02 / Standardized output
                </h3>

                {/* Sub-block A: Normalized detected tags */}
                <div className="mb-6 transform-step-standardize opacity-0">
                  <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2 font-bold">
                    Detected Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["React", "JavaScript", "Python", "SQL", "Docker", "REST APIs"].map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-lg bg-[var(--surface-soft)] border border-[var(--border-strong)] px-2.5 py-1 text-xs font-mono font-semibold text-text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sub-block B: Gaps and actions */}
                <div className="border-t border-[var(--border-muted)] pt-4 transform-step-gaps opacity-0">
                  <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2 font-bold">
                    Gaps for Target Role
                  </span>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["TypeScript", "Testing", "API integration"].map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs font-mono font-semibold text-red-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2 font-bold">
                    Next Action
                  </span>
                  <div className="rounded-xl bg-accent-primary/5 border border-accent-primary/20 p-3 text-xs text-text-primary font-semibold font-sans leading-relaxed flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                    <span>Build one typed React project with API calls and tests.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[var(--border-muted)] flex justify-between items-center text-[10px] font-mono">
                <span className="text-text-muted">READINESS: 72%</span>
                <Link href="/career-analyser" className="text-accent-primary font-bold hover:underline flex items-center gap-1">
                  <span>Open Analyser</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — INTERACTIVE PRODUCT WORKFLOW */}
      <section id="workflow" className="section-shell border-t border-[var(--border-muted)] bg-[var(--background)] py-24 relative overflow-hidden workflow-reveal-container">
        <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center relative z-10">
          <div className="text-center max-w-2xl mb-16">
            <span className="eyebrow block mb-3">Guided workflow</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary font-sans">
              One workflow. Four answers.
            </h2>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              Bring your resume and a job description. The app turns them into a practical prep plan.
            </p>
          </div>

          {/* Timeline workflow cards wrapper */}
          <div className="w-full relative mt-8 flex flex-col gap-6">
            {/* SVG line tracking progress background */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[var(--border-muted)] hidden sm:block" />
            {/* SVG line tracking filled progress scrub */}
            <div className="absolute left-6 top-6 w-0.5 bg-accent-primary hidden sm:block origin-top transition-transform duration-100 workflow-scrub-line" style={{ height: "0%" }} />

            {[
              {
                step: "01",
                title: "Paste your resume",
                desc: "Use plain text from your resume. The analyser reads visible skills, sections, and signals.",
              },
              {
                step: "02",
                title: "Add a target job",
                desc: "Paste the job description you want to compare against.",
              },
              {
                step: "03",
                title: "Find the gaps",
                desc: "See matched skills, missing skills, readiness estimate, and fixes that matter.",
              },
              {
                step: "04",
                title: "Follow the roadmap",
                desc: "Get a week-by-week plan with verified free resources and interview prep.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="w-full flex items-start gap-6 sm:pl-16 relative workflow-step-card opacity-0"
              >
                {/* Visual bullet marker */}
                <div className="w-8 h-8 rounded-full border-2 border-[var(--border-muted)] bg-[var(--background)] flex items-center justify-center font-mono text-xs font-bold text-text-muted shrink-0 absolute left-2.5 sm:left-2 z-10 transition-colors duration-300 workflow-step-bullet">
                  {item.step}
                </div>

                <div className="premium-card p-6 flex flex-col justify-between w-full bg-surface-card hover:border-accent-primary/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-muted)] pb-3 mb-3">
                    <h3 className="font-bold text-text-primary text-sm tracking-tight font-sans uppercase font-mono">
                      Step {item.step} / {item.title}
                    </h3>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted font-bold">
                      Interactive flow
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center workflow-cta opacity-0">
            <ButtonLink
              href="/career-analyser"
              className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
            >
              <span>Try Career Analyser</span>
              <ArrowRight className="w-4 h-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* SECTION 5 — SKILL GAP VISUAL */}
      <section className="section-shell border-t border-[var(--border-muted)] bg-[var(--surface-card-warm)]/10 py-24 relative overflow-hidden skill-gap-section">
        <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center relative z-10">
          <div className="text-center max-w-2xl mb-16">
            <span className="eyebrow block mb-3">Profile comparison</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary font-sans">
              Know what is missing, not just what is present.
            </h2>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              A resume can look good and still miss the exact skills a role expects. SortMySkills separates matched skills from real gaps.
            </p>
          </div>

          {/* Profile VS Role Side-by-Side compare layout */}
          <div className="w-full grid md:grid-cols-3 gap-6 items-stretch relative compare-cards-container">
            
            {/* Left Card: Resume Shows */}
            <div className="premium-card p-6 flex flex-col justify-between bg-surface-card compare-card-left opacity-0">
              <div>
                <h3 className="font-mono text-[10px] text-text-muted uppercase tracking-widest font-bold border-b border-[var(--border-muted)] pb-3 mb-4 flex justify-between items-center">
                  <span>Your Resume Shows</span>
                  <span className="text-[9px] rounded-md px-1.5 py-0.5 bg-[var(--surface-soft)] font-normal text-text-secondary font-sans tracking-normal">Visible</span>
                </h3>
                <div className="flex flex-col gap-2.5">
                  {["React", "Python", "SQL", "Git", "Docker"].map((skill, idx) => (
                    <div
                      key={idx}
                      id={`left-skill-${skill.toLowerCase()}`}
                      className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/30 px-3.5 py-2 text-xs font-mono font-semibold text-text-secondary flex justify-between items-center"
                    >
                      <span>{skill}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-3 border-t border-[var(--border-muted)] text-[9px] font-mono text-text-muted">
                RAW PROFILE SIGNALS
              </div>
            </div>

            {/* Middle Card: Matched & Missing Gaps */}
            <div className="premium-card p-6 flex flex-col justify-between bg-surface-card compare-card-middle opacity-0 border-accent-primary/20 shadow-md">
              <div>
                <h3 className="font-mono text-[10px] text-accent-primary uppercase tracking-widest font-bold border-b border-[var(--border-muted)] pb-3 mb-4">
                  Gap analysis result
                </h3>

                {/* Sub: Matched */}
                <div className="mb-6">
                  <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2 font-bold">
                    Matched Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Git"].map((skill, idx) => (
                      <span
                        key={idx}
                        id={`middle-match-${skill.toLowerCase()}`}
                        className="inline-flex items-center rounded-lg bg-green-500/10 border border-green-500/20 px-2.5 py-1 text-xs font-mono font-semibold text-green-500"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sub: Missing */}
                <div>
                  <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2 font-bold">
                    Missing Requirements
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["TypeScript", "API integration", "Testing"].map((skill, idx) => (
                      <span
                        key={idx}
                        id={`middle-missing-${skill.toLowerCase().replace(" ", "-")}`}
                        className="inline-flex items-center rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs font-mono font-semibold text-red-500 animate-pulse"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-3 border-t border-[var(--border-muted)] text-[9px] font-mono text-accent-primary font-bold">
                COMPARED READINESS SCORE
              </div>
            </div>

            {/* Right Card: Role Expectation */}
            <div className="premium-card p-6 flex flex-col justify-between bg-surface-card compare-card-right opacity-0">
              <div>
                <h3 className="font-mono text-[10px] text-text-muted uppercase tracking-widest font-bold border-b border-[var(--border-muted)] pb-3 mb-4 flex justify-between items-center">
                  <span>Role expects</span>
                  <span className="text-[9px] rounded-md px-1.5 py-0.5 bg-accent-primary/10 font-bold text-accent-primary font-sans tracking-normal">Target Job</span>
                </h3>
                <div className="flex flex-col gap-2.5">
                  {["React", "TypeScript", "API integration", "Testing", "Git"].map((skill, idx) => (
                    <div
                      key={idx}
                      id={`right-skill-${skill.toLowerCase().replace(" ", "-")}`}
                      className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-soft)]/20 px-3.5 py-2 text-xs font-mono font-semibold text-text-primary flex justify-between items-center"
                    >
                      <span>{skill}</span>
                      <Sparkles className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-3 border-t border-[var(--border-muted)] text-[9px] font-mono text-text-muted">
                TARGET JOB DESCRIPTIONS
              </div>
            </div>
          </div>

          {/* SVG Connection Lines Backdrop Container */}
          <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block skill-svg-container">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path id="svg-line-react" className="stroke-accent-primary stroke-[1.5] fill-none stroke-dasharray-[6] opacity-0" />
              <path id="svg-line-git" className="stroke-accent-primary stroke-[1.5] fill-none stroke-dasharray-[6] opacity-0" />
            </svg>
          </div>

          <div className="mt-12 flex justify-center compare-cta opacity-0">
            <ButtonLink
              href="/career-analyser"
              className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
            >
              <span>Compare a Job Description</span>
              <ArrowRight className="w-4 h-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* SECTION 6 — ROADMAP TIMELINE */}
      <section id="roadmap" className="section-shell border-t border-[var(--border-muted)] bg-[var(--background)] py-24 relative overflow-hidden roadmap-reveal-container">
        <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center relative z-10">
          <div className="text-center max-w-2xl mb-16">
            <span className="eyebrow block mb-3">Practical roadmap</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary font-sans">
              Turn gaps into a weekly plan.
            </h2>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              Roadmaps are generated from your resume, target job, deadline, and focus areas. Resources come from a verified free-resource list — no paywalled links.
            </p>
          </div>

          {/* Vertical draw timeline layout */}
          <div className="w-full max-w-3xl relative mt-8 flex flex-col gap-10">
            {/* SVG line tracking progress background */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[var(--border-muted)] sm:left-1/2 sm:translate-x-[-0.5px]" />
            {/* SVG line tracking filled progress scrub */}
            <div className="absolute left-6 top-6 w-0.5 bg-accent-primary sm:left-1/2 sm:translate-x-[-0.5px] origin-top transition-transform duration-100 roadmap-scrub-line" style={{ height: "0%" }} />

            {[
              {
                num: "01",
                title: "Fix the resume",
                desc: "Make missing skills visible. Improve resume sections, technical wording, and project proof.",
                side: "left",
              },
              {
                num: "02",
                title: "Close the skill gaps",
                desc: "Use verified free resources to learn the exact skills the target role expects.",
                side: "right",
              },
              {
                num: "03",
                title: "Build proof",
                desc: "Create one focused project that demonstrates the missing requirements practically.",
                side: "left",
              },
              {
                num: "04",
                title: "Prepare and apply",
                desc: "Use interview packs and a sharper, gap-filled resume before sending applications.",
                side: "right",
              },
            ].map((phase, idx) => (
              <div
                key={idx}
                className={`w-full flex flex-col sm:flex-row items-start relative roadmap-phase-card opacity-0 ${
                  phase.side === "right" ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Visual bullet marker */}
                <div className="w-8 h-8 rounded-full border-2 border-[var(--border-muted)] bg-[var(--background)] flex items-center justify-center font-mono text-xs font-bold text-text-muted shrink-0 absolute left-2.5 top-0.5 sm:left-1/2 sm:translate-x-[-16px] z-10 transition-colors duration-300 roadmap-phase-bullet">
                  <CheckCircle2 className="w-4 h-4 text-accent-primary opacity-0 transition-opacity duration-300 roadmap-check" />
                </div>

                {/* Content block */}
                <div className={`w-full pl-14 sm:pl-0 sm:w-[calc(50%-2rem)] ${
                  phase.side === "left" ? "sm:text-right sm:pr-8" : "sm:text-left sm:pl-8"
                }`}>
                  <div className="premium-card p-6 bg-surface-card hover:border-accent-primary/30 transition-all text-left">
                    <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider mb-2 font-bold block">
                      Phase {phase.num}
                    </span>
                    <h3 className="font-bold text-text-primary text-sm tracking-tight font-sans mb-2">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      {phase.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center roadmap-cta opacity-0">
            <ButtonLink
              href="/career-analyser"
              className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
            >
              <span>Generate My Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* SECTION 7 — INTERVIEW PREP */}
      <section id="interview-prep" className="section-shell border-t border-[var(--border-muted)] bg-[var(--surface-card-warm)]/10 py-24 relative overflow-hidden interview-reveal-container reveal-section">
        <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center relative z-10">
          <div className="text-center max-w-2xl mb-16">
            <span className="eyebrow block mb-3">Interview practice</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary font-sans">
              Practice after you know the gaps.
            </h2>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              Interview packs are organized by role and difficulty, so preparation does not feel random.
            </p>
          </div>

          {/* Question cards grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch interview-cards-grid">
            {[
              { role: "Frontend", slug: "frontend-engineer", desc: "HTML, CSS, Web APIs, React, Next.js, and browser layout systems." },
              { role: "Backend", slug: "backend-engineer", desc: "APIs, Databases, Caching, Cloud deployment, and System-design cases." },
              { role: "Data Analyst", slug: "data-analyst", desc: "SQL queries, Pandas, Data aggregation, and Metrics reporting cases." },
              { role: "Machine Learning", slug: "ml-engineer", desc: "Model evaluation, Training setups, Features, and TensorFlow." },
              { role: "UX Designer", slug: "ux-designer", desc: "Heuristics, User testing, Spacing systems, and Wireframes." },
              { role: "Product", slug: "product-manager", desc: "A/B testing, Customer retention steps, Stakeholders, and Roadmap planning." },
            ].map((pack, idx) => (
              <div
                key={idx}
                className="premium-card p-6 flex flex-col justify-between bg-surface-card hover-lift transition-all interview-role-card opacity-0 reveal-item"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-3 mb-4">
                    <h3 className="font-bold text-text-primary text-sm tracking-tight font-sans font-mono uppercase">
                      {pack.role}
                    </h3>
                    <BookOpen className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans mb-5">
                    {pack.desc}
                  </p>
                  
                  {/* Difficulty counts pills */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {["Easy (50)", "Medium (50)", "Hard (50)"].map((diff, dIdx) => (
                      <span
                        key={dIdx}
                        className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded border border-[var(--border-muted)] bg-[var(--surface-soft)] text-text-secondary"
                      >
                        {diff}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-muted)] flex justify-between items-center text-[10px] font-mono">
                  <span className="text-text-muted font-bold">150 QUESTIONS</span>
                  <Link
                    href={`/interview-packs/${pack.slug}`}
                    className="text-accent-primary font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Practice Pack</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center interview-cta opacity-0">
            <ButtonLink
              href="/interview-packs"
              className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
            >
              <span>Browse Interview Packs</span>
              <ArrowRight className="w-4 h-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* SECTION 8 — PRIVACY AND TRUST */}
      <section className="section-shell border-t border-[var(--border-muted)] bg-[var(--background)] py-24 relative overflow-hidden trust-reveal-container reveal-section">
        <div className="max-w-6xl mx-auto w-full px-6 flex flex-col items-center relative z-10">
          <div className="text-center max-w-2xl mb-16">
            <span className="eyebrow block mb-3">Transparency & Trust</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary font-sans">
              Your resume data stays under your control.
            </h2>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              Saved analysis helps you continue later. You can delete saved resume, job description, roadmap, and milestone data anytime.
            </p>
          </div>

          {/* Simple non-cringe trust cards grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {[
              {
                title: "No fake resource links",
                desc: "Roadmap resources are matched against a verified local catalog.",
                icon: ShieldCheck,
              },
              {
                title: "No placement guarantees",
                desc: "Readiness scores are estimates to guide preparation, not promises.",
                icon: AlertTriangle,
              },
              {
                title: "Delete saved analysis",
                desc: "Clear your saved resume and job description data from the analyser page.",
                icon: RotateCcw,
              },
              {
                title: "Built for student workflows",
                desc: "The product focuses on resumes, job descriptions, skill gaps, roadmaps, and interview prep.",
                icon: UserCheck,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="premium-card p-6 flex flex-col justify-between bg-surface-card hover-lift transition-all trust-step-card opacity-0 reveal-item"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary mb-4 shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-text-primary text-sm tracking-tight font-sans mb-2 font-mono uppercase text-xs">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION — THEMED CONTACT FORM */}
      <section id="contact" className="section-shell border-t border-[var(--border-muted)] bg-[var(--background)] py-24 relative overflow-hidden contact-reveal-container reveal-section">
        <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
        
        <div className="container-shell grid lg:grid-cols-2 gap-12 items-start relative z-10">
          <div className="reveal-item opacity-0 flex flex-col justify-between h-full">
            <div>
              <span className="eyebrow block mb-3">Contact</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary font-sans leading-tight mb-4">
                Have feedback or want to collaborate?
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed font-sans mb-8">
                Send a quick message. Whether it is a bug, idea, campus use case, or collaboration, I will read it.
              </p>
              
              <div className="space-y-4">
                {[
                  "Direct response within 48 hours",
                  "Open to open-source contributions",
                  "Students & educators priority support",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0 animate-pulse" />
                    <span className="text-xs font-sans font-medium text-text-secondary">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-12 hidden lg:block text-left">
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest font-bold">
                Created with care for student success
              </span>
            </div>
          </div>

          <div className="reveal-item opacity-0">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* SECTION 9 — FINAL CTA */}
      <section className="section-shell border-t border-[var(--border-muted)] bg-[var(--surface-card-warm)]/10 py-24 relative overflow-hidden cta-reveal-container">
        <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />

        <div className="max-w-4xl mx-auto w-full px-6 flex flex-col items-center relative z-10 text-center">
          <div className="rounded-3xl border border-[var(--border-muted)] bg-surface-card p-8 md:p-14 shadow-lg w-full relative overflow-hidden animated-border cta-main-card opacity-0">
            {/* Ambient pattern */}
            <div className="absolute inset-0 dot-grid-overlay opacity-25 pointer-events-none" />

            <span className="eyebrow block mb-3">Start with one resume</span>
            <h2 className="text-2xl md:text-3.5xl font-bold tracking-tight text-text-primary mt-3 font-serif italic mb-4">
              Start with one resume and one job description.
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-4 max-w-lg mx-auto leading-relaxed font-sans mb-8">
              In a few minutes, you will know what matches, what is missing, and what to work on next.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {user ? (
                <>
                  <ButtonLink
                    href="/dashboard"
                    className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </ButtonLink>
                  <ButtonLink
                    href="/career-analyser"
                    variant="secondary"
                    className="px-6 py-3 text-xs font-mono uppercase tracking-widest border border-[var(--border-strong)] rounded-full hover:bg-surface-hover"
                  >
                    Open Career Analyser
                  </ButtonLink>
                </>
              ) : (
                <>
                  <ButtonLink
                    href="/signup"
                    className="px-6 py-3 text-xs font-mono uppercase tracking-widest text-[#F8F3EA] bg-accent-primary hover:bg-accent-primary-dark transition-all rounded-full shadow-md flex items-center gap-1.5"
                  >
                    <span>Start Free Analysis</span>
                    <ArrowRight className="w-4 h-4" />
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

      {/* SECTION 10 — PREMIUM SAAS FOOTER */}
      <footer className="relative z-10 py-12 border-t border-[var(--border-muted)] bg-[var(--background)] text-xs text-text-muted">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Col 1 Brand */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center group">
              <Logo variant="horizontal" className="h-7 w-auto text-text-primary" />
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
              SortMySkills helps students compare their resume with real job descriptions, identify missing skills, and prepare with a clearer plan.
            </p>
          </div>

          {/* Col 2 Workspace */}
          <div className="space-y-3">
            <h4 className="font-mono text-[10px] text-text-primary uppercase tracking-widest font-bold">Workspace</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/career-analyser" className="hover:text-accent-primary transition-colors">
                  Career Analyser
                </Link>
              </li>
              <li>
                <Link href="/skill-development" className="hover:text-accent-primary transition-colors">
                  Skill Roadmap
                </Link>
              </li>
              <li>
                <Link href="/interview-packs" className="hover:text-accent-primary transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-accent-primary transition-colors">
                  Dashboard
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
                  Create Account
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

        {/* Bottom copyright bar */}
        <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-[var(--border-muted)] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <span>SortMySkills © 2026 · Premium Career Intelligence Platform</span>
        </div>
      </footer>
    </div>
  );
}
