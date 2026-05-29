"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { INTERVIEW_PACKS } from "@/data/interview-packs";
import { ArrowRight, BookOpen } from "lucide-react";

export default function InterviewPacksPage() {
  return (
    <div className="min-h-screen dot-grid-overlay bg-bg-dark text-text-primary pt-24 pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 z-10 relative">
        <div className="mb-12 fine-border-b pb-8">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-accent-green" />
            <span className="mono-tag text-accent-green">SKILLQORE — INTERVIEW BANK</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight">Interview Question Packs</h1>
          <p className="text-text-secondary text-sm max-w-2xl mt-2 leading-relaxed">
            Comprehensive interview preparation banks aligned with real-world hiring expectations.
            Each role contains 100 curated questions split into Easy, Medium, and Hard — conceptual,
            scenario-based, and system-thinking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INTERVIEW_PACKS.map((pack) => {
            const easy = pack.questions.filter((q) => q.difficulty === "easy").length;
            const medium = pack.questions.filter((q) => q.difficulty === "medium").length;
            const hard = pack.questions.filter((q) => q.difficulty === "hard").length;

            return (
              <Link
                key={pack.id}
                href={`/interview-packs/${pack.slug}`}
                className="group p-6 bg-surface-card/40 fine-line hover:bg-surface-card/70 hover:border-text-secondary/30 transition-all flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <span className="mono-tag text-accent-cyan block mb-2">100 QUESTIONS</span>
                  <h2 className="text-xl font-light text-text-primary group-hover:text-accent-green transition-colors">
                    {pack.title}
                  </h2>
                  <p className="text-text-secondary text-xs mt-2 leading-relaxed">{pack.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-3 text-[10px] font-mono text-text-secondary">
                    <span>EASY {easy}</span>
                    <span>MED {medium}</span>
                    <span>HARD {hard}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-accent-green uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Open pack <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
