import Link from "next/link";
import Logo from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  CheckCircle,
  Code,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-user";
import { signOutAction } from "@/app/actions/auth";
import ThemeControls from "@/components/ThemeControls";
import LandingAnimations from "@/components/landing/LandingAnimations";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] warm-noise-bg overflow-x-hidden relative">
      {/* Background glowing blobs */}
      <div className="warm-glow-effect top-[-200px] left-[-100px]" />
      <div className="warm-glow-effect top-[400px] right-[-200px] opacity-60" />
      <div className="warm-glow-effect bottom-[100px] left-[10%] opacity-50" />

      {/* Client-side animations agent */}
      <LandingAnimations />

      {/* A. Sticky Frosted Header */}
      <header className="sticky top-0 z-40 navbar-fade opacity-0 border-b border-[var(--border-muted)] bg-[var(--background)]/85 backdrop-blur-md transition-all duration-300">
        <div className="flex items-center justify-between px-6 h-16 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Logo className="w-8 h-8 group-hover:rotate-6 transition-transform duration-300" />
              <span className="font-semibold text-text-primary text-base tracking-tight">SortMySkills</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#product-flow" className="text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-accent-green transition-colors">Product</a>
              <a href="#tools-preview" className="text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-accent-green transition-colors">Tools</a>
              <Link href="/interview-packs" className="text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-accent-green transition-colors">Packs</Link>
              <Link href="/dashboard" className="text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-accent-green transition-colors">Roadmap</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeControls />
            {user ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/dashboard"
                  className="text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <form action={signOutAction} className="inline-flex">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-red-400 cursor-pointer transition-colors"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/login"
                  className="text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign In
                </Link>
                <ButtonLink href="/signup" className="h-9 px-4 text-xs font-mono uppercase tracking-widest bg-accent-primary hover:bg-accent-primary/95 text-[#F6F1E8]">
                  Get Started
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* B. Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero Details */}
        <div className="lg:col-span-7 flex flex-col text-left">
          <div className="hero-reveal-eyebrow opacity-0 flex items-center gap-2 mb-4">
            <span className="eyebrow">Career Intelligence for Builders</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
          </div>
          
          <h1 className="hero-reveal-title opacity-0 hero-display text-text-primary leading-[1.05] tracking-tight">
            Turn scattered skills <br/>
            into a clear career <br/>
            <span className="text-serif font-normal italic text-accent-primary">roadmap.</span>
          </h1>

          <p className="hero-reveal-sub opacity-0 mt-6 text-base md:text-lg text-text-secondary leading-relaxed max-w-xl">
            Normalize raw resume skills, perform high-fidelity matching against job descriptions, audit technical gaps, and prepare with 900+ curated interview packs.
          </p>

          <div className="hero-reveal-ctas opacity-0 mt-10 flex flex-wrap gap-4 items-center">
            {user ? (
              <ButtonLink href="/dashboard" className="px-6 py-3 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary">
                Open Dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/signup" className="px-6 py-3 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary">
                  Start Skill Audit <ArrowRight className="w-4 h-4 ml-1" />
                </ButtonLink>
                <ButtonLink href="/login" variant="secondary" className="px-6 py-3 font-mono uppercase tracking-widest border-[var(--border-muted)]">
                  Try Job Match
                </ButtonLink>
              </>
            )}
          </div>

          {/* Trust Status Pills */}
          <div className="hero-reveal-pills opacity-0 mt-12 grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
            {[
              "Local skill parser",
              "900 interview questions",
              "Role-based roadmaps",
              "Supabase auth ready",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-3.5 py-1.5 text-xs text-text-secondary font-medium tracking-tight"
              >
                <CheckCircle className="w-3.5 h-3.5 text-accent-green" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* C. Right Hero Visual: Simulated "Skill Intelligence Engine" */}
        <div className="lg:col-span-5 relative w-full flex justify-center visual-card-reveal opacity-0">
          <div className="w-full max-w-[420px] rounded-2xl border border-[var(--border-muted)] bg-surface-card p-6 shadow-lg relative overflow-hidden animated-border">
            {/* Dot grid decoration inside card */}
            <div className="absolute inset-0 dot-grid-overlay opacity-30 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-[var(--border-muted)] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              </div>
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">
                SKILL_ENGINE_V4.1
              </span>
            </div>

            {/* Simulated Input */}
            <div className="relative z-10 mb-4">
              <span className="block font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">Raw Resume Input</span>
              <div className="rounded-lg bg-[var(--surface-soft)]/60 border border-[var(--border-muted)] p-3 text-xs text-text-secondary font-mono leading-relaxed">
                {"\"Experienced with Kubernetes clustering, writing React web apps, AWS S3 buckets...\""}
              </div>
            </div>

            {/* Visual Transformation Arrow */}
            <div className="relative z-10 flex justify-center my-3 text-accent-primary">
              <div className="w-8 h-8 rounded-full border border-[var(--border-muted)] bg-surface-card flex items-center justify-center animate-pulse">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Simulated Normalized Outputs */}
            <div className="relative z-10 mb-5">
              <span className="block font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">Normalized Output Chips</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: "React.js", bg: "rgba(110, 139, 116, 0.12)", textCol: "var(--accent-green)", cl: "floating-chip-1" },
                  { text: "Kubernetes", bg: "rgba(198, 95, 74, 0.12)", textCol: "var(--accent-primary)", cl: "floating-chip-2" },
                  { text: "AWS Cloud", bg: "rgba(216, 155, 115, 0.15)", textCol: "var(--accent-secondary)", cl: "floating-chip-3" },
                  { text: "DevOps", bg: "rgba(110, 139, 116, 0.12)", textCol: "var(--accent-green)", cl: "visual-tag-stagger opacity-0" },
                  { text: "Cloud Native", bg: "rgba(198, 95, 74, 0.12)", textCol: "var(--accent-primary)", cl: "visual-tag-stagger opacity-0" }
                ].map((chip, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-mono font-medium border border-[var(--border-muted)] ${chip.cl}`}
                    style={{ backgroundColor: chip.bg, color: chip.textCol }}
                  >
                    {chip.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Mini Scorecard and Gap Dial */}
            <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-[var(--border-muted)] pt-4 mt-2">
              <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/40 p-3">
                <span className="block font-mono text-[9px] text-text-muted uppercase">Match Score</span>
                <p className="text-2xl font-bold text-accent-primary mt-1">87%</p>
                <div className="w-full bg-[var(--surface-muted)] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-accent-primary h-full rounded-full" style={{ width: "87%" }} />
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/40 p-3 flex items-center gap-3">
                {/* SVG circular arc */}
                <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="22" cy="22" r="18" stroke="var(--border-muted)" strokeWidth="3" fill="none" />
                    <circle cx="22" cy="22" r="18" stroke="var(--accent-primary)" strokeWidth="3.5" fill="none"
                      strokeDasharray={2 * Math.PI * 18} strokeDashoffset={2 * Math.PI * 18 * 0.25} />
                  </svg>
                  <span className="text-[10px] font-mono font-bold text-text-primary">75%</span>
                </div>
                <div>
                  <span className="block font-mono text-[9px] text-text-muted uppercase">Readiness</span>
                  <p className="text-xs font-semibold text-text-primary mt-0.5">Role Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D. Product Flow Section */}
      <section id="product-flow" className="relative z-10 border-t border-[var(--border-muted)] bg-surface-card/65 backdrop-blur-sm py-20 reveal-section">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="eyebrow reveal-item opacity-0">Engineering Pipeline</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 reveal-item opacity-0">
            Three steps to structured career clarity
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto reveal-item opacity-0">
            A linear path from disorganized technical summaries to focused interview mastery.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-16 text-left relative">
            {[
              {
                num: "01",
                title: "Paste Raw Profile",
                desc: "Paste raw resume text or list of technical skills. Our localized normalizer structures your vocabulary instantly.",
                icon: Layers
              },
              {
                num: "02",
                title: "Compare Against Job",
                desc: "Paste a real job description. We run a localized matrix mapping gap percentages, matching normalizations.",
                icon: Sparkles
              },
              {
                num: "03",
                title: "Placement Preparation",
                desc: "Follow the generated skill development plan recommendations, and practice with 900+ curated interview packs.",
                icon: Zap
              }
            ].map((step, idx) => (
              <div
                key={step.num}
                className="premium-card p-6 flex flex-col justify-between h-full relative group hover:border-accent-primary transition-all duration-300 reveal-item opacity-0"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-4 mb-6">
                    <span className="font-mono text-3xl font-bold text-accent-primary/20 group-hover:text-accent-primary/40 transition-colors">
                      {step.num}
                    </span>
                    <step.icon className="w-5 h-5 text-accent-secondary shrink-0" />
                  </div>
                  <h3 className="font-semibold text-text-primary text-base group-hover:text-accent-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3.5 transform -translate-y-1/2 z-20 text-[var(--border-muted)] bg-[var(--background)] rounded-full border border-[var(--border-muted)] p-1">
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E. Feature Grid Section */}
      <section className="relative z-10 py-24 border-t border-[var(--border-muted)] reveal-section">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="eyebrow reveal-item opacity-0">Platform Overview</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 reveal-item opacity-0">
            Highly focused features, zero fluff
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto reveal-item opacity-0">
            Engineered as a lightweight local tool built to empower placement readiness.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 text-left">
            {[
              {
                icon: Layers,
                title: "Skill Normalization",
                desc: "Translates 60+ complex cloud, coding, and engineering aliases into clear, standardized nodes instantly."
              },
              {
                icon: Sparkles,
                title: "Job Match Score",
                desc: "Localized mathematical matching formulas evaluating resume fit % against any job post without API leaks."
              },
              {
                icon: Compass,
                title: "Missing Skill Roadmaps",
                desc: "Highlights critical technical gaps and pairs them directly with high-end Coursera study bridges."
              },
              {
                icon: BookOpen,
                title: "Interview Question Catalog",
                desc: "Practice with 900 curated mock questions across 6 core roles, categorized cleanly by junior, mid, and senior."
              },
              {
                icon: Code,
                title: "Zero-Data DB Scaffolding",
                desc: "Runs beautifully fully offline on client storage, and locks in database capabilities when Supabase is synced."
              },
              {
                icon: Shield,
                title: "Hardened Security Policies",
                desc: "Robust Postgres trigger sync pipelines and Row-Level Security parameters protecting every dashboard write."
              }
            ].map((feat, idx) => (
              <div
                key={idx}
                className="premium-card p-6 flex flex-col hover:border-accent-primary/40 transition-colors duration-300 reveal-item opacity-0"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--surface-soft)] flex items-center justify-center text-accent-primary mb-4 border border-[var(--border-muted)]">
                  <feat.icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-text-primary text-sm tracking-tight">{feat.title}</h3>
                <p className="text-xs text-text-secondary mt-2.5 leading-relaxed flex-1">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* F. Tool Preview Section */}
      <section id="tools-preview" className="relative z-10 border-t border-[var(--border-muted)] bg-surface-card/65 backdrop-blur-sm py-24 reveal-section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="eyebrow reveal-item opacity-0">Interactive Playground</span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary mt-2 reveal-item opacity-0">
              Four core utilities, instantly ready
            </h2>
            <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto reveal-item opacity-0">
              Click into any workspace tool below to experience local parser normalizations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 reveal-item opacity-0">
            {[
              {
                href: "/skill-development",
                icon: Compass,
                title: "Skill Development Planner",
                desc: "Select standard engineering roles, audit your readiness percentages, and generate a step-by-step roadmap.",
                ui: (
                  <div className="mt-6 border border-[var(--border-muted)] rounded-lg bg-[var(--surface-soft)]/50 p-4 font-mono text-[10px] text-text-secondary space-y-2">
                    <div className="flex justify-between"><span>Full-Stack Web</span> <span className="text-accent-primary">72%</span></div>
                    <div className="w-full bg-[var(--surface-muted)] h-1 rounded-full overflow-hidden">
                      <div className="bg-accent-primary h-full" style={{ width: "72%" }} />
                    </div>
                    <div className="text-[9px] text-text-muted">• Required: React.js, Node.js, REST APIs</div>
                  </div>
                )
              },
              {
                href: "/job-match",
                icon: Briefcase,
                title: "Job Description Matcher",
                desc: "Upload resume and job description texts to receive a precise match percentage and missing core skill lists.",
                ui: (
                  <div className="mt-6 border border-[var(--border-muted)] rounded-lg bg-[var(--surface-soft)]/50 p-4 font-mono text-[10px] text-text-secondary space-y-2">
                    <div className="flex justify-between text-accent-green"><span>Matched Skills:</span> <span>5 / 7</span></div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="bg-accent-green/10 border border-[var(--border-muted)] rounded px-1 text-[8px] text-accent-green">TypeScript</span>
                      <span className="bg-accent-green/10 border border-[var(--border-muted)] rounded px-1 text-[8px] text-accent-green">AWS</span>
                      <span className="bg-red-400/10 border border-red-400/20 rounded px-1 text-[8px] text-red-400">Docker</span>
                    </div>
                  </div>
                )
              },
              {
                href: "/interview-packs",
                icon: BookOpen,
                title: "Placement Interview Packs",
                desc: "Study 900+ structured interview questions, custom-sorted by difficulty levels with verified expert feedback.",
                ui: (
                  <div className="mt-6 border border-[var(--border-muted)] rounded-lg bg-[var(--surface-soft)]/50 p-4 font-mono text-[10px] text-text-secondary space-y-2">
                    <div className="font-semibold text-text-primary text-[11px] mb-1">QA: Kubernetes Pod Lifecycle</div>
                    <p className="text-[9px] text-text-muted leading-snug">Explain the difference between Readiness and Liveness probes in k8s...</p>
                  </div>
                )
              },
              {
                href: "/tools/parser",
                icon: Code,
                title: "Skill Parser Playground",
                desc: "Paste random unstructured profiles, text streams, or keywords to test our normalized cloud/DevOps mapping database.",
                ui: (
                  <div className="mt-6 border border-[var(--border-muted)] rounded-lg bg-[var(--surface-soft)]/50 p-4 font-mono text-[10px] text-text-secondary space-y-2">
                    <div className="text-[9px] text-text-muted">{"Parsed: \"React Native\" →"}</div>
                    <div className="inline-flex rounded bg-accent-secondary/15 text-accent-secondary border border-[var(--border-muted)] px-1.5 py-0.5">Mobile Developer</div>
                  </div>
                )
              }
            ].map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className="premium-card p-6 flex flex-col justify-between hover:border-accent-primary transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-soft)] flex items-center justify-center text-accent-primary border border-[var(--border-muted)] group-hover:text-[#F6F1E8] group-hover:bg-accent-primary transition-colors">
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-text-primary text-sm tracking-tight group-hover:text-accent-primary transition-colors">{tool.title}</h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{tool.desc}</p>
                </div>
                {tool.ui}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* G. Final CTA Section */}
      <section className="relative z-10 py-24 border-t border-[var(--border-muted)] reveal-section">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-2xl border border-[var(--border-muted)] bg-surface-card p-8 md:p-12 shadow-lg relative overflow-hidden animated-border reveal-item opacity-0">
            {/* Ambient background accent */}
            <div className="absolute inset-0 dot-grid-overlay opacity-30 pointer-events-none" />

            <span className="eyebrow">Unlock Placement Readiness</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mt-3 font-serif italic">
              Build your placement roadmap today.
            </h2>
            <p className="text-sm text-text-secondary mt-4 max-w-md mx-auto leading-relaxed">
              Join students and graduates using SortMySkills to structure their learning, audit their competencies, and pass their tech placement evaluations.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {user ? (
                <ButtonLink href="/dashboard" className="px-6 py-3 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary">
                  Open Dashboard
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink href="/signup" className="px-6 py-3 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary">
                    Get Started Now
                  </ButtonLink>
                  <ButtonLink href="/login" variant="secondary" className="px-6 py-3 font-mono uppercase tracking-widest border-[var(--border-muted)]">
                    Sign In
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t border-[var(--border-muted)] bg-[var(--background)]/90 text-center text-xs text-text-muted">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5 opacity-70" />
            <span className="font-medium tracking-tight text-text-secondary">SortMySkills</span>
          </div>
          <span>SortMySkills © 2026 · Made for Technical Careers</span>
        </div>
      </footer>
    </div>
  );
}
