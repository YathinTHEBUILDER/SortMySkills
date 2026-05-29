"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import ThemeControls from "@/components/ThemeControls";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-text-primary">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 h-16 px-4 sm:px-6 border-b border-[var(--border-muted)] bg-[var(--background)]/90 backdrop-blur-md">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-surface-hover text-text-secondary"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 lg:flex-none" />

          <ThemeControls />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
