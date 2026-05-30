# Reviewer Guide — How to Present SortMySkills

Use this guide when walking a professor, hiring manager, or teammate through the SortMySkills repository. It details what to highlight, what files to inspect, and common questions.

---

## Elevator Pitch (30 seconds)

> **SortMySkills** is a highly secure, modern career-readiness SaaS platform. It leverages **Next.js 15, React 19, and Supabase** to normalize messy resumes, detect target job description gaps, and dynamically construct AI-driven study roadmaps. Featuring **Supabase OTP authentication**, **row-level security (RLS) database isolation**, and **Groq AI-powered validated timeline roadmaps**, it is designed to help students transition into placement-ready roles with authentic, trackable progress and complete data privacy control.

---

## Platform Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Next.js 15 App Router & React 19 Server Actions            │
├─────────────────────────────────────────────────────────────┤
│  Auth: Supabase OTP Email Login + Protective Middleware     │
├─────────────────────────────────────────────────────────────┤
│  AI: Groq Llama3 Timeline with Zod Schema Validation        │
├─────────────────────────────────────────────────────────────┤
│  Database: Supabase Postgres with Performance Indexing      │
├─────────────────────────────────────────────────────────────┤
│  Telemetry: Hardened Concurrency-Safe API Rate Limiting     │
└─────────────────────────────────────────────────────────────┘
```

---

## Recommended File Open Order

Open these **in this sequence** during a code review:

| Order | File / Folder | What to explain |
|-------|---------------|-----------------|
| 1 | `README.md` | Entry point & overview |
| 2 | `src/lib/skill-map.ts` | **Heart of the parser** — canonical lookup dictionary, multi-word matching, categories, and English false positive regex exclusions. |
| 3 | `src/app/(app)/career-analyser/page.tsx` | **Unified workspace UI** — handles Readiness Scans, Job Matching, AI Roadmap inputs, localStorage caching, and data deletion triggers. |
| 4 | `src/app/api/roadmap/route.ts` | **AI Route Controller** — auth checks, rate-limit shielding, verified resource filtering/injections, and Zod output validation/repair. |
| 5 | `src/app/actions/analysis.ts` | **Server Actions** — secure `deleteMyAnalysisSessionsAction` using Postgres foreign keys to wipe account footprints. |
| 6 | `supabase/migrations/` | **Database Schema & Hardening** — profile creations, sessions logging, RLS policy setups, and custom speed indices. |
| 7 | `src/lib/rate-limit.ts` | **Telemetry Hardening** — concurrency-safe IP & User-scoped rate limiter featuring select-then-update auto-retries on insert conflict. |

---

## File-by-File Talking Points

### `src/lib/skill-map.ts` (Parser Engine)
* **High Specificity**: Maps specific libraries and platforms (e.g. `Pandas`, `PyTorch`, `Kubernetes`, `Firebase`) to canonical terms rather than generic collapsed parent titles.
* **Smart Category Mapping**: Automatically tags skills with their corresponding track families (`AI & Machine Learning`, `Databases & Storage`).
* **Go False Positive Filter**: Avoids matching standard English verbs ("Let's go build") using strict context checks, but accurately parses when declaring the `Go` language.

### `src/app/(app)/career-analyser/page.tsx` (Unified Workspace)
* paste inputs once → run **Readiness Scan** (formerly ATS Compatibility Score checking 5 weight structures) and **Skill Gaps** instantly.
* Banners warn when utilizing John Doe / TechCorp **demo sample data** to prevent users from accidentally saving test runs.
* Integrates a strict **🔒 Resume Privacy Notice** and a permanent delete function that clears localStorage keys and triggers server-side deletion.

### `src/app/api/roadmap/route.ts` (AI Generation API)
* Uses Groq Llama-3 to generate week-by-week timelines with goals and tasks.
* Maps AI recommendations against a local registry of 14 curated free platforms (`Odin Project`, `roadmap.sh`, `freeCodeCamp`) and filters unverified URLs to block AI hallucination.
* Zod validation ensures valid, parsing-safe JSON return payloads.

### `src/lib/rate-limit.ts` (Hardened Limiting)
* Prevents API spam via persistent, windowed, database-recorded check limits.
* In high-concurrency conflicts (e.g., rapid duplicate key insertions), it retries the select-and-increment routine once rather than failing or silently bypassing.

---

## Common Reviewer Questions & Answers

**Q: Is the Roadmap generation truly AI-backed?**  
A: Yes, it is fully real. It queries Groq AI securely from the route handler, parses inputs against verified resource bounds, and runs strict schema validations.

**Q: How is candidate privacy guaranteed?**  
A: Every user's record is isolated under Supabase Row Level Security (RLS) policies requiring matching `auth.uid()`. Furthermore, candidates have a dedicated deletion server action that permanently wipes their CVs and roadmaps.

**Q: What happens if Supabase experiences a cold start or database failure?**  
A: The rate-limiter features an automatic fallback to local, in-memory Map tracking so that the user's scan request completes safely without blocking.

---

## Related docs

* Technical architecture deep dive → [HOW_IT_WORKS.md](./HOW_IT_WORKS.md)
* Visual sitemaps and Persistence structures → [APP_FLOW.md](./APP_FLOW.md)
* Progress tracker → [ROADMAP.md](./ROADMAP.md)
