"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { signUpAction } from "@/app/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "student" as "student" | "graduate" | "job_seeker" | "admin",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const res = await signUpAction(formData);
      if ("success" in res && res.success) {
        // Redirect to OTP verification page
        router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}&type=signup`);
      } else {
        setError(("error" in res && res.error) || "An error occurred during signup.");
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
          title="Create an account"
          description="Enter your details to create a SortMySkills profile."
        />
        <CardBody className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={isPending}
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30 text-text-primary disabled:opacity-50"
                placeholder="Alex Morgan"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isPending}
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30 text-text-primary disabled:opacity-50"
                placeholder="alex@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Your Current Status</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "student" | "graduate" | "job_seeker" | "admin",
                  })
                }
                disabled={isPending}
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30 text-text-primary disabled:opacity-50"
              >
                <option value="student">Student</option>
                <option value="graduate">Recent Graduate</option>
                <option value="job_seeker">Job Seeker</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isPending}
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30 text-text-primary disabled:opacity-50"
                placeholder="••••••••"
              />
              <p className="text-[10px] text-text-secondary mt-1">
                Must be at least 8 characters, with 1 uppercase letter and 1 number.
              </p>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={isPending}
                className="w-full rounded-lg border border-[var(--border-muted)] bg-[var(--background)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-green/30 text-text-primary disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-400 font-medium text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating account…" : "Sign up"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 text-sm text-text-secondary hover:text-accent-green w-full text-center cursor-pointer transition-colors"
            onClick={() => router.push("/login")}
          >
            Already have an account? Sign in
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
