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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[var(--background)]">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Logo className="w-8 h-8" />
        <span className="font-semibold text-text-primary">SortMySkills</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader
          title="Create new password"
          description="Choose a secure, strong password for your account."
        />
        <CardBody className="pt-0">
          {success ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-accent-green font-medium">Password updated successfully!</p>
              <p className="text-sm text-text-secondary">
                You will be redirected to the login page shortly...
              </p>
              <Link href="/login" className="inline-block text-sm text-accent-green hover:underline font-medium">
                Go to login immediately
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30 text-text-primary disabled:opacity-50"
                  placeholder="••••••••"
                />
                <p className="text-[10px] text-text-secondary mt-1">
                  Must be at least 8 characters, with 1 uppercase letter and 1 number.
                </p>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30 text-text-primary disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-sm text-red-400 font-medium text-center">{error}</p>}

              <Button type="submit" className="w-full h-11" disabled={isPending}>
                {isPending ? "Updating password…" : "Reset Password"}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
