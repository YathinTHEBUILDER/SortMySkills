<p align="center">
  <img src="./public/brand/sortmyskills-horizontal-dark.png" alt="SortMySkills" width="320" />
</p>

<br/>

**Structured career intelligence** for students and early-career applicants: normalize skills, audit gaps, compare resumes to job descriptions, plan Coursera study paths, and practice with **900 curated interview questions**.

Built with **Next.js 15**, **React 19**, **Tailwind CSS 4**, **GSAP**, **Lenis**, and **Recharts**.  
Current version is a **fully integrated SaaS platform** featuring real-time email OTP authentication, transactional public profiles, and active Supabase database synchronization.

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — use **Open dashboard** or go to `/dashboard`.

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
| Compare resume vs JD, run readiness checks, generate study roadmaps | `/career-analyser` (unified workspace; `/job-match` redirects here) | Scan readiness score + check skill gaps + generate AI roadmap with verified learning resources (and privacy data deletion option) |
| Practice interview questions | `/interview-packs` | 6 roles × 150 questions (50 Easy / Medium / Hard each) |
| Manage profile & view workspace stats | `/profile` | Synchronizes custom display name/role with Supabase DB and Auth |
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
| `/career-analyser` | Unified workspace: Scan Readiness, Check Skill Gaps, and Generate Study Roadmap (with user privacy delete actions) |
| `/job-match` | Redirects to `/career-analyser` |
| `/interview-packs` | Interview pack catalog |
| `/interview-packs/[slug]` | Single pack (e.g. `frontend-engineer`) |
| `/profile` | Account settings, career targets, and workspace activity stats |

---

## Project structure (short)

```text
src/
  app/              # Pages (Next.js App Router)
  components/       # Navbar, theme, scroll, logo
  data/interview-packs/   # 900 questions (TypeScript data)
  lib/
    skill-map.ts    # Parser + SKILL_MAP  ← start here for code review
    themes.ts       # Color pack definitions
docs/               # All reviewer & team documentation
```

Full tree: **[docs/FILE_STRUCTURE.md](./docs/FILE_STRUCTURE.md)**

---

## Core code to show reviewers

1. `src/lib/skill-map.ts` — parser engine (normalizes tools like `PyTorch`, `Pandas` with categories; protects against false positives like English "go")  
2. `src/app/(app)/career-analyser/page.tsx` — unified workspace for Readiness Scans, Skill Gaps, and Roadmaps (contains privacy data delete logic and demo warning badges)  
3. `src/app/api/roadmap/route.ts` — study roadmap generation with Groq AI, Zod schema validation, and resource mapping against local verified sources  
4. `src/app/actions/analysis.ts` — server actions for secure user data deletion  

---

## Theme controls

- **Sun/moon** — light mode (ivory journal) vs dark mode (charcoal editorial)  
- **Palette** — Terracotta (default), Neon, Amber, Slate  

Preferences saved in `localStorage`.

---

## Team

SortMySkills platform · Structured study directory · 2026

Made in pair programming...
