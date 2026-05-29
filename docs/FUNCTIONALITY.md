# SortMySkills — Functionality Overview

> For parser internals and “what is real vs mocked”, see **[HOW_IT_WORKS.md](./HOW_IT_WORKS.md)**.  
> For user journeys and diagrams, see **[APP_FLOW.md](./APP_FLOW.md)**.  
> For presenting to reviewers, see **[REVIEWER_GUIDE.md](./REVIEWER_GUIDE.md)**.  
> For done vs planned work, see **[ROADMAP.md](./ROADMAP.md)**.

SortMySkills is a **structured career intelligence platform** built with Next.js 15, React 19, Tailwind CSS 4, GSAP, Lenis, and Recharts. It helps students and early-career applicants normalize skills, audit gaps, compare resumes to job descriptions, plan Coursera study paths, and practice with curated interview question banks.

---

## 1. Homepage (`/`)

### Hero & live normalization demo
- Editorial asymmetric layout (7/5 column split).
- Auto-cycling **raw skill strings** (e.g. `reactjs, py, figma`) are parsed against `SKILL_MAP` in `src/lib/skill-map.ts`.
- Normalized tags animate in with GSAP; demonstrates the platform’s taxonomy engine.

### Two pathways (product modules)
1. **Skill Development** → `/skill-development`  
   Map competencies to a target role; readiness % and study roadmap.
2. **Job Match Analysis** → `/job-match`  
   Dual-panel resume vs JD parser; gap matrix and Coursera bridges.

### Interactive parser playground
- User pastes chaotic tech text; `extractSkillsFromText()` returns standardized tags.
- Shows inferred discipline (e.g. Frontend Engineering) and alignment strength.

### Coursera recommendations
- Static curated list of professional certificates mapped to skills.
- Links toward skill planner and external Coursera search.

### Interview packs CTA
- Highlights six SkillQore packs (600 total questions).
- Links to `/interview-packs`.

### Philosophy manifesto
- Long-form editorial section (`#philosophy`) on intentional learning vs random course consumption.

### Animations
- GSAP intro fades on hero, pathway cards, and demo tags.
- Lenis smooth scrolling via `SmoothScrollProvider`.

---

## 2. Skill Development (`/skill-development`)

### Target role selection
Five roles in `ROLES_DATABASE`:
- Frontend Engineer
- Data Analyst
- Machine Learning Engineer
- UX Designer
- Product Manager

Each role includes description, salary range, difficulty, required skills, and linked Coursera course(s).

### Capabilities audit
- Toggle skills you already have.
- **Readiness %** = (matched required skills / total required) × 100.
- Recharts bar chart: required vs current per skill (uses theme accent CSS variables).

### Compiled study roadmap
- If gaps exist: surfaces Coursera courses that cover missing skills.
- If 100% ready: prompts user to run Job Match Analysis.
- External links to Coursera search for each course title.

---

## 3. Job Match Analysis (`/job-match`)

### Inputs
- **Resume** plain text (textarea).
- **Job description** plain text (textarea).
- **Load Sample Datasets** pre-fills a Frontend Engineer example.
- Simulated 1.5s “compiling” state for UX.

### Analysis engine
- Both texts parsed with `extractSkillsFromText()`.
- **Match score** = matched JD skills / total JD skills.
- **Aligned assets**: skills in both resume and JD.
- **Critical gaps**: JD skills missing from resume.
- **Supplementary assets**: resume skills not required by JD.

### Gap bridging
- Filters `COURSERA_COURSES` where course skills overlap missing tags.
- Cards link to Coursera search for each certificate.

---

## 4. Interview Question Packs (`/interview-packs`)

### Catalog page
Lists all packs from `INTERVIEW_PACKS` in `src/data/interview-packs/index.ts`:
- 100 questions per role
- Counts for Easy (35), Medium (35), Hard (30)

### Detail page (`/interview-packs/[slug]`)
- Filter: All | Easy | Medium | Hard
- Numbered question list with difficulty badges
- Designed for assessments, mock interviews, and self-evaluation

See [INTERVIEW_PACKS.md](./INTERVIEW_PACKS.md) for full role list and question structure.

---

## 5. Skill normalization (`src/lib/skill-map.ts`)

Central registry maps aliases to canonical tags, including:

| Aliases | Canonical tag |
|---------|---------------|
| react, reactjs, react.js | React |
| aws, s3, ec2 | AWS |
| gcp, google cloud, firebase | Google Cloud |
| docker, kubernetes, k8s | DevOps |
| graphql, apollo, gql | GraphQL |
| mongodb, mongo, nosql | MongoDB |
| … | (see file for full list) |

`extractSkillsFromText(text)` tokenizes input and returns deduplicated canonical skills.

---

## 6. Theming (`ThemeProvider` + `globals.css`)

### Light / dark mode
- **Dark**: warm off-black charcoal (`#0f0f0e`), ivory text — default editorial look.
- **Light**: warm ivory paper (`#fdfdfb`), charcoal print text — journal aesthetic.
- Toggle in navbar; preference stored in `localStorage` (`sortmyskills-theme-mode`).
- Inline script in `layout.tsx` prevents flash of wrong theme.

### Accent color packs
Four swappable palettes (see [COLOR_THEMES.md](./COLOR_THEMES.md)):
- Terracotta & Sand (default)
- Neon Green & Cyan (original)
- Amber & Copper
- Slate & Pearl

Stored in `sortmyskills-color-pack`. Logo, buttons, charts, and tags use `--accent-primary` / `--accent-secondary`.

---

## 7. Shared UI components

| Component | Role |
|-----------|------|
| `Navbar` | Fixed header, route highlights, theme controls, CTA |
| `Logo` | Brand SVG with dynamic gradient |
| `ThemeProvider` | Theme context + DOM class/CSS variable application |
| `ThemeControls` | Light/dark + palette dropdown |
| `SmoothScrollProvider` | Lenis instance for smooth page scroll |

---

## 8. Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Motion | GSAP 3 |
| Scroll | Lenis |
| Charts | Recharts (skill-development page) |
| Icons | lucide-react |
| Fonts | Geist Sans, Geist Mono (+ Georgia for editorial serif) |

---

## 9. Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve production build
```
