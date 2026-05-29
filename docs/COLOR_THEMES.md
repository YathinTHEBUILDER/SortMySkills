# Color Themes & Accent Packs

SortMySkills uses a **two-layer theme system**:

1. **Mode** — light or dark (layout, surfaces, borders, text)
2. **Accent pack** — primary/secondary gradient colors (buttons, tags, logo, charts)

---

## Dark mode (default)

| Token | Value | Usage |
|-------|-------|--------|
| Background | `#0f0f0e` | Page base |
| Surface card | `#141413` | Panels, cards |
| Text primary | `#f4f4f3` | Headings, body |
| Text secondary | `#9c9c98` | Labels, meta |
| Border muted | `rgba(244,244,243,0.06)` | 0.5px fine lines |

## Light mode (editorial journal)

| Token | Value | Usage |
|-------|-------|--------|
| Background | `#fdfdfb` | Warm ivory paper |
| Surface card | `#f5f5f2` | Elevated paper layer |
| Text primary | `#1c1c1b` | Charcoal print |
| Text secondary | `#5c5c58` | Muted captions |
| Border muted | `rgba(28,28,27,0.08)` | Fine dividers |

Toggle via **sun/moon** control in the navbar.

---

## Accent color packs

Defined in `src/lib/themes.ts`. Applied via CSS variables:

- `--accent-primary` → Tailwind `accent-green`
- `--accent-secondary` → Tailwind `accent-cyan`

| Pack ID | Name | Primary | Secondary |
|---------|------|---------|-----------|
| `terracotta` | Terracotta & Sand | `#c45b37` | `#d9b48f` |
| `neon` | Neon Green & Cyan | `#3be87e` | `#1ad1d7` |
| `amber` | Amber & Copper | `#d4a017` | `#b87333` |
| `slate` | Slate & Pearl | `#7eb8c9` | `#c4cdd5` |

Select via **palette** icon in the navbar. Preference persists in `localStorage`.

---

## Implementation files

| File | Responsibility |
|------|----------------|
| `src/app/globals.css` | `:root`, `html.dark`, `html.light`, utility borders |
| `src/components/ThemeProvider.tsx` | React state + `document.documentElement` updates |
| `src/components/ThemeControls.tsx` | UI toggles |
| `src/app/layout.tsx` | Blocking init script to avoid theme flash |
| `src/components/Logo.tsx` | SVG gradient stops use CSS variables |

---

## Design constraints (from brand guide)

- No glassmorphism, neon glow blurs, or floating blob decorations
- Asymmetric grids, fine 0.5px borders, Geist + Georgia pairing
- Accents only on active states, verified nodes, and CTAs

See `homepage_prompts.md` for AI iteration prompts to swap palettes or extend light mode.
