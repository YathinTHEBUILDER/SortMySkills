# SortMySkills — Master Rebuild Prompt

Copy everything inside the fenced block below into an AI coding assistant to recreate this project from scratch.

---

```text
You are an elite full-stack frontend engineer and product designer. Build **SortMySkills** — a structured career intelligence web app for students and early-career applicants. It is NOT generic SaaS: it uses a calm, premium editorial aesthetic with a **sidebar dashboard** (not a cluttered marketing homepage). The app runs as a **Next.js 15 client-heavy prototype** with optional **Supabase Auth** scaffolding (works without keys; unlocks when env vars are set).

================================================================================
PRODUCT SUMMARY
================================================================================

SortMySkills helps users:
1. **Normalize** messy skill text (resume, JD, skill lists) into canonical tags via a local dictionary parser (not LLM).
2. **Plan skills** for a target role — checkbox audit, readiness %, Recharts bar chart, Coursera gap roadmap.
3. **Match jobs** — paste resume + job description, get match %, aligned/missing/supplementary skills, Coursera bridges.
4. **Practice interviews** — 6 role packs × 100 questions each (35 Easy, 35 Medium, 30 Hard) = 600 total (SkillQore bank).
5. **Theme** — light/dark mode + 4 swappable accent color packs (localStorage).

Be honest in UI copy: parser is "rule-based" / "local registry", not neural NLP. No backend DB writes until Supabase is connected.

================================================================================
TECH STACK (exact versions family)
================================================================================

- Next.js 15 App Router (Turbopack dev)
- React 19
- TypeScript
- Tailwind CSS 4 (`@import "tailwindcss"`, `@theme` block)
- Geist Sans + Geist Mono (`next/font/google`)
- lucide-react icons
- Recharts (skill planner chart only)
- Lenis smooth scroll (global provider)
- GSAP optional (minimal; dashboard should NOT depend on heavy animation)
- @supabase/supabase-js + @supabase/ssr (auth scaffolding)

No Redux. No Prisma unless user adds later. No fake "AI powered" claims.

================================================================================
DESIGN SYSTEM
================================================================================

**Layout philosophy (current):**
- **Marketing landing** at `/` — minimal: logo, headline, 3 feature cards, CTA "Open dashboard". No 600-line scroll homepage.
- **Dashboard** for all tools — fixed left sidebar (260px), sticky top bar, content max-width ~6xl, generous padding.
- Use `Card`, `CardHeader`, `CardBody`, `PageHeader`, `Button` / `ButtonLink` components — rounded-xl borders, no visual noise.
- Avoid: uppercase mono spam on every label, "CORE NODE ACTIVE", dot-grid overlays, fake terminal chrome, 8 duplicate sections on one page.

**Colors — dark mode (default):**
- Page bg: #0f0f0e
- Surface card: #141413
- Text primary: #f4f4f3
- Text secondary: #9c9c98
- Borders: rgba(244,244,243,0.06) via CSS var `--border-muted`

**Colors — light mode (journal):**
- Background: #fdfdfb
- Surface: #f5f5f2
- Text: #1c1c1b
- Borders: rgba(28,28,27,0.08)

**Accent packs (default = terracotta):**
Map to CSS `--accent-primary` and `--accent-secondary`; Tailwind `accent-green` / `accent-cyan` read these vars.
| ID          | Primary   | Secondary |
|-------------|-----------|-----------|
| terracotta  | #c45b37   | #d9b48f   |
| neon        | #3be87e   | #1ad1d7   |
| amber       | #d4a017   | #b87333   |
| slate       | #7eb8c9   | #c4cdd5   |

**Logo:** SVG interlocking S-ribbon + arrow; gradient uses `var(--accent-primary)` → `var(--accent-secondary)`.

**Forbidden:** glassmorphism, neon glow blurs, giant floating blobs, purple/blue startup gradients.

================================================================================
ROUTES & PAGE BEHAVIOR
================================================================================

Use Next.js route groups:

**(marketing)** — no sidebar
- `/` — Landing: title "Learn with direction, not volume", links to /dashboard, /login, 3 cards (planner, job match, interview packs)

**(app)** — wrapped in `DashboardShell` (sidebar + top bar)
- `/dashboard` — Overview: 4 stat cards (60+ aliases, 600 questions, 6 packs, 5 planner roles), 4 tool cards with links, Supabase CTA card → /settings
- `/skill-development` — Skill planner (see below)
- `/job-match` — Job match (see below)
- `/tools/parser` — Two-column: textarea + normalize button → tag chips + discipline hint
- `/interview-packs` — Grid of 6 pack cards
- `/interview-packs/[slug]` — Filter All/Easy/Medium/Hard, numbered question list
- `/settings` — Supabase env status, auth session status, planned tables list

**Standalone (no sidebar):**
- `/login` — Email/password sign-in & sign-up via Supabase when configured; banner if .env missing; link to continue without auth

**Interview pack slugs:**
frontend-engineer, backend-engineer, data-analyst, ml-engineer, ux-designer, product-manager

================================================================================
SIDEBAR NAV (src/config/navigation.ts)
================================================================================

Workspace:
- Overview → /dashboard
- Skill planner → /skill-development
- Job match → /job-match
- Skill parser → /tools/parser
- Interview packs → /interview-packs

Account:
- Settings → /settings

Top bar: hamburger (mobile), ThemeControls (sun/moon + palette dropdown), UserMenu (sign in / email / sign out / "Connect Supabase" if not configured)

================================================================================
CORE ENGINE: SKILL PARSER (src/lib/skill-map.ts)
================================================================================

Export `SKILL_MAP: Record<string, string>` — alias (lowercase) → canonical display name.

Minimum mappings include:
react, reactjs, react.js → React
js, javascript, es6 → JavaScript
ts, typescript → TypeScript
py, python, python3 → Python
tailwind, tailwindcss → Tailwind CSS
node, nodejs → Node.js
sql, postgresql, mysql → SQL
git, github → Git
ml, deep learning → Machine Learning
ds, pandas → Data Science
ux, figma, ui/ux → UX Design
pm, agile, scrum → Product Management
aws, s3, ec2, amazon web services → AWS
gcp, google cloud, firebase → Google Cloud
docker, kubernetes, k8s → DevOps
graphql, apollo, gql → GraphQL
mongodb, mongo, nosql → MongoDB

Export `extractSkillsFromText(text: string): string[]`:
1. Lowercase, split on /[,\s\n\-\:\(\)]+/
2. Direct SKILL_MAP[token] hit → add canonical
3. Else substring match: token===key || token includes key || key includes token (token.length > 1)
4. Deduplicate with includes() checks
5. Return string[]

Used by: /tools/parser, /job-match (both resume and JD).

================================================================================
SKILL PLANNER (src/data/roles.ts + page)
================================================================================

`ROLES_DATABASE` — 5 roles (each: id, title, description, typicalSalary, difficulty, skills[], courses[]):
- Frontend Engineer: React, JavaScript, TypeScript, Tailwind CSS, Git
- Data Analyst: SQL, Python, Data Science, Git
- ML Engineer: Python, Machine Learning, Git
- UX Designer: UX Design, Figma
- Product Manager: Product Management

UI: left column role picker + role detail card; right column skill toggles + readiness % + Recharts bar (skill have=10 else 2); roadmap section lists Coursera courses where course.skills ∩ missingSkills ≠ ∅. Links: `https://www.coursera.org/search?query=${encodeURIComponent(title)}`.

