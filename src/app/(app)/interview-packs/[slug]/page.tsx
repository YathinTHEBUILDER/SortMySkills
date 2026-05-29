"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import { getInterviewPackBySlug } from "@/data/interview-packs";
import type { QuestionDifficulty } from "@/data/interview-packs";
import { ArrowLeft } from "lucide-react";

const FILTERS: { id: "all" | QuestionDifficulty; label: string }[] = [
  { id: "all", label: "All" },
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
      <div>
        <p className="text-text-secondary">Pack not found.</p>
        <Link href="/interview-packs" className="text-accent-green text-sm mt-4 inline-block">
          ← All packs
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/interview-packs"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent-green mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> All packs
      </Link>

      <PageHeader title={pack.title} description={pack.description} />

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === f.id
                ? "bg-accent-green text-bg-dark font-medium"
                : "text-text-secondary hover:bg-surface-hover"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ol className="space-y-3">
        {filtered.map((q) => (
          <li
            key={q.id}
            className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-card)] px-5 py-4 flex gap-4"
          >
            <span className="text-sm text-text-secondary font-mono w-8 shrink-0">
              {q.id}
            </span>
            <div>
              <span className="text-xs uppercase tracking-wide text-text-secondary">
                {q.difficulty}
              </span>
              <p className="text-sm text-text-primary mt-1 leading-relaxed">{q.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
