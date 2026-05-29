"use client";

import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock, AlertTriangle, ArrowLeft, Copy, Check } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface DiagnosisResult {
  diagnosis: {
    rootCause: string;
    evidence: string;
    severity: "critical" | "major" | "minor";
    category: string;
  };
  theFix: {
    whatToChange: string;
    exactWording: string;
    timeToFix: string;
  };
  competitiveness: {
    rating: "not_competitive" | "slightly_competitive" | "competitive" | "very_competitive";
    honest: string;
    theirAdvantage: string;
  };
  oneMoreThing: string;
}

type PageState = "input" | "loading" | "results";

const LOADING_MESSAGES = [
  "Reading your resume...",
  "Comparing to the job...",
  "Finding the real reason...",
  "Writing the diagnosis...",
];

// ── Component ────────────────────────────────────────────────────────────────

export default function WhyNoReplyPage() {
  const [pageState, setPageState] = useState<PageState>("input");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  
  // Error handling states
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Clipboard copy state
  const [copied, setCopied] = useState(false);

  // Cycling messages state
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [loadingOpacity, setLoadingOpacity] = useState(1);

  // ── Loading Messages Cycle ──
  useEffect(() => {
    if (pageState !== "loading") return;
    setLoadingMsgIdx(0);
    setLoadingOpacity(1);

    const interval = setInterval(() => {
      // Fade out
      setLoadingOpacity(0);
      
      // Update text and fade back in after transition completes
      setTimeout(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setLoadingOpacity(1);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, [pageState]);

  // ── Rate-limit Countdown Timer ──
  useEffect(() => {
    if (!rateLimited || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimited, countdown]);

  // ── Format Countdown ──
  const formatCountdown = (secs: number): string => {
    if (secs >= 60) {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m} minute${m !== 1 ? "s" : ""} and ${s} second${s !== 1 ? "s" : ""} remaining`;
    }
    return `${secs} second${secs !== 1 ? "s" : ""} remaining`;
  };

  // ── Clipboard Copy Handler ──
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── API Submission ──
  const handleSubmit = useCallback(async () => {
    if (jobDescription.length < 100 || resumeText.length < 100) {
      setError("Please paste the full job description and your complete resume.");
      return;
    }

    setPageState("loading");
    setError(null);

    try {
      const res = await fetch("/api/why-no-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, resumeText }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setRateLimited(true);
        setCountdown(data.remainingSeconds ?? 900); // Default to 15 min if undefined
        setPageState("input");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setPageState("input");
        return;
      }

      setResult(data.result);
      setPageState("results");
    } catch {
      setError("Network error. Check your connection and try again.");
      setPageState("input");
    }
  }, [jobDescription, resumeText]);

  const handleReset = () => {
    setJobDescription("");
    setResumeText("");
    setResult(null);
    setError(null);
    setPageState("input");
  };

  // ── Severity Pill Styling ──
  const renderSeverityPill = (severity: "critical" | "major" | "minor") => {
    let styleClasses = "";
    let label = "";

    switch (severity) {
      case "critical":
        styleClasses = "border-danger text-danger";
        label = "Critical issue";
        break;
      case "major":
        styleClasses = "border-warning text-warning";
        label = "Major issue";
        break;
      case "minor":
        styleClasses = "border-[var(--border-strong)] text-text-secondary";
        label = "Minor issue";
        break;
    }

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border bg-transparent ${styleClasses}`}>
        {label}
      </span>
    );
  };

  // ── Competitiveness Rating Styling ──
  const renderRating = (rating: "not_competitive" | "slightly_competitive" | "competitive" | "very_competitive") => {
    switch (rating) {
      case "not_competitive":
        return <span className="text-danger">Not competitive</span>;
      case "slightly_competitive":
        return <span className="text-warning">Slightly competitive</span>;
      case "competitive":
        return <span className="text-success">Competitive</span>;
      case "very_competitive":
        return <span className="text-success font-bold">Very competitive</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      {/* Page Header */}
      {pageState !== "results" && (
        <PageHeader
          title="Why No Reply"
          description="Paste a job and your resume. Find out the real reason you are not hearing back."
        />
      )}

      {/* ── Rate limit countdown warning card ── */}
      {rateLimited && pageState === "input" && (
        <Card className="mb-6 border-warning/40 bg-warning/[0.04]">
          <CardBody className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">
                  {countdown > 0 
                    ? "3 diagnoses per 15 minutes. Read the feedback you already have." 
                    : "Rate limit reset."}
                </p>
                <p className={`text-xs font-mono mt-2 ${countdown > 0 ? "text-text-secondary" : "text-success font-semibold"}`}>
                  {countdown > 0 ? formatCountdown(countdown) : "You are good to go."}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── Generic validation/API errors ── */}
      {error && pageState === "input" && (
        <Card className="mb-6 border-danger/30 bg-danger/[0.04]">
          <CardBody className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── INPUT STATE ── */}
      {pageState === "input" && (
        <Card>
          <CardBody className="pt-6 space-y-6">
            {/* Job Description Textarea */}
            <div>
              <label htmlFor="jd-input" className="block text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
                Job Description
              </label>
              <textarea
                id="jd-input"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={rateLimited && countdown > 0}
                placeholder="Paste the full job description here."
                className="w-full min-h-[180px] rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4 text-sm font-mono text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Resume Textarea */}
            <div>
              <label htmlFor="resume-input" className="block text-[11px] font-mono uppercase tracking-widest text-text-muted mb-2">
                Your Resume
              </label>
              <textarea
                id="resume-input"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={rateLimited && countdown > 0}
                placeholder="Paste your complete resume as plain text. Include everything — education, projects, skills, experience."
                className="w-full min-h-[200px] rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4 text-sm font-mono text-text-primary placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Action Area */}
            <div className="pt-2 border-t border-[var(--border-muted)] flex items-center justify-between gap-4">
              <span className="text-xs font-mono text-text-muted">
                3 free diagnoses per 15 minutes
              </span>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={rateLimited && countdown > 0}
                className="px-6 py-2.5 font-medium transition-all"
              >
                Diagnose →
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── LOADING STATE ── */}
      {pageState === "loading" && (
        <Card>
          <CardBody className="py-16">
            <div className="flex items-center justify-center h-12">
              <p
                style={{
                  opacity: loadingOpacity,
                  transition: "opacity 300ms ease-in-out",
                }}
                className="text-base text-text-secondary font-medium tracking-wide"
              >
                {LOADING_MESSAGES[loadingMsgIdx]}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── RESULTS STATE ── */}
      {pageState === "results" && result && (
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={handleReset}
            className="group inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Diagnose another
          </button>

          {/* Section 1 — The Diagnosis */}
          <Card>
            <CardBody className="pt-6 space-y-4">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                why you got no reply
              </span>
              <h2 className="text-[20px] font-medium text-text-primary leading-[1.5]">
                {result.diagnosis.rootCause}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {result.diagnosis.evidence}
              </p>
              <div className="pt-1">
                {renderSeverityPill(result.diagnosis.severity)}
              </div>
            </CardBody>
          </Card>

          {/* Section 2 — The Fix */}
          <Card>
            <CardBody className="pt-6 space-y-4">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                what to do about it
              </span>
              <p className="text-sm text-text-primary leading-relaxed">
                {result.theFix.whatToChange}
              </p>
              
              {/* Monospace Codeblock copy widget */}
              <div className="relative rounded-lg bg-[var(--surface-soft)] border-l-3 border-accent-primary p-4 pr-16 font-mono text-[13px] leading-[1.7] text-text-primary whitespace-pre-wrap">
                {result.theFix.exactWording}
                <button
                  type="button"
                  onClick={() => handleCopy(result.theFix.exactWording)}
                  className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-text-muted hover:text-text-primary border border-[var(--border-muted)] rounded px-2.5 py-1 bg-[var(--surface-card)] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span>Copied ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-muted pt-1">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Time to fix: {result.theFix.timeToFix}</span>
              </div>
            </CardBody>
          </Card>

          {/* Section 3 — How Competitive Are You */}
          <Card>
            <CardBody className="pt-6 space-y-4">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                honest assessment
              </span>
              <div className="text-[18px] font-medium tracking-tight">
                {renderRating(result.competitiveness.rating)}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {result.competitiveness.honest}
              </p>
              
              {/* Distinct inset box for advantage */}
              <div className="rounded-lg bg-accent-secondary/[0.06] border border-[var(--border-muted)] p-4 text-sm text-text-primary flex items-start gap-2">
                <span className="text-accent-primary font-semibold shrink-0">→</span>
                <span>{result.competitiveness.theirAdvantage}</span>
              </div>
            </CardBody>
          </Card>

          {/* Section 4 — One More Thing */}
          <Card>
            <CardBody className="pt-6 space-y-3">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-text-muted">
                recruiter would also notice
              </span>
              <p className="text-sm italic text-text-secondary leading-relaxed">
                {result.oneMoreThing}
              </p>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
