# SortMySkills — Application Flow

Visual and narrative flows for reviewers. Pair this with [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) for implementation detail.

---

## Site map (all routes)

```mermaid
flowchart TB
  HOME["/  Homepage"]
  SKILL["/skill-development"]
  JOB["/job-match"]
  PACKS["/interview-packs"]
  PACK["/interview-packs/[slug]"]

  HOME --> SKILL
  HOME --> JOB
  HOME --> PACKS
  PACKS --> PACK
  SKILL --> JOB
  JOB --> SKILL
```

---

## Primary user journeys

### Journey A — “I don’t know what to learn”

```text
Homepage
  → Read value prop + watch hero normalization demo
  → Click "Build Skill Roadmap"
  → /skill-development
  → Pick target role (e.g. Frontend Engineer)
  → Check skills you already have
  → See readiness % + chart
  → If gaps: view Coursera course cards for missing skills
  → Optional: open Coursera in new tab
```

### Journey B — “Am I qualified for this job?”

```text
Homepage or Navbar
  → "Job Match Analysis" or "Comparator"
  → /job-match
  → Paste resume (or Load Sample Datasets)
  → Paste job description
  → Calculate Competency Gaps
  → View match % + Aligned / Gaps / Supplementary columns
  → Browse Coursera bridge courses for missing skills
  → Reset → analyze another JD
```

### Journey C — “I want interview practice”

```text
Homepage or Navbar
  → "Interview Packs"
  → /interview-packs
  → Choose role card (e.g. Backend Engineer)
  → /interview-packs/backend-engineer
  → Filter Easy / Medium / Hard
  → Study questions offline or in mock interviews
```

### Journey D — “Try the parser only”

```text
Homepage
  → Section: "Test the Standardizing Parser"
  → Paste chaotic skill text
  → Normalize Tokens
  → See canonical tags + discipline hint
```

---

## Homepage flow (detailed)

```mermaid
sequenceDiagram
  participant U as User
  participant P as page.tsx
  participant M as skill-map.ts
  participant G as GSAP

  U->>P: Lands on /
  P->>G: Hero fade-in animation
  loop Every 8s
    P->>M: Hero demo uses SKILL_MAP
    M-->>P: Normalized tags
    P->>G: Animate .demo-tag
  end
  U->>P: Paste text in parser form
  U->>P: Submit Normalize Tokens
  P->>M: extractSkillsFromText()
  M-->>P: string[]
  P->>G: Animate .manual-tag
  P-->>U: Show tags + alignment labels
```

---

## Job Match flow (detailed)

```mermaid
sequenceDiagram
  participant U as User
  participant J as job-match/page.tsx
  participant M as skill-map.ts
  participant C as COURSERA_COURSES

  U->>J: Paste resume + JD
  U->>J: Submit analysis
  Note over J: 1.5s setTimeout (loading UI)
  J->>M: extractSkillsFromText(resume)
  J->>M: extractSkillsFromText(jd)
  M-->>J: resumeSkills, jdSkills
  J->>J: Compute matched, missing, supplementary, score
  J->>C: Filter courses where skills ∩ missing ≠ ∅
  C-->>J: bridge courses
  J-->>U: Results dashboard + Coursera cards
```

---

## Skill Development flow (detailed)

```mermaid
flowchart TD
  A[Select role from ROLES_DATABASE] --> B[Load role.skills checklist]
  B --> C{User toggles skills}
  C --> D[Recalculate readiness %]
  D --> E{missingSkills empty?}
  E -->|Yes| F[Show success + link to Job Match]
  E -->|No| G[Filter role.courses by covered gaps]
  G --> H[Show Coursera roadmap cards]
```

**Note:** No text parser on this page — skills come from predefined role blueprints.

---

## Interview packs flow

```mermaid
flowchart LR
  A[/interview-packs] --> B[INTERVIEW_PACKS from index.ts]
  B --> C[User clicks role]
  C --> D[getInterviewPackBySlug]
  D --> E[Render 100 questions]
  E --> F{Filter difficulty}
  F --> E
```

---

## Global chrome (every page)

```mermaid
flowchart TB
  L[layout.tsx] --> T[ThemeProvider]
  T --> N[Navbar]
  T --> S[SmoothScrollProvider Lenis]
  S --> PAGE[Page content]
  N --> TC[ThemeControls light/dark + palette]
```

---

## State persistence today

| Data | Persists? | Where |
|------|-----------|--------|
| Theme mode | ✅ | `localStorage` `sortmyskills-theme-mode` |
| Color pack | ✅ | `localStorage` `sortmyskills-color-pack` |
| Parser input | ❌ | React state — lost on refresh |
| Job match texts | ❌ | React state |
| Skill audit checkboxes | ❌ | React state |
| Interview filter | ❌ | React state |

---

## Suggested live demo script (5 minutes)

1. **Homepage (1 min)** — Hero demo → parser paste test → point at `skill-map.ts`.
2. **Skill Development (1.5 min)** — Switch roles → toggle skills → show chart + roadmap.
3. **Job Match (1.5 min)** — Load samples → run analysis → explain score formula.
4. **Interview Packs (0.5 min)** — Open one pack → filter Hard questions.
5. **Theme (0.5 min)** — Toggle light mode + switch accent pack.

Close with [ROADMAP.md](./ROADMAP.md) — what is planned next.
