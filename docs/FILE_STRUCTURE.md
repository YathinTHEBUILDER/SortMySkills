# SortMySkills — File Structure

> See also: [docs/README.md](./README.md) (documentation index), [HOW_IT_WORKS.md](./HOW_IT_WORKS.md), [APP_FLOW.md](./APP_FLOW.md), [REVIEWER_GUIDE.md](./REVIEWER_GUIDE.md), [ROADMAP.md](./ROADMAP.md).

Updated project layout after theme system, interview packs, and shared libraries.

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
│   └── INTERVIEW_PACKS.md         # SkillQore question bank reference
│
├── public/
│   ├── file.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind theme, light/dark CSS variables
│   │   ├── layout.tsx             # Root layout, fonts, ThemeProvider, theme init script
│   │   ├── page.tsx               # Homepage — hero, parser, pathways, courses, philosophy
│   │   │
│   │   ├── actions/
│   │   │   └── profile.ts         # Server action for updating database profiles
│   │   │
│   │   ├── skill-development/
│   │   │   └── page.tsx           # Role selection, skill audit, readiness chart, Coursera roadmap
│   │   │
│   │   ├── job-match/
│   │   │   └── page.tsx           # Resume vs JD comparator, gap matrix, course bridges
│   │   │
│   │   ├── interview-packs/
│   │   │   ├── page.tsx           # Catalog of all 6 interview packs
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Single pack viewer with difficulty filters
│   │   │
│   │   └── profile/
│   │       └── page.tsx           # Account settings, targets, and workspace activity statistics
│   │
│   ├── components/
│   │   ├── Logo.tsx               # SVG mark — gradient uses CSS accent variables
│   │   ├── Navbar.tsx             # Global nav + theme controls
│   │   ├── ThemeProvider.tsx      # Light/dark + color pack state (localStorage)
│   │   ├── ThemeControls.tsx      # Sun/moon toggle + palette picker dropdown
│   │   ├── SmoothScrollProvider.tsx  # Lenis smooth scroll wrapper
│   │   └── dashboard/
│   │       └── ProfileForm.tsx    # Premium profile edit form component
│   │
│   ├── data/
│   │   └── interview-packs/
│   │       ├── types.ts           # InterviewPack, InterviewQuestion, buildPack()
│   │       ├── index.ts           # INTERVIEW_PACKS registry + getInterviewPackBySlug()
│   │       ├── frontend.ts        # 100 Frontend Engineer questions
│   │       ├── backend.ts         # 100 Backend Engineer questions
│   │       ├── data-analyst.ts      # 100 Data Analyst questions
│   │       ├── ml-engineer.ts       # 100 ML Engineer questions
│   │       ├── ux-designer.ts       # 100 UX Designer questions
│   │       └── product-manager.ts   # 100 Product Manager questions
│   │
│   └── lib/
│       ├── themes.ts              # COLOR_PACKS definitions + storage keys
│       └── skill-map.ts           # SKILL_MAP registry + extractSkillsFromText()
│
├── homepage_prompts.md            # AI/design iteration prompts for the homepage
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

## Route map

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Marketing homepage + live skill parser demo |
| `/skill-development` | `src/app/skill-development/page.tsx` | Career roadmap planner |
| `/job-match` | `src/app/job-match/page.tsx` | Resume vs job description analysis |
| `/interview-packs` | `src/app/interview-packs/page.tsx` | Interview pack catalog |
| `/interview-packs/[slug]` | `src/app/interview-packs/[slug]/page.tsx` | Pack detail (filter by difficulty) |
| `/profile` | `src/app/(app)/profile/page.tsx` | Account target preferences and workspace activity history |

## Slug reference (interview packs)

| Slug | Role |
|------|------|
| `frontend-engineer` | Frontend Engineer |
| `backend-engineer` | Backend Engineer |
| `data-analyst` | Data Analyst |
| `ml-engineer` | ML Engineer |
| `ux-designer` | UX Designer |
| `product-manager` | Product Manager |
