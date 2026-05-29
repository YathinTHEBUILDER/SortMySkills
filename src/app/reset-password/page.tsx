"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { resetPasswordAction } from "@/app/actions/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const res = await resetPasswordAction({ password, confirmPassword });
      if ("success" in res && res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(("error" in res && res.error) || "Failed to reset password. The reset token may be expired.");
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
          title="Create New Password"
          description="Choose a secure, strong password for your account."
          className="relative z-10 text-center pb-2"
        />
        <CardBody className="pt-0 relative z-10">
          {success ? (
            <div className="space-y-4 text-center">
              <p className="text-xs font-mono uppercase tracking-wider text-accent-green font-bold">Password updated successfully!</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                You will be redirected to the login page shortly...
              </p>
              <Link href="/login" className="inline-block text-xs font-mono uppercase tracking-widest text-accent-primary hover:underline font-semibold mt-2">
                Go to login immediately
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 px-4 py-2.5 text-sm text-text-primary disabled:opacity-50 transition-all"
                  placeholder="••••••••"
                />
                <p className="text-[10px] text-text-muted mt-1 leading-snug">
                  Must be at least 8 characters, with 1 uppercase letter and 1 number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 px-4 py-2.5 text-sm text-text-primary disabled:opacity-50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-xs text-red-400 font-semibold text-center mt-2">{error}</p>}

              <Button type="submit" className="w-full h-11 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary mt-2" disabled={isPending}>
                {isPending ? "Updating password…" : "Reset Password"}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
