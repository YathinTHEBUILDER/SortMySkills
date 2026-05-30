# SkillQore Interview Question Packs

Comprehensive interview preparation question banks aligned with real-world hiring expectations.

Each role contains:

- **150 curated questions**
- Split into **Easy (1–50)** / **Medium (51–100)** / **Hard (101–150)**
- Conceptual + scenario-based + system-thinking questions
- Designed for assessments, interviews, and skill evaluation

---

## Available packs

| Pack | Slug | Source file |
|------|------|-------------|
| Frontend Engineer | `frontend-engineer` | `src/data/interview-packs/frontend.ts` |
| Backend Engineer | `backend-engineer` | `src/data/interview-packs/backend.ts` |
| Data Analyst | `data-analyst` | `src/data/interview-packs/data-analyst.ts` |
| ML Engineer | `ml-engineer` | `src/data/interview-packs/ml-engineer.ts` |
| UX Designer | `ux-designer` | `src/data/interview-packs/ux-designer.ts` |
| Product Manager | `product-manager` | `src/data/interview-packs/product-manager.ts` |

**Total: 900 questions** across 6 roles.

---

## UI routes

- **Catalog**: `/interview-packs`
- **Detail**: `/interview-packs/{slug}` (e.g. `/interview-packs/frontend-engineer`)

Detail pages support filters: All, Easy, Medium, Hard.

---

## Data model

```typescript
interface InterviewQuestion {
  id: number;           // 1–150 within pack
  difficulty: "easy" | "medium" | "hard";
  text: string;
}

interface InterviewPack {
  id: string;
  title: string;
  slug: string;
  description: string;
  totalQuestions: number;
  questions: InterviewQuestion[];
}
```

Built with `buildPack()` in `src/data/interview-packs/types.ts`.

---

## Adding or editing questions

1. Open the role file under `src/data/interview-packs/`.
2. Edit `EASY`, `MEDIUM`, or `HARD` string arrays (keep 50 / 50 / 50 counts).
3. Export is automatic via `buildPack()`.
4. Registry in `index.ts` must include new packs if you add roles.

---

## Topic coverage (summary)

### Frontend Engineer
HTML/CSS fundamentals, JavaScript, React, performance, SSR/hydration, testing, architecture, micro-frontends.

### Backend Engineer
REST, databases, distributed systems, caching, queues, Kubernetes, API security, system design.

### Data Analyst
SQL, statistics, visualization, experimentation, metrics, stakeholder communication.

### ML Engineer
Training pipelines, evaluation, deployment, MLOps, feature stores, responsible AI.

### UX Designer
Research, IA, prototyping, accessibility, design systems, usability testing.

### Product Manager
Discovery, prioritization, roadmaps, metrics, stakeholder management, strategy.

---

## Frontend & Backend — full question lists

The Frontend and Backend packs use the canonical **SkillQore** lists from the product spec (verbatim in `frontend.ts` and `backend.ts`). Other roles follow the same 35/35/30 structure with domain-specific content.
