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
    name: "Lively Rose & Sage",
    description: "Vibrant rose pink with a soft sage accent",
    accentPrimary: "#E7717D",
    accentSecondary: "#AFD275",
  },
  {
    id: "neon",
    name: "Rose Slate",
    description: "Vibrant rose pink combined with cool slate",
    accentPrimary: "#E7717D",
    accentSecondary: "#C2CAD0",
  },
  {
    id: "amber",
    name: "Earthy Walnut & Sand",
    description: "Earthy walnut brown paired with warm sand greige",
    accentPrimary: "#7E685A",
    accentSecondary: "#C2B9B0",
  },
  {
    id: "slate",
    name: "Slate & Sage",
    description: "Cool slate gray with lively sage green highlights",
    accentPrimary: "#C2CAD0",
    accentSecondary: "#AFD275",
  },
];

export const THEME_STORAGE_KEY = "sortmyskills-theme-mode";
export const COLOR_PACK_STORAGE_KEY = "sortmyskills-color-pack";

export function getColorPack(id: ColorPackId): ColorPack {
  return COLOR_PACKS.find((p) => p.id === id) ?? COLOR_PACKS[0];
}