Readiness % = round(present / required * 100).

================================================================================
JOB MATCH (src/data/coursera-courses.ts + page)
================================================================================

Two textareas (resume, JD) → submit → 800ms loading UX → results:
- parsedResume = extractSkillsFromText(resume)
- parsedJD = extractSkillsFromText(jd)
- matched = JD skills in resume
- missing = JD skills not in resume
- supplementary = resume skills not in JD
- score = round(matched.length / parsedJD.length * 100) or 0 if empty JD skills

Show: match % card, 3 skill columns, Coursera bridges (filter COURSERA_COURSES where any course.skill in missing).

Sample data button pre-fills a Frontend Engineer example.

Static COURSERA_COURSES (5 certificates): Meta Front-End, Google Data Analytics, Deep Learning Specialization, Google UX Design, Brand Management (PM).

================================================================================
INTERVIEW PACKS (src/data/interview-packs/)
================================================================================

`types.ts` — buildPack(id, title, description, easy[], medium[], hard[]) → InterviewPack with 100 questions, ids 1–100, difficulties assigned.

`index.ts` — INTERVIEW_PACKS array + getInterviewPackBySlug(slug).

Six files with full question content:
- frontend.ts — 100 FE questions (HTML, CSS, JS, React, perf, architecture) — use industry-standard lists
- backend.ts — 100 BE questions (REST, DB, distributed systems, design)
- data-analyst.ts — 100 DA questions
- ml-engineer.ts — 100 ML questions
- ux-designer.ts — 100 UX questions
- product-manager.ts — 100 PM questions

Each: exactly 35 easy + 35 medium + 30 hard strings.

================================================================================
SUPABASE AUTH SCAFFOLDING
================================================================================

`.env.example`:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

`src/lib/supabase/config.ts` — isSupabaseConfigured()
`src/lib/supabase/client.ts` — createBrowserClient (null if not configured)
`src/lib/supabase/server.ts` — createServerSupabaseClient with cookies()

