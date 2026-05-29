import Link from "next/link";
import Logo from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, BookOpen, Briefcase, Compass } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="flex items-center justify-between px-6 h-16 max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="w-8 h-8" />
          <span className="font-semibold text-text-primary">SortMySkills</span>
        </Link>
        <ButtonLink href="/dashboard">Open dashboard</ButtonLink>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary leading-tight">
          Learn with direction, not volume
        </h1>
        <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-xl">
          Normalize skills from resumes and job posts, measure gaps, plan study paths,
          and practice with curated interview questions — in one workspace.
        </p>
        <div className="mt-10">
          <ButtonLink href="/dashboard" className="px-6 py-3">
            Go to dashboard <ArrowRight className="w-4 h-4" />
          </ButtonLink>
        </div>

        <div className="mt-20 grid sm:grid-cols-3 gap-6 w-full max-w-2xl text-left">
          {[
            {
              icon: Compass,
              title: "Skill planner",
              desc: "Target a role and see readiness vs required skills.",
              href: "/skill-development",
            },
            {
              icon: Briefcase,
              title: "Job match",
              desc: "Compare resume text to a job description.",
              href: "/job-match",
            },
            {
              icon: BookOpen,
              title: "Interview packs",
              desc: "900 questions across six technical roles.",
              href: "/interview-packs",
            },
          ].map(({ icon: Icon, title, desc, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-[var(--border-muted)] p-5 hover:bg-surface-hover transition-colors"
            >
              <Icon className="w-5 h-5 text-accent-green mb-3" />
              <h2 className="font-medium text-text-primary">{title}</h2>
              <p className="text-sm text-text-secondary mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-text-secondary">
        SortMySkills © 2026
      </footer>
    </div>
  );
}
