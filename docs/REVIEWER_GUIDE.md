# Reviewer Guide — How to Present SortMySkills

Use this when walking a professor, hiring manager, or teammate through the repository. It tells you **what to say**, **which files to open**, and **what not to claim**.

---

## Elevator pitch (30 seconds)

> SortMySkills helps students learn **intentionally** instead of randomly. We normalize messy skill labels from resumes and job posts using a **browser-side taxonomy dictionary**, show **gap percentages**, recommend **curated Coursera paths**, and provide **600 interview questions** across six roles. It is a Next.js frontend prototype — no backend yet — focused on structure and UX.

---

## Architecture in plain language

```text
┌─────────────────────────────────────────────────────────┐
│  Next.js App Router (React 19, client components)       │
├─────────────────────────────────────────────────────────┤
│  Pages: marketing + 3 tools (planner, matcher, packs)   │
├─────────────────────────────────────────────────────────┤
│  Shared lib: skill-map.ts (parser), themes.ts (colors)  │
├─────────────────────────────────────────────────────────┤
│  Static data: interview-packs/*, ROLES_DATABASE, courses│
├─────────────────────────────────────────────────────────┤
│  UI: Tailwind 4, GSAP, Lenis, Recharts                  │
└─────────────────────────────────────────────────────────┘
          No server API · No database · No auth
```

---

## Recommended file open order

Open these **in this sequence** during a code review:

| Order | File | What to explain |
|-------|------|-----------------|
| 1 | `README.md` | Entry point + doc links |
| 2 | `src/lib/skill-map.ts` | **Heart of the product** — parser + alias map |
| 3 | `src/app/page.tsx` | Homepage UX + calls parser on form submit |
| 4 | `src/app/job-match/page.tsx` | Resume/JD comparison using same parser |
| 5 | `src/app/skill-development/page.tsx` | Role checklist + readiness math + Recharts |
| 6 | `src/data/interview-packs/index.ts` | How 600 questions are registered |
| 7 | `src/components/ThemeProvider.tsx` | Light/dark + accent packs |
| 8 | `src/app/layout.tsx` | Fonts, theme script, global providers |

Skip config boilerplate (`next.config.ts`, `eslint`) unless asked.

---

## File-by-file talking points

### `src/lib/skill-map.ts`

- **Single source of truth** for skill normalization.
- `SKILL_MAP`: alias → canonical name.
- `extractSkillsFromText()`: tokenize → lookup → substring fallback → dedupe.
- Say: *“Adding a skill means adding keys here; all pages update automatically.”*

### `src/app/page.tsx`

- Marketing sections + **live hero demo** (comma-split loop, same map).
- **Parser playground** calls `extractSkillsFromText` on submit.
- `COURSERA_COURSES` static list on homepage.
- GSAP for motion; not required for business logic.

### `src/app/job-match/page.tsx`

- Two textareas → same extractor on both sides.
- Set math: `matched`, `missing`, `supplementary`, `score`.
- `getCourseraBridges()` filters static courses by missing skills.
- `SAMPLE_RESUME` / `SAMPLE_JD` for instant demo.

### `src/app/skill-development/page.tsx`

- `ROLES_DATABASE` defines 5 roles (no Backend role in planner yet — see roadmap).
- Checkbox `userSkills` drives readiness %.
- Recharts only on this page.
- Coursera links are search URLs, not enroll API.

### `src/data/interview-packs/`

- One file per role; `buildPack()` in `types.ts` builds 100 questions.
- Content is **data**, not logic — easy for non-devs to extend.
- `index.ts` is the registry for the UI.

### `src/components/`

| File | Purpose |
|------|---------|
| `Navbar.tsx` | Routes + `ThemeControls` |
| `ThemeProvider.tsx` | Persists theme to `localStorage` |
| `ThemeControls.tsx` | Sun/moon + palette dropdown |
| `Logo.tsx` | SVG uses CSS accent variables |
| `SmoothScrollProvider.tsx` | Lenis wrapper |

### `src/app/globals.css` + `src/lib/themes.ts`

- Design system: charcoal/ivory surfaces, fine 0.5px borders.
- Four swappable accent palettes.
- Explain: *“We separated **layout theme** (light/dark) from **brand accent** (terracotta vs neon).”*

---

## Key design decisions to mention

1. **One parser function** — consistency between homepage and job match.
2. **Client-only v1** — fast to demo, no infra cost; tradeoff is no saved profiles.
3. **Editorial UI** — asymmetric grids, Geist + Georgia, no generic SaaS glassmorphism (see `homepage_prompts.md`).
4. **Honest labeling** — UI says “Local NLP” but implementation is dictionary matching; clarify if asked.
5. **Static course data** — curated quality over scraping Coursera.

---

## Common reviewer questions & answers

**Q: Is this AI-powered?**  
A: Not in v1. Rule-based normalization and set comparison. AI could augment parsing later.

**Q: How accurate is the match score?**  
A: Only as good as (1) what appears in the text and (2) what is in `SKILL_MAP`. It measures **tag overlap**, not years of experience or soft skills.

**Q: Why no backend?**  
A: Scope for prototype — prove UX and taxonomy model first. Roadmap includes API + persistence.

**Q: Can it read PDF resumes?**  
A: Not yet. Plain text paste only.

**Q: How do interview packs work?**  
A: Static TypeScript data, rendered as filterable lists. No scoring engine yet.

**Q: How do themes work?**  
A: CSS variables on `document.documentElement`, persisted in `localStorage`, applied before paint via inline script in `layout.tsx`.

---

## What to run before the review

```bash
npm install
npm run dev
```

Also verify build:

```bash
npm run build
```

URLs to have ready:

- http://localhost:3000/
- http://localhost:3000/skill-development
- http://localhost:3000/job-match
- http://localhost:3000/interview-packs
- http://localhost:3000/interview-packs/frontend-engineer

---

## Related docs

- Parser deep dive → [HOW_IT_WORKS.md](./HOW_IT_WORKS.md)
- Diagrams → [APP_FLOW.md](./APP_FLOW.md)
- Done vs todo → [ROADMAP.md](./ROADMAP.md)
