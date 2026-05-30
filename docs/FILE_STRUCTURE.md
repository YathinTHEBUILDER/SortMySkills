# SortMySkills — File Structure

> See also: [docs/README.md](./README.md) (documentation index), [HOW_IT_WORKS.md](./HOW_IT_WORKS.md), [APP_FLOW.md](./APP_FLOW.md), [REVIEWER_GUIDE.md](./REVIEWER_GUIDE.md), [ROADMAP.md](./ROADMAP.md).

Updated project layout containing standard Next.js App Router route groups, local server actions, custom Zod schemas, and Supabase Postgres migration configurations.

```
sortmyskills/
├── docs/
│   ├── README.md                  # Documentation index
│   ├── HOW_IT_WORKS.md            # Parser + engines (technical)
│   ├── APP_FLOW.md                # User journeys + Mermaid diagrams
│   ├── REVIEWER_GUIDE.md          # Code walkthrough for demos
│   ├── ROADMAP.md                 # Done vs planned milestones
│   ├── FILE_STRUCTURE.md          # This file — repository layout
│   ├── FUNCTIONALITY.md           # Feature-by-feature behavior
│   ├── COLOR_THEMES.md            # Light/dark + accent color packs
│   ├── INTERVIEW_PACKS.md         # Interview pack reference
│   └── PARSER_TEST_CASES.md       # Skill parser test assertions
│
├── supabase/
│   ├── migrations/                # Database SQL migration files
│   └── README.md                  # Database schema & policy documentation
│
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind theme, light/dark CSS variables
│   │   ├── layout.tsx             # Root layout, fonts, ThemeProvider, theme init script
│   │   ├── middleware.ts          # Route protection check for auth
│   │   │
│   │   ├── (auth)/                # Anonymous-only authentication routes
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── verify/
│   │   │
│   │   ├── (app)/                 # Authenticated application workspace routes
│   │   │   ├── dashboard/         # Combined placement engine dashboard
│   │   │   ├── career-analyser/   # Unified workspace (Readiness Scan, Gaps, AI Roadmap)
│   │   │   ├── job-match/         # Redirects directly to unified /career-analyser
│   │   │   ├── skill-development/ # Target role planner + baseline checklist
│   │   │   ├── profile/           # Account preferences & sanitized user metadata
│   │   │   └── interview-packs/   # 6 role-specific interview study packs
│   │   │
│   │   ├── actions/               # Server-side actions
│   │   │   ├── auth.ts            # Authenticated signUp and signIn handlers
│   │   │   ├── profile.ts         # Server actions for account update
│   │   │   └── analysis.ts        # Server action for secure resume history deletion
│   │   │
│   │   └── api/
│   │       └── roadmap/
│   │           └── route.ts       # AI Roadmap generation route with schema validation
│   │
│   ├── components/
│   │   ├── Logo.tsx               # SVG mark — dynamic colors
│   │   ├── Navbar.tsx             # Global nav + theme controls
│   │   ├── ThemeProvider.tsx      # Light/dark + color pack state (localStorage)
│   │   └── dashboard/
│   │       └── ProfileForm.tsx    # Sanitized membership role profile editor
│   │
│   ├── data/
│   │   ├── verified-resources.ts  # Filtered free local learning resources
│   │   └── interview-packs/       # 600 interview prep questions
│   │
│   └── lib/
│       ├── ai/
│       │   └── roadmap-schema.ts  # Zod schema definitions for validated roadmap output
│       ├── skill-map.ts           # SKILL_MAP registry, category maps + tokenizer
│       └── rate-limit.ts          # Concurrency-hardened API rate-limiting
```

## Route map

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Marketing homepage + live skill parser demo |
| `/login` | `src/app/(auth)/login/page.tsx` | User authentication sign in |
| `/signup` | `src/app/(auth)/signup/page.tsx` | User signup with sanitized roles |
| `/dashboard` | `src/app/(app)/dashboard/page.tsx` | Placement workspace dashboard metrics |
| `/career-analyser` | `src/app/(app)/career-analyser/page.tsx` | Unified workspace: Scan Readiness, Check Skill Gaps, and Generate Study Roadmap (with data privacy deletion) |
| `/job-match` | `src/app/(app)/job-match/page.tsx` | Redirects directly to `/career-analyser` |
| `/skill-development` | `src/app/(app)/skill-development/page.tsx` | Career roadmap planner and checklist |
| `/interview-packs` | `src/app/(app)/interview-packs/page.tsx` | Catalog of 6 interview preparation packs |
| `/profile` | `src/app/(app)/profile/page.tsx` | Profile targets and database credentials info |
