"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock, Languages, Send } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Translation {
  roleTitle: string;
  whatTheyActuallyWant: string;
  whatYouWillActuallyDo: string[];
  experienceTranslation: string;
  theMustHaveSkill: string;
  theNiceToHaves: string[];
  salaryHonesty: string;
  companyVibe: string;
  redFlags: string[];
  greenFlags: string[];
  shouldYouApply: "yes" | "no" | "maybe";
  shouldYouApplyReason: string;
  theHonestSummary: string;
}

type PageState = "input" | "confirming" | "loading" | "results";

// ── Sample JD ────────────────────────────────────────────────────────────────

const SAMPLE_JD = `Frontend Engineer at GrowthOS. We are looking for a passionate Frontend Engineer to join our cross-functional team and synergize our product delivery pipeline. You will collaborate with stakeholders across design, product, and engineering to deliver high-impact scalable solutions. Responsibilities include driving development of responsive web applications, collaborating with designers to translate Figma designs into pixel-perfect implementations, participating in agile ceremonies, championing engineering best practices, and mentoring junior team members. Requirements: 3 to 5 years professional frontend experience, strong proficiency in React and JavaScript ES6, TypeScript preferred, REST APIs and GraphQL experience, Tailwind CSS or CSS-in-JS, Jest and Cypress, Bachelor degree in CS or equivalent. Nice to have: Next.js, AWS, open source contributions. Salary: Competitive based on experience. Location: Bangalore hybrid 3 days in office.`;

const LOADING_MESSAGES = [
  "Reading between the lines",
  "Cutting through the corporate speak",
  "Finding what they actually mean",
  "Almost done",
];

// ── Component ────────────────────────────────────────────────────────────────

