# SortMySkills

**Structured career intelligence** for students and early-career applicants: normalize skills, audit gaps, compare resumes to job descriptions, plan Coursera study paths, and practice with **600 curated interview questions**.

Built with **Next.js 15**, **React 19**, **Tailwind CSS 4**, **GSAP**, **Lenis**, and **Recharts**.  
Current version is a **client-side prototype** (no backend, no auth).

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — use **Open dashboard** or go to `/dashboard`.

### Supabase (optional)

```bash
cp .env.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

See [supabase/README.md](./supabase/README.md).

```bash
npm run build   # production build
npm start       # serve production build
```

---

## What the app does (simple)

| You want to… | Go to… | How it works |
|--------------|--------|----------------|
| See the product story + try the parser | `/` | Rule-based skill normalization from pasted text |
| Plan learning for a target role | `/skill-development` | Check off skills → readiness % → Coursera gaps |
| Compare resume vs a job post | `/job-match` | Same parser on both texts → match % + missing skills |
| Practice interview questions | `/interview-packs` | 6 roles × 100 questions (Easy / Medium / Hard) |
| Switch look & accent colors | Navbar | Light/dark + 4 color packs |

**Parser in one line:** messy text → tokenize → lookup aliases in `SKILL_MAP` → return canonical tags like `React`, `AWS`, `DevOps`.  
Details: **[docs/HOW_IT_WORKS.md](./docs/HOW_IT_WORKS.md)**

---

## Documentation (for reviewers)

| Document | Use when you need to… |
|----------|------------------------|
| **[docs/README.md](./docs/README.md)** | Index of all docs |
| **[docs/HOW_IT_WORKS.md](./docs/HOW_IT_WORKS.md)** | Explain parser, scoring, mocks vs real |
| **[docs/APP_FLOW.md](./docs/APP_FLOW.md)** | User journeys + Mermaid diagrams |
| **[docs/REVIEWER_GUIDE.md](./docs/REVIEWER_GUIDE.md)** | Code walkthrough + demo script + Q&A |
| **[docs/ROADMAP.md](./docs/ROADMAP.md)** | Done ✅ vs planned 📋 |
| **[docs/FILE_STRUCTURE.md](./docs/FILE_STRUCTURE.md)** | Every folder and route |
| **[docs/FUNCTIONALITY.md](./docs/FUNCTIONALITY.md)** | Feature-by-feature catalog |
| **[docs/COLOR_THEMES.md](./docs/COLOR_THEMES.md)** | Light/dark + accent packs |
| **[docs/INTERVIEW_PACKS.md](./docs/INTERVIEW_PACKS.md)** | Question bank structure |
| **[homepage_prompts.md](./homepage_prompts.md)** | AI/design prompts for UI iteration |

**Suggested review path:** `HOW_IT_WORKS` → `APP_FLOW` → `REVIEWER_GUIDE` → live demo.

---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/skill-development` | Role planner + readiness chart |
| `/job-match` | Resume vs JD comparator |
| `/interview-packs` | Interview pack catalog |
| `/interview-packs/[slug]` | Single pack (e.g. `frontend-engineer`) |

---

## Project structure (short)

```text
src/
  app/              # Pages (Next.js App Router)
  components/       # Navbar, theme, scroll, logo
  data/interview-packs/   # 600 questions (TypeScript data)
  lib/
    skill-map.ts    # Parser + SKILL_MAP  ← start here for code review
    themes.ts       # Color pack definitions
docs/               # All reviewer & team documentation
```

Full tree: **[docs/FILE_STRUCTURE.md](./docs/FILE_STRUCTURE.md)**

---

## Core code to show reviewers

1. `src/lib/skill-map.ts` — parser engine  
2. `src/app/job-match/page.tsx` — match score + gaps  
3. `src/app/skill-development/page.tsx` — readiness planner  
4. `src/data/interview-packs/index.ts` — question registry  

---

## Theme controls

- **Sun/moon** — light mode (ivory journal) vs dark mode (charcoal editorial)  
- **Palette** — Terracotta (default), Neon, Amber, Slate  

Preferences saved in `localStorage`.

---

## Team

SortMySkills platform · Structured study directory · 2026

Made in pair programming.
