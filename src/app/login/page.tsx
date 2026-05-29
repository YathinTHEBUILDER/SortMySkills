"use client";

import { useState, useTransition, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { signInAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setError(null);
    setInfo(null);
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) {
          setError(error.message);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Google authentication failed.";
        setError(msg);
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
          title="Welcome Back"
          description="Access your technical career intelligence workspace."
          className="relative z-10 text-center pb-2"
        />
        <CardBody className="pt-0 relative z-10">
          {info && (
            <div className="mb-4 rounded-lg border border-accent-green/30 bg-accent-green/10 px-4 py-3 text-xs font-mono uppercase tracking-wider text-accent-green text-center">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 px-4 py-2.5 text-sm text-text-primary disabled:opacity-50 transition-all"
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-accent-primary hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 pl-4 pr-11 py-2.5 text-sm text-text-primary disabled:opacity-50 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors focus:outline-none disabled:opacity-50 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-400 font-semibold text-center mt-2">{error}</p>}

            <Button type="submit" className="w-full h-11 font-mono uppercase tracking-widest text-[#F6F1E8] bg-accent-primary mt-2" disabled={isPending}>
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* Social Sign In Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-muted)]" />
            </div>
            <div className="relative flex justify-center text-[10px] font-mono uppercase">
              <span className="bg-surface-card px-2.5 text-text-muted">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className="w-full h-11 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-soft)]/40 hover:bg-surface-hover/80 text-xs font-mono uppercase tracking-widest text-text-primary flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            className="mt-5 text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-accent-primary w-full text-center cursor-pointer transition-colors"
            onClick={() => router.push("/signup")}
          >
            Need an account? Sign up
          </button>

          <Link
            href="/"
            className="block mt-6 text-center text-xs text-text-muted hover:text-text-primary transition-colors"
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
