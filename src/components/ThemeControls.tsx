"use client";

import React, { useState } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { COLOR_PACKS, ColorPackId } from "@/lib/themes";

export default function ThemeControls() {
  const { mode, colorPackId, setColorPackId, toggleMode } = useTheme();
  const [packOpen, setPackOpen] = useState(false);

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

      <div className="relative">
        <button
          type="button"
          onClick={() => setPackOpen((o) => !o)}
          className="p-2 fine-line bg-surface-card hover:bg-surface-hover transition-colors flex items-center gap-1"
          aria-label="Color pack"
          title="Accent color pack"
        >
          <Palette className="w-3.5 h-3.5 text-accent-cyan" />
        </button>

        {packOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40"
              aria-label="Close color menu"
              onClick={() => setPackOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 z-50 w-56 bg-surface-card fine-line p-2 shadow-lg">
              <span className="block px-2 py-1 text-[9px] font-mono text-text-secondary uppercase tracking-widest">
                Accent packs
              </span>
              {COLOR_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => {
                    setColorPackId(pack.id as ColorPackId);
                    setPackOpen(false);
                  }}
                  className={`w-full text-left px-2 py-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    colorPackId === pack.id
                      ? "bg-surface-hover text-text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/50"
                  }`}
                >
                  <span
                    className="w-3 h-3 shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${pack.accentPrimary}, ${pack.accentSecondary})`,
                    }}
                  />
                  <span>{pack.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
