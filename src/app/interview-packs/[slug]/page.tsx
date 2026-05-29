"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getInterviewPackBySlug } from "@/data/interview-packs";
import type { QuestionDifficulty } from "@/data/interview-packs";
import { ArrowLeft } from "lucide-react";

const FILTERS: { id: "all" | QuestionDifficulty; label: string }[] = [
  { id: "all", label: "All" },
  { id: "easy", label: "Easy (1–35)" },
  { id: "medium", label: "Medium (36–70)" },
  { id: "hard", label: "Hard (71–100)" },
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
      <div className="min-h-screen bg-bg-dark text-text-primary pt-24 px-6">
        <Navbar />
        <p className="font-mono text-sm text-text-secondary">Pack not found.</p>
        <Link href="/interview-packs" className="text-accent-green text-xs font-mono mt-4 inline-block">
          ← Back to packs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen dot-grid-overlay bg-bg-dark text-text-primary pt-24 pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 z-10 relative">
        <Link
          href="/interview-packs"
          className="inline-flex items-center gap-1 text-[10px] font-mono text-text-secondary hover:text-accent-green uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All packs
        </Link>

        <header className="mb-10 fine-border-b pb-8">
          <span className="mono-tag text-accent-cyan block mb-2">{pack.totalQuestions} QUESTIONS</span>
          <h1 className="text-3xl font-light tracking-tight">{pack.title}</h1>
          <p className="text-text-secondary text-sm mt-2 leading-relaxed">{pack.description}</p>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider fine-line transition-all ${
                filter === f.id
                  ? "bg-accent-green text-bg-dark border-accent-green font-bold"
                  : "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover"
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
              className="p-4 bg-surface-card/35 fine-line flex gap-4 items-start"
            >
              <span className="font-mono text-[10px] text-text-secondary shrink-0 w-8">
                {String(q.id).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <span
                  className={`inline-block px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider mb-2 fine-line ${
                    q.difficulty === "easy"
                      ? "text-accent-green"
                      : q.difficulty === "medium"
                        ? "text-accent-cyan"
                        : "text-text-primary"
                  }`}
                >
                  {q.difficulty}
                </span>
                <p className="text-sm text-text-primary leading-relaxed">{q.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
