"use client";

import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/Button";

export default function UserMenu() {
  const { configured, loading, user, signOut } = useAuth();

  if (!configured) {
    return (
      <Link
        href="/settings"
        className="text-xs text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg border border-dashed border-[var(--border-muted)]"
      >
        Connect Supabase
      </Link>
    );
  }

  if (loading) {
    return <span className="text-xs text-text-secondary px-3">…</span>;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-muted)] px-3 py-2 text-xs font-medium text-text-primary hover:bg-surface-hover"
      >
        <LogIn className="w-3.5 h-3.5" />
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:flex items-center gap-2 text-xs text-text-secondary max-w-[140px] truncate">
        <User className="w-3.5 h-3.5 shrink-0" />
        {user.email}
      </span>
      <Button variant="ghost" className="text-xs py-2" onClick={() => signOut()}>
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </div>
  );
}
