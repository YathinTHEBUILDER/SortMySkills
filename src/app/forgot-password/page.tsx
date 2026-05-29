"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { forgotPasswordAction } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await forgotPasswordAction({ email });
      if ("success" in res && res.success) {
        // Redirect to OTP verification page for password recovery
        router.push(`/auth/verify?email=${encodeURIComponent(email)}&type=recovery`);
      } else {
        setError(("error" in res && res.error) || "An error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[var(--background)] warm-noise-bg relative">
      <div className="warm-glow-effect top-[10%] left-[20%] opacity-80" />

      <Link href="/" className="flex items-center gap-2 mb-8 relative z-10 group">
        <Logo className="w-8 h-8 group-hover:rotate-6 transition-transform duration-300" />
        <span className="font-semibold text-text-primary text-base tracking-tight font-serif italic">SortMySkills</span>
      </Link>

      <Card className="w-full max-w-md premium-card shadow-lg relative z-10 overflow-hidden animated-border">
        <div className="absolute inset-0 dot-grid-overlay opacity-20 pointer-events-none" />
        <CardHeader
          title="Reset Password"
          description="Enter your email and we'll send an 8-digit verification code."
          className="relative z-10 text-center pb-2"
        />
        <CardBody className="pt-0 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 px-4 py-2.5 text-sm text-text-primary disabled:opacity-50 transition-all"
                placeholder="alex@example.com"
              />
            </div>

            {error && <p className="text-xs text-red-400 font-semibold text-center mt-2">{error}</p>}

            <Button type="submit" className="w-full h-11 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary mt-2" disabled={isPending}>
              {isPending ? "Sending code…" : "Send Reset Code"}
            </Button>

            <Link
              href="/login"
              className="block text-center text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-accent-primary pt-2 transition-colors"
            >
              Back to sign in
            </Link>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
