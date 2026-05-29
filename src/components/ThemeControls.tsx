"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeControls() {
  const { mode, toggleMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleMode}
        className="p-2 fine-line bg-surface-card hover:bg-surface-hover transition-colors"
        aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={mode === "dark" ? "Light mode (journal)" : "Dark mode (charcoal)"}
      >
        {mode === "dark" ? (
          <Sun className="w-3.5 h-3.5 text-accent-green" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-accent-cyan" />
        )}
      </button>
    </div>
  );
}

