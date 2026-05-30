"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import { getInterviewPackBySlug } from "@/data/interview-packs";
import type { QuestionDifficulty } from "@/data/interview-packs";
import { ArrowLeft } from "lucide-react";

const FILTERS: { id: "all" | QuestionDifficulty; label: string }[] = [
  { id: "all", label: "All Questions" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

export default function InterviewPackDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const pack = getInterviewPackBySlug(slug);
  const [filter, setFilter] = useState<"all" | QuestionDifficulty>("all");

  const filtered = useMemo(() => {
    if (!pack) return [];
    if (filter === "all") return pack.questions;
    return pack.questions.filter((q) => q.difficulty === filter);
  }, [pack, filter]);

  if (!pack) {
    return (
      <div className="space-y-6 py-12 text-center animate-fade-in">
        <p className="text-text-secondary font-mono text-sm uppercase tracking-wider">Pack not found.</p>
        <Link href="/interview-packs" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-accent-primary hover:underline font-bold mt-4">
          <ArrowLeft className="w-3.5 h-3.5" /> All Packs
        </Link>
      </div>
    );
  }

  const difficultyColors = (difficulty: QuestionDifficulty) => {
    const styles = {
      easy: "bg-accent-green/10 text-accent-green border-accent-green/20",
      medium: "bg-accent-secondary/15 text-accent-secondary border-accent-secondary/25",
      hard: "bg-accent-primary/10 text-accent-primary border-accent-primary/20",
    };
    return styles[difficulty];
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      {/* Back to catalog link */}
      <Link
        href="/interview-packs"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-accent-primary transition-all duration-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Packs
      </Link>

      <PageHeader title={pack.title} description={pack.description} />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-muted)] pb-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
              filter === f.id
                ? "bg-accent-primary/15 border-accent-primary/45 text-text-primary font-bold shadow-xs scale-[1.03]"
                : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover/80 hover:scale-[1.01]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <ol className="space-y-4">
        {filtered.map((q) => (
          <li
            key={q.id}
            className="premium-card p-5 flex gap-5 relative group hover:border-accent-primary/30 transition-colors"
          >
            {/* Number badge */}
            <span className="text-sm font-mono font-bold text-text-muted w-8 shrink-0 flex items-center justify-center border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 rounded-lg h-9">
              {q.id}
            </span>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between gap-4">
                <span className={`text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 border rounded ${difficultyColors(q.difficulty)}`}>
                  {q.difficulty}
                </span>
                <span className="font-mono text-[8px] text-text-muted tracking-widest">QUESTION_MD</span>
              </div>
              <p className="text-sm text-text-primary leading-relaxed">{q.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
