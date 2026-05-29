"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthProvider";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  const router = useRouter();
  const { configured, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: err } =
      mode === "signin"
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password);

    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[var(--background)]">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Logo className="w-8 h-8" />
        <span className="font-semibold text-text-primary">SortMySkills</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader
          title={mode === "signin" ? "Sign in" : "Create account"}
          description={
            configured
              ? "Use your Supabase Auth credentials."
              : "Supabase is not configured yet. Add keys in Settings after setup."
          }
        />
        <CardBody className="pt-0">
          {!isSupabaseConfigured() && (
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-text-primary">
              Add <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
              <code className="text-xs">.env.local</code> (see .env.example).
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
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading || !configured}>
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 text-sm text-text-secondary hover:text-accent-green w-full text-center"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>

          <Link
            href="/dashboard"
            className="block mt-6 text-center text-sm text-text-secondary hover:text-text-primary"
          >
            Continue without signing in →
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
