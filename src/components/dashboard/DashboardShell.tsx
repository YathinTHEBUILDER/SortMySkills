"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import ThemeControls from "@/components/ThemeControls";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--background)] warm-noise-bg text-text-primary">
      {/* Visual background ambient highlights */}
      <div className="warm-glow-effect top-[-200px] left-[-100px] opacity-70" />
      <div className="warm-glow-effect bottom-[100px] right-[-200px] opacity-40" />

      {/* Sidebar drawer */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 h-16 px-6 border-b border-[var(--border-strong)] bg-[var(--background)]/85 backdrop-blur-md shadow-xs">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-surface-hover text-text-secondary border border-[var(--border-muted)] transition-colors cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex-1 lg:flex-none" />

          {/* Theme & Mode switches */}
          <div className="flex items-center gap-4">
            <ThemeControls />
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-5xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
