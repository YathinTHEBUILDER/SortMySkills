export type ColorPackId = "terracotta" | "neon" | "amber" | "slate";
export type ThemeMode = "light" | "dark";

export interface ColorPack {
  id: ColorPackId;
  name: string;
  description: string;
  accentPrimary: string;
  accentSecondary: string;
}

export const COLOR_PACKS: ColorPack[] = [
  {
    id: "terracotta",
    name: "Terracotta & Sand",
    description: "Warm rust and sand-gold — premium editorial default",
    accentPrimary: "#c45b37",
    accentSecondary: "#d9b48f",
  },
  {
    id: "neon",
    name: "Neon Green & Cyan",
    description: "Original technical print accent gradient",
    accentPrimary: "#3be87e",
    accentSecondary: "#1ad1d7",
  },
  {
    id: "amber",
    name: "Amber & Copper",
    description: "High-end warm amber with copper highlights",
    accentPrimary: "#d4a017",
    accentSecondary: "#b87333",
  },
  {
    id: "slate",
    name: "Slate & Pearl",
    description: "Cool restrained slate with pearl accents",
    accentPrimary: "#7eb8c9",
    accentSecondary: "#c4cdd5",
  },
];

export const THEME_STORAGE_KEY = "sortmyskills-theme-mode";
export const COLOR_PACK_STORAGE_KEY = "sortmyskills-color-pack";

export function getColorPack(id: ColorPackId): ColorPack {
  return COLOR_PACKS.find((p) => p.id === id) ?? COLOR_PACKS[0];
}
