"use client";

import { useState, useTransition, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { signInAction } from "@/app/actions/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check for redirected status or callback errors in URL searchParams
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const redirected = searchParams.get("redirectedFrom");
    
    if (errorParam === "auth-callback-failed") {
      setError("The verification link has expired or is invalid. Please request a new one.");
    } else if (redirected) {
      setInfo("Please sign in to access that tool.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    startTransition(async () => {
      const res = await signInAction({ email, password });
      
      if ("success" in res && res.success) {
        router.push("/dashboard");
        router.refresh();
      } else if ("unverified" in res && res.unverified) {
        // Navigate to OTP verification page if user is not verified yet
        router.push(`/auth/verify?email=${encodeURIComponent(res.email)}&type=signup`);
      } else if ("error" in res) {
        setError(res.error || "Invalid email or password.");
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
          title="Sign in"
          description="Access your career intelligence dashboard and tools."
        />
        <CardBody className="pt-0">
          {info && (
            <div className="mb-4 rounded-lg border border-accent-green/30 bg-accent-green/10 px-4 py-3 text-sm text-text-primary text-center">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Email</label>
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
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm text-text-secondary">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-text-secondary hover:text-accent-green transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30 text-text-primary disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-400 font-medium text-center">{error}</p>}

            <Button type="submit" className="w-full h-11" disabled={isPending}>
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 text-sm text-text-secondary hover:text-accent-green w-full text-center cursor-pointer transition-colors"
            onClick={() => router.push("/signup")}
          >
            Need an account? Sign up
          </button>

          <Link
            href="/"
            className="block mt-6 text-center text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to homepage
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
          <p className="text-sm text-text-secondary">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
