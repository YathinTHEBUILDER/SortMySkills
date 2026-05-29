"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { forgotPasswordAction } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await forgotPasswordAction({ email });
      if ("success" in res && res.success) {
        setSuccessMessage(
          res.message || "If an account exists with that email, a password reset link has been sent."
        );
      } else {
        setError(("error" in res && res.error) || "An error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[var(--background)]">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Logo className="w-8 h-8" />
        <span className="font-semibold text-text-primary">SortMySkills</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader
          title="Reset your password"
          description="Enter your email address and we'll send you a recovery link."
        />
        <CardBody className="pt-0">
          {successMessage ? (
            <div className="space-y-6 text-center">
              <p className="text-sm text-text-secondary leading-relaxed">{successMessage}</p>
              <Link
                href="/login"
                className="inline-block text-sm text-accent-green hover:underline font-medium transition-colors"
              >
                Return to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30 text-text-primary disabled:opacity-50"
                  placeholder="alex@example.com"
                />
              </div>

              {error && <p className="text-sm text-red-400 font-medium text-center">{error}</p>}

              <Button type="submit" className="w-full h-11" disabled={isPending}>
                {isPending ? "Sending link…" : "Send Reset Link"}
              </Button>

              <Link
                href="/login"
                className="block text-center text-sm text-text-secondary hover:text-accent-green font-medium pt-2 transition-colors"
              >
                Back to sign in
              </Link>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
