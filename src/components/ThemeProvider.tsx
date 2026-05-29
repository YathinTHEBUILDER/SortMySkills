"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  COLOR_PACK_STORAGE_KEY,
  COLOR_PACKS,
  ColorPackId,
  THEME_STORAGE_KEY,
  ThemeMode,
  getColorPack,
} from "@/lib/themes";

interface ThemeContextValue {
  mode: ThemeMode;
  colorPackId: ColorPackId;
  colorPack: (typeof COLOR_PACKS)[0];
  setMode: (mode: ThemeMode) => void;
  setColorPackId: (id: ColorPackId) => void;
  toggleMode: () => void;
}

const defaultValue: ThemeContextValue = {
  mode: "dark",
  colorPackId: "terracotta",
  colorPack: getColorPack("terracotta"),
  setMode: () => {},
  setColorPackId: () => {},
  toggleMode: () => {},
};

const ThemeContext = createContext<ThemeContextValue>(defaultValue);

function applyThemeToDocument(mode: ThemeMode, colorPackId: ColorPackId) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(mode);
  root.setAttribute("data-color-pack", colorPackId);

  const pack = getColorPack(colorPackId);
  root.style.setProperty("--accent-primary", pack.accentPrimary);
  root.style.setProperty("--accent-secondary", pack.accentSecondary);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [colorPackId, setColorPackIdState] = useState<ColorPackId>("terracotta");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const storedPack = localStorage.getItem(COLOR_PACK_STORAGE_KEY) as ColorPackId | null;
    const initialMode =
      storedMode === "light" || storedMode === "dark" ? storedMode : "dark";
    const initialPack =
      storedPack && COLOR_PACKS.some((p) => p.id === storedPack)
        ? storedPack
        : "terracotta";
    setModeState(initialMode);
    setColorPackIdState(initialPack);
    applyThemeToDocument(initialMode, initialPack);
    setMounted(true);
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyThemeToDocument(next, colorPackId);
  }, [colorPackId]);

  const setColorPackId = useCallback((id: ColorPackId) => {
    setColorPackIdState(id);
    localStorage.setItem(COLOR_PACK_STORAGE_KEY, id);
    applyThemeToDocument(mode, id);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  useEffect(() => {
    if (mounted) {
      applyThemeToDocument(mode, colorPackId);
    }
  }, [mode, colorPackId, mounted]);

  const colorPack = getColorPack(colorPackId);

  return (
    <ThemeContext.Provider
      value={{
        mode: mounted ? mode : "dark",
        colorPackId: mounted ? colorPackId : "terracotta",
        colorPack: mounted ? colorPack : getColorPack("terracotta"),
        setMode,
        setColorPackId,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
