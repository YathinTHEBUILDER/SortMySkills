"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Sidebar from "./Sidebar";
import ThemeControls from "@/components/ThemeControls";

export default function DashboardShell({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen flex bg-[var(--background)] warm-noise-bg text-text-primary">
      {/* Visual background ambient highlights */}
      <div className="warm-glow-effect top-[-200px] left-[-100px] opacity-70" />
      <div className="warm-glow-effect bottom-[100px] right-[-200px] opacity-40" />

      {/* Sidebar drawer */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 h-16 px-6 border-b border-[var(--border-strong)] bg-[var(--background)]/85 backdrop-blur-md shadow-xs">
          {/* Brand Logo & Name in Header */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <Logo className="w-7 h-7 group-hover:rotate-6 transition-transform duration-300" />
            <span className="font-semibold text-text-primary text-base tracking-tight font-serif italic">
              SortMySkills
            </span>
          </Link>

          <div className="flex-1" />

          {/* Theme & Mode switches */}
          <div className="flex items-center gap-4">
            <ThemeControls />
          </div>
        </header>

        <main className="flex-1 p-6 pb-28 sm:p-8 sm:pb-32 lg:p-10 lg:pb-36 max-w-5xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
