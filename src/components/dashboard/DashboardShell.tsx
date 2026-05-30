import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Sidebar from "./Sidebar";
import ThemeControls from "@/components/ThemeControls";
import { User } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

interface DashboardShellProps {
  children: React.ReactNode;
  roleText?: string;
  maskedEmail?: string;
}

export default function DashboardShell({
  children,
  roleText = "MEMBER",
  maskedEmail = "",
}: DashboardShellProps) {

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] warm-noise-bg text-text-primary">
      {/* Visual background ambient highlights */}
      <div className="warm-glow-effect top-[-200px] left-[-100px] opacity-70" />
      <div className="warm-glow-effect bottom-[100px] right-[-200px] opacity-40" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 h-16 px-6 border-b border-[var(--border-strong)] bg-[var(--background)]/85 backdrop-blur-md shadow-xs">
          {/* Brand Logo & Name in Header */}
          <Link href="/dashboard" className="flex items-center group">
            <Logo variant="horizontal" className="h-7 w-auto text-text-primary" />
          </Link>

          <div className="flex-1" />

          {/* Theme, Mode, and Profile switches in top-right */}
          <div className="flex items-center gap-4">
            <ThemeControls />
            
            {maskedEmail && (
              <div className="flex items-center gap-3 border border-[var(--border-muted)] bg-[var(--surface-card)] p-2 rounded-xl relative overflow-hidden h-10 shadow-xs">
                <div className="absolute inset-0 dot-grid-overlay opacity-10 pointer-events-none" />
                <div className="w-6.5 h-6.5 rounded-lg bg-[#E7717D]/10 border border-[#E7717D]/20 flex items-center justify-center text-[#E7717D] dark:text-[#EE8590] shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-none pr-1 hidden sm:block">
                  <span className="block text-[7px] tracking-widest font-mono font-bold text-[#E7717D] dark:text-[#EE8590] uppercase">{roleText}</span>
                  <p className="text-[9px] text-text-secondary mt-0.5 max-w-[100px] truncate">{maskedEmail}</p>
                </div>
                <div className="border-l border-[var(--border-muted)] pl-2.5 flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="text-[8px] font-mono uppercase tracking-widest text-[#E7717D] dark:text-[#EE8590] hover:underline font-bold"
                  >
                    Settings
                  </Link>
                  <span className="text-[var(--border-muted)] text-[10px] select-none font-bold">|</span>
                  <form action={signOutAction} className="inline-flex items-center">
                    <button
                      type="submit"
                      className="text-[8px] font-mono uppercase tracking-widest text-text-muted hover:text-red-500 font-bold transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Top Horizontal Navigation Dock */}
        <Sidebar />

        <main className="flex-1 p-6 pb-16 sm:p-8 sm:pb-20 lg:p-10 lg:pb-24 max-w-5xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