`src/components/auth/AuthProvider.tsx` — context: user, session, loading, signInWithEmail, signUpWithEmail, signOut; onAuthStateChange listener

Wrap root layout with AuthProvider (inside ThemeProvider).

`login/page.tsx` — email/password form; disabled messaging without env.

`settings/page.tsx` — show env configured?, signed in?, planned tables: profiles, skill_audits, job_analyses, parser_history

`supabase/README.md` — setup steps + future migrations note

Do NOT require auth to use tools. No RLS migrations required in v1 — scaffold only.

================================================================================
THEMING (src/components/ThemeProvider.tsx + globals.css)
================================================================================

- Toggle html class `light` | `dark`
- Set data-color-pack attribute + --accent-primary/secondary on documentElement
- localStorage keys: sortmyskills-theme-mode, sortmyskills-color-pack
- Inline script in root layout `<head>` to apply theme before paint (prevent flash)

ThemeControls: sun/moon toggle + palette dropdown (4 packs from themes.ts)

================================================================================
FILE STRUCTURE (create all files)
================================================================================

sortmyskills/
├── .env.example
├── MASTER_PROMPT.md
├── homepage_prompts.md          (optional design iteration notes)
├── README.md
├── docs/
│   ├── README.md, HOW_IT_WORKS.md, APP_FLOW.md, REVIEWER_GUIDE.md
│   ├── ROADMAP.md, FILE_STRUCTURE.md, FUNCTIONALITY.md
│   ├── COLOR_THEMES.md, INTERVIEW_PACKS.md
├── supabase/README.md
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx           (fonts, ThemeProvider, AuthProvider, Lenis, theme script)
│   │   ├── login/page.tsx
│   │   ├── (marketing)/layout.tsx, page.tsx
│   │   └── (app)/
│   │       ├── layout.tsx       (DashboardShell)
│   │       ├── dashboard/page.tsx
│   │       ├── skill-development/page.tsx
│   │       ├── job-match/page.tsx
│   │       ├── tools/parser/page.tsx
│   │       ├── interview-packs/page.tsx, [slug]/page.tsx
│   │       └── settings/page.tsx
│   ├── components/
│   │   ├── dashboard/ DashboardShell, Sidebar, PageHeader
│   │   ├── auth/ AuthProvider, UserMenu
│   │   ├── ui/ Card, Button
│   │   ├── Logo.tsx, ThemeProvider.tsx, ThemeControls.tsx, SmoothScrollProvider.tsx
│   ├── config/navigation.ts
│   ├── data/roles.ts, coursera-courses.ts, interview-packs/*.ts
│   └── lib/skill-map.ts, themes.ts, supabase/*.ts

================================================================================
DOCUMENTATION (generate markdown)
================================================================================

Write docs explaining: parser algorithm, mock vs real features, user flows (mermaid), reviewer code walk order, roadmap (done vs todo), file tree, color themes, interview pack slugs.

================================================================================
IMPLEMENTATION RULES
================================================================================

1. TypeScript strict; `"use client"` only where needed (hooks, auth, charts).
2. ESLint clean — no unused imports; escape apostrophes in JSX or rephrase.
3. `npm run build` must pass.
4. Mobile: collapsible sidebar overlay on lg breakpoint.
5. Keep UI spacious — prefer 1 idea per screen section; dashboard over infinite scroll marketing.
6. Recharts tooltip/chart colors use CSS variables for theme compatibility.
7. Do not commit real Supabase secrets.

================================================================================
DELIVERABLE CHECKLIST
================================================================================

[ ] All routes render with sidebar (except /, /login)
[ ] Parser returns DevOps, Google Cloud, GraphQL for "docker on GCP graphql"
[ ] Job match score and gap columns work with samples
[ ] Skill planner readiness % and chart work
[ ] 600 interview questions browsable with filters
[ ] Light/dark + 4 accent packs persist
[ ] Login page works when Supabase env set; graceful when not
[ ] Complete docs/ folder
[ ] Production build succeeds

Build the entire application now. Start with package.json, layout, dashboard shell, skill-map, then pages, then interview data, then auth scaffold, then documentation.
```

---

## How to use

1. Open a new chat with a capable coding model (Claude, GPT, Cursor Agent).
2. Paste the entire block above (from "You are an elite full-stack…" through "…then documentation.").
3. Optionally attach `homepage_prompts.md` for visual iteration variants.
4. After generation, run `npm install && npm run dev` and verify the checklist.

## Shorter variant (if context-limited)

If the model has a small context window, paste only the **PRODUCT SUMMARY**, **ROUTES**, **SKILL PARSER**, **FILE STRUCTURE**, and **DELIVERABLE CHECKLIST** sections, and ask it to read `MASTER_PROMPT.md` from the repo if available.