export default function JDTranslatorPage() {
  const [pageState, setPageState] = useState<PageState>("input");
  const [jdText, setJdText] = useState("");
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  // Rate-limit countdown
  const [rateLimited, setRateLimited] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  // ── Loading message cycle ────────────────────────────────────────────────
  useEffect(() => {
    if (pageState !== "loading") return;
    setLoadingMsgIdx(0);
    setProgressWidth(0);

    const msgInterval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    // Animate progress bar
    const progInterval = setInterval(() => {
      setProgressWidth((prev) => {
        if (prev >= 92) return prev;
        return prev + Math.random() * 8;
      });
    }, 400);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, [pageState]);

  // ── Rate-limit countdown timer ───────────────────────────────────────────
  useEffect(() => {
    if (!rateLimited || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setRateLimited(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimited, countdown]);

  // ── Scroll confirmation panel into view ──────────────────────────────────
  useEffect(() => {
    if (pageState === "confirming" && confirmRef.current) {
      confirmRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [pageState]);

  // ── Format countdown ─────────────────────────────────────────────────────
  const formatCountdown = (secs: number): string => {
    if (secs >= 60) {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m} minute${m !== 1 ? "s" : ""} and ${s} second${s !== 1 ? "s" : ""} remaining`;
    }
    return `${secs} second${secs !== 1 ? "s" : ""} remaining`;
  };

  // ── API call ─────────────────────────────────────────────────────────────
  const callTranslateApi = useCallback(async () => {
    setPageState("loading");
    setError(null);

    try {
      const res = await fetch("/api/jd-translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jdText }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setRateLimited(true);
        setCountdown(data.remainingSeconds ?? 600);
        setPageState("input");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setPageState("input");
        return;
      }

      setTranslation(data.translation);
      setProgressWidth(100);
      // Small delay so progress bar hits 100% visually
      setTimeout(() => setPageState("results"), 300);
    } catch {
      setError("Network error. Check your connection and try again.");
      setPageState("input");
    }
  }, [jdText]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleTranslateClick = () => {
    if (!jdText.trim() || jdText.length < 100) {
      setError("Paste at least 100 characters of a job description.");
      return;
    }
    setError(null);
    setPageState("confirming");
  };

  const handleConfirm = () => {
    callTranslateApi();
  };

  const handleGoBack = () => {
    setPageState("input");
  };

  const handleReset = () => {
    setJdText("");
    setTranslation(null);
    setError(null);
    setPageState("input");
  };

  const handleLoadSample = () => {
    setJdText(SAMPLE_JD);
    setError(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  // ── Verdict color helper ─────────────────────────────────────────────────
  const verdictColor = (v: string) => {
    if (v === "yes") return "text-green-500";
    if (v === "no") return "text-red-500";
    return "text-amber-500";
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <PageHeader
        title="JD Translator"
        description="Paste any job description. Get the honest version."
      />

      {/* ── Rate-limit warning card ─────────────────────────────────────── */}
      {rateLimited && (
        <Card className="mb-6 border-amber-500/40 bg-amber-500/[0.04]">
          <CardBody className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  You have used all 3 translations for this 10 minute window.
                </p>
                <p className="text-xs text-text-secondary mt-2 font-mono tabular-nums">
                  {formatCountdown(countdown)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── Generic error ───────────────────────────────────────────────── */}
      {error && !rateLimited && (
        <Card className="mb-6 border-red-500/30 bg-red-500/[0.04]">
          <CardBody className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── INPUT STATE ─────────────────────────────────────────────────── */}
      {(pageState === "input" || pageState === "confirming") && (
        <Card>
          <CardBody className="pt-6 space-y-5">
            <textarea
              ref={textareaRef}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              disabled={pageState === "confirming" || rateLimited}
              placeholder="Paste the full job description here. The longer the better."
              className="w-full min-h-[220px] rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4 text-sm font-mono text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent-green/30 focus:border-accent-green/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleLoadSample}
                disabled={pageState === "confirming" || rateLimited}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--border-muted)] px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-[var(--accent-primary)] hover:bg-surface-hover transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                <Languages className="w-4 h-4" />
                Try a sample JD
              </button>

              <Button
                onClick={handleTranslateClick}
                disabled={pageState === "confirming" || rateLimited || !jdText.trim()}
                className="flex-1"
              >
                <Send className="w-4 h-4" />
                Translate this JD
              </Button>
            </div>

            {/* ── CONFIRMATION PANEL ──────────────────────────────────────── */}
            {pageState === "confirming" && (
              <div
                ref={confirmRef}
                className="mt-2 rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-5 space-y-4 animate-[fadeSlideIn_0.3s_ease-out]"
                style={{
                  animation: "fadeSlideIn 0.3s ease-out forwards",
                }}
              >
                <div>
                  <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                    Preview of your JD
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed bg-[var(--surface-card)] border border-[var(--border-muted)] rounded-lg p-3 font-mono">
                    {jdText.slice(0, 200).trim()}
                    {jdText.length > 200 ? "…" : ""}
                  </p>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed">
                  This will use{" "}
                  <span className="font-semibold text-text-primary">1 of your 3 translations</span>{" "}
                  for this 10 minute window. Make sure this is the right JD before confirming.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-muted)] bg-transparent px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go back
                  </button>
                  <Button onClick={handleConfirm}>
                    <CheckCircle2 className="w-4 h-4" />
                    Yes, translate it
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* ── LOADING STATE ───────────────────────────────────────────────── */}
      {pageState === "loading" && (
        <Card>
          <CardBody className="pt-6 space-y-6">
            {/* Animated progress bar */}
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-soft)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transition-all duration-500 ease-out"
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            <div className="flex items-center justify-center py-12">
              <p className="text-base text-text-secondary font-medium animate-pulse">
                {LOADING_MESSAGES[loadingMsgIdx]}…
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── RESULTS STATE ───────────────────────────────────────────────── */}
      {pageState === "results" && translation && (
        <div className="space-y-4">
          {/* Card 1 — Role Title */}
          <Card>
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                What this role actually is
              </p>
              <p className="text-2xl font-bold text-text-primary tracking-tight">
                {translation.roleTitle}
              </p>
            </CardBody>
          </Card>

          {/* Card 2 — What they actually want */}
          <Card>
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                What they actually want
              </p>
              <p className="text-base text-text-primary leading-relaxed">
                {translation.whatTheyActuallyWant}
              </p>
            </CardBody>
          </Card>

          {/* Card 3 — What you will actually do */}
          <Card>
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">
                What you will actually do
              </p>
              <div className="space-y-2.5">
                {translation.whatYouWillActuallyDo.map((item, i) => (
                  <p
                    key={i}
                    className="text-sm text-text-secondary leading-relaxed pl-0 py-1.5 border-b border-[var(--border-muted)] last:border-b-0"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Card 4 — Experience translation */}
          <Card>
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Experience requirement translated
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {translation.experienceTranslation}
              </p>
            </CardBody>
          </Card>

          {/* Card 5 — Must-have skill (red left border) */}
          <Card className="border-l-4 border-l-red-500">
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                The one skill that will get you rejected
              </p>
              <p className="text-base font-bold text-text-primary">
                {translation.theMustHaveSkill}
              </p>
            </CardBody>
          </Card>

          {/* Card 6 — Nice to haves */}
          <Card>
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">
                Negotiable skills
              </p>
              <div className="flex flex-wrap gap-2">
                {translation.theNiceToHaves.map((item, i) => (
                  <span
                    key={i}
                    className="inline-block rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs text-text-secondary font-mono"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Card 7 — Salary honesty */}
          <Card>
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Salary honesty
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {translation.salaryHonesty}
              </p>
            </CardBody>
          </Card>

          {/* Card 8 — Company vibe */}
          <Card>
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">
                Company vibe
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {translation.companyVibe}
              </p>
            </CardBody>
          </Card>

          {/* Card 9 — Red flags */}
          <Card>
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">
                Red flags
              </p>
              {translation.redFlags.length > 0 ? (
                <div className="space-y-2">
                  {translation.redFlags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 dark:text-red-400">{flag}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted italic">
                  No obvious red flags in this one.
                </p>
              )}
            </CardBody>
          </Card>

          {/* Card 10 — Green flags */}
          <Card>
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">
                Green flags
              </p>
              {translation.greenFlags.length > 0 ? (
                <div className="space-y-2">
                  {translation.greenFlags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-green-600 dark:text-green-400">{flag}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted italic">
                  Nothing stood out as particularly good either.
                </p>
              )}
            </CardBody>
          </Card>

          {/* Card 11 — THE VERDICT */}
          <Card className="border-2 border-[var(--accent-primary)]/30">
            <CardBody className="pt-8 pb-8 text-center">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">
                The Verdict
              </p>
              <p
                className={`text-6xl sm:text-7xl font-black tracking-tighter uppercase ${verdictColor(
                  translation.shouldYouApply
                )}`}
              >
                {translation.shouldYouApply}
              </p>
              <p className="text-sm text-text-secondary mt-4 max-w-lg mx-auto leading-relaxed">
                {translation.shouldYouApplyReason}
              </p>
            </CardBody>
          </Card>

          {/* Card 12 — Honest summary */}
          <Card className="bg-[var(--surface-soft)]">
            <CardBody className="pt-6">
              <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">
                The honest summary
              </p>
              <p className="text-base text-text-primary leading-relaxed">
                {translation.theHonestSummary}
              </p>
            </CardBody>
          </Card>

          {/* Reset button */}
          <div className="flex justify-center pt-4 pb-8">
            <Button variant="secondary" onClick={handleReset}>
              <Languages className="w-4 h-4" />
              Translate another JD
            </Button>
          </div>
        </div>
      )}

      {/* ── Inline keyframe for confirmation panel entrance ──────────────── */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
