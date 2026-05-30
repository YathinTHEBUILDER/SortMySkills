"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT;
  
  // Endpoint is valid only if configured and is not the default placeholder
  const isConfigured = 
    !!FORMSPREE_ENDPOINT && 
    FORMSPREE_ENDPOINT !== "" && 
    FORMSPREE_ENDPOINT !== "https://formspree.io/f/your-form-id";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConfigured) return;
    
    // Honeypot field validation (protect from simple bots)
    if (gotcha) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: "New SortMySkills Landing Page Message",
        }),
      });

      if (response.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting Formspree contact form:", error);
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-3xl border border-[var(--border-muted)] bg-surface-card p-6 md:p-8 shadow-lg relative overflow-hidden animated-border contact-grid-glow">
      <div className="absolute inset-0 dot-grid-overlay opacity-20 pointer-events-none" />

      {status === "success" ? (
        <div className="relative z-10 py-12 text-center" aria-live="polite">
          <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-text-primary text-lg mb-2 font-sans">Message sent!</h3>
          <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
            Message sent. I&apos;ll get back to you soon.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 text-xs font-mono uppercase tracking-widest text-accent-primary hover:underline font-bold cursor-pointer"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative z-10 space-y-5" aria-live="polite">
          {/* Honeypot field (hidden from screen reader and users, but caught by spam bots) */}
          <input
            type="text"
            name="_gotcha"
            value={gotcha}
            onChange={(e) => setGotcha(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="space-y-1.5 text-left">
            <label htmlFor="contact-name" className="block font-mono text-[9px] text-text-muted uppercase tracking-wider font-bold">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              disabled={status === "submitting" || !isConfigured}
              className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 transition-all disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="contact-email" className="block font-mono text-[9px] text-text-muted uppercase tracking-wider font-bold">
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={status === "submitting" || !isConfigured}
              className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 transition-all disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="contact-message" className="block font-mono text-[9px] text-text-muted uppercase tracking-wider font-bold">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me about your feedback, bug reports, or ideas..."
              required
              disabled={status === "submitting" || !isConfigured}
              rows={4}
              className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 transition-all disabled:opacity-50 min-h-[140px] resize-y"
            />
          </div>

          {status === "error" && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 flex items-start gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-red-500 leading-normal">
                Couldn&apos;t send the message. Please try again.
              </span>
            </div>
          )}

          {!isConfigured && (
            <div className="rounded-xl bg-[var(--surface-soft)] border border-[var(--border-muted)] p-3.5 flex items-start gap-3 text-left">
              <Sparkles className="w-4 h-4 text-accent-primary shrink-0 mt-0.5 animate-pulse" />
              <span className="text-xs text-text-secondary leading-relaxed font-sans">
                Contact form is not configured yet. Set <code className="font-mono text-[10px] bg-surface-card px-1 py-0.5 rounded border border-[var(--border-muted)]">NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT</code> in your environment.
              </span>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={status === "submitting" || !isConfigured}
              className="w-full h-11"
            >
              <span>{status === "submitting" ? "Sending..." : "Send Message"}</span>
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
