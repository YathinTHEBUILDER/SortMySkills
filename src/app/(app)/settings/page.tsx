"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthProvider";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import Link from "next/link";
import { CheckCircle2, Circle, Database, KeyRound } from "lucide-react";

export default function SettingsPage() {
  const { configured, user, loading } = useAuth();
  const envReady = isSupabaseConfigured();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Supabase connection, authentication, and future data persistence."
      />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader
            title="Supabase"
            description="Add credentials to .env.local to enable auth and database features."
          />
          <CardBody className="pt-0 space-y-4">
            <StatusRow
              ok={envReady}
              label="Environment variables"
              detail={
                envReady
                  ? "NEXT_PUBLIC_SUPABASE_URL and ANON_KEY are set"
                  : "Copy .env.example → .env.local and add your project keys"
              }
            />
            <StatusRow
              ok={configured && !loading && !!user}
              label="Signed in"
              detail={
                user
                  ? `Logged in as ${user.email}`
                  : configured
                    ? "No active session — sign in from the header or login page"
                    : "Configure Supabase first"
              }
            />

            <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background)] p-4 text-sm font-mono text-text-secondary space-y-1">
              <p className="flex items-center gap-2 text-text-primary font-sans font-medium text-sm mb-2">
                <KeyRound className="w-4 h-4" /> Required variables
              </p>
              <p>NEXT_PUBLIC_SUPABASE_URL</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
            </div>

            {!envReady && (
              <p className="text-sm text-text-secondary">
                See{" "}
                <a
                  href="https://supabase.com/docs/guides/getting-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-green hover:underline"
                >
                  Supabase getting started
                </a>{" "}
                for project setup.
              </p>
            )}

            <Link
              href="/login"
              className="inline-block text-sm text-accent-green hover:underline"
            >
              Go to sign in →
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Planned database tables"
            description="Reserved for when Supabase is connected — run migrations in your Supabase SQL editor."
          />
          <CardBody className="pt-0">
            <ul className="space-y-3 text-sm text-text-secondary">
              {[
                "profiles — user display name, target role",
                "skill_audits — saved readiness snapshots",
                "job_analyses — resume/JD text + match results",
                "parser_history — recent normalization runs",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Database className="w-4 h-4 shrink-0 text-text-secondary mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-text-secondary mt-4">
              Schema SQL will live in <code className="text-text-primary">supabase/migrations/</code> in a
              future update.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function StatusRow({
  ok,
  label,
  detail,
}: {
  ok: boolean;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex gap-3">
      {ok ? (
        <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0" />
      ) : (
        <Circle className="w-5 h-5 text-text-secondary shrink-0" />
      )}
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-sm text-text-secondary">{detail}</p>
      </div>
    </div>
  );
}
