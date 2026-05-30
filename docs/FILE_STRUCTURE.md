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
│   ├── middleware.ts              # Route protection check for auth
│   ├── app/
│   │   ├── globals.css            # Tailwind theme, light/dark CSS variables
│   │   ├── layout.tsx             # Root layout, fonts, ThemeProvider, theme init script
│   │   ├── page.tsx               # Marketing homepage
│   │   │
│   │   ├── login/                 # User authentication sign in
│   │   │   └── page.tsx
│   │   ├── signup/                # User signup with roles
│   │   │   └── page.tsx
│   │   ├── forgot-password/       # Password reset initiation
│   │   │   └── page.tsx
│   │   │
│   │   ├── auth/                  # Supabase auth handlers
│   │   │   ├── callback/
│   │   │   │   └── route.ts
│   │   │   └── verify/
│   │   │       └── page.tsx
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
| `/login` | `src/app/login/page.tsx` | User authentication sign in |
| `/signup` | `src/app/signup/page.tsx` | User signup with sanitized roles |
| `/forgot-password` | `src/app/forgot-password/page.tsx` | Forgot password initiation |
| `/auth/verify` | `src/app/auth/verify/page.tsx` | Auth verification instructions |
| `/dashboard` | `src/app/(app)/dashboard/page.tsx` | Placement workspace dashboard metrics |
| `/career-analyser` | `src/app/(app)/career-analyser/page.tsx` | Unified workspace: Scan Readiness, Check Skill Gaps, and Generate Study Roadmap (with data privacy deletion) |
| `/job-match` | `src/app/(app)/job-match/page.tsx` | Redirects directly to `/career-analyser` |
| `/skill-development` | `src/app/(app)/skill-development/page.tsx` | Career roadmap planner and checklist |
| `/interview-packs` | `src/app/(app)/interview-packs/page.tsx` | Catalog of 6 interview preparation packs |
| `/profile` | `src/app/(app)/profile/page.tsx` | Profile targets and database credentials info |

## Key Architectural & Feature Specifications

* **Unified Workspace (`/career-analyser`)**: The single source of truth for resume readiness scans, job matching, and AI roadmaps.
* **Redirect Path (`/job-match`)**: The `/job-match` path automatically redirects users directly to `/career-analyser` to ensure a cohesive, unified workspace experience.
* **AI Roadmap Engine**: Generates highly accurate study paths using **Groq** APIs structured through strict **Zod** schema validations, combined with verified local resources. No live web browsing/scraping is performed to guarantee speed and deterministic safety.
* **Verified Local Resources**: All learning pathways and resources displayed to the user originate solely from a pre-vetted catalog defined in `src/data/verified-resources.ts` (`VERIFIED_RESOURCES`).
* **Data Privacy & Control**: Users have complete ownership of their data and can permanently delete all saved analyses, resume text, target JDs, focus areas, and milestone trackers both from the UI and active database records.
* **Database & Migration Schema**: All database initialization schemas, table definitions, custom triggers, indexes, and RLS policies are maintained in `supabase/migrations/001_init.sql`.
