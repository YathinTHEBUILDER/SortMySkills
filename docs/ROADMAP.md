# SortMySkills — Product & Engineering Roadmap

Progress snapshot for reviewers and the team. Update this file as milestones ship.

**Last updated:** May 2026 · **Version:** 1.0.0 (Production-Ready Release)

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done and in `main` |
| 🚧 | In progress / partial |
| 📋 | Planned, not started |
| 💡 | Future idea |

---

## Phase 0 — Foundation ✅

| Item | Status | Notes |
|------|--------|-------|
| Next.js 15 App Router setup | ✅ | `src/app/` structure |
| Editorial homepage | ✅ | Hero, pathways, parser playground, philosophy |
| Geist fonts + Tailwind 4 | ✅ | `globals.css` `@theme` |
| GSAP hero animations | ✅ | `page.tsx` |
| Lenis smooth scroll | ✅ | `SmoothScrollProvider` |
| Shared Navbar + Logo | ✅ | `src/components/` |
| Documentation folder | ✅ | `docs/*.md` |

---

## Phase 1 — Core Tools ✅

| Item | Status | Notes |
|------|--------|-------|
| Skill normalization registry | ✅ | `src/lib/skill-map.ts` |
| `extractSkillsFromText()` | ✅ | Used on homepage + career-analyser |
| Cloud/DevOps aliases | ✅ | Optimal canonical resolution mapping (Docker, Kubernetes) |
| Skill Development planner | ✅ | Role selection, checklist targets, Recharts bar chart |
| Career Analyser (unified workspace)| ✅ | Integrated Readiness Scans, Gap comparisons, AI Roadmaps |
| Static Coursera recommendations | ✅ | Skill Planner + Gap matching |
| Sample resume/JD datasets | ✅ | Load demo sample triggers warnings and check alerts |

---

## Phase 2 — Content, Theming & Telemetry ✅

| Item | Status | Notes |
|------|--------|-------|
| Light + dark mode | ✅ | Journal light + editorial charcoal dark |
| 4 Swappable Brand Accents | ✅ | Terracotta, Neon, Amber, Slate |
| 600 Question Interview Q&As | ✅ | `src/data/interview-packs/` with slugs and difficulty filters |
| Shielded Rate Limiting | ✅ | Supabase persistent window rate-limiting with select-then-update retry logic |

---

## Phase 3 — Backend & Security Hardening ✅

| Item | Status | Notes |
|------|--------|-------|
| User Account & OTP Auth | ✅ | Supabase OTP Email Login protecting app paths via middleware |
| Profile & Setting Security | ✅ | Removed selectable Admin role from signup and profile forms, sanitizing displays |
| Persistent DB Workspace | ✅ | Saved resume & JD syncs to database on scan or roadmap queries |
| Optimal Postgres Indexing | ✅ | Production-hardening indexes added for analysis sessions, rate limits, and request logs |
| Dynamic RLS Protections | ✅ | Tightened database policies ensuring strict user-id scoping |

---

## Phase 4 — AI Roadmapping & Truthfulness ✅

| Item | Status | Notes |
|------|--------|-------|
| week-by-week Study Timeline | ✅ | Groq AI constructs a rigorous plan matching week milestones |
| Hallucination URL Defense | ✅ | Maps AI output against a local registry of 14 curated free educational resources (MDN, freeCodeCamp) |
| Zod Schema Enforcement | ✅ | Validates JSON format and repaired structures before returning or storing |

---

## Phase 5 — Privacy & Parser Accuracy ✅

| Item | Status | Notes |
|------|--------|-------|
| 🔒 Resume Privacy Notice | ✅ | Clearly documents data collection in the Career Analyser panel |
| permanent Wipe Actions | ✅ | `deleteMyAnalysisSessionsAction` wipes database records, local states, and local milestones |
| Library Specificity | ✅ | maps Pandas, PyTorch, DynamoDB to canonical tokens with categories |
| Go False Positive Filter | ✅ | Contextual regex avoids misidentifying normal verbs as the Go language |

---

## What We Did (Summary of Accomplishments)

```text
✅ Unified Resume & JD Scans, Gap checks, and AI Study Plans into a unified `/career-analyser` workspace.
✅ Removed selectable Admin role, update profile schemas, and sanitized legacy roles to MEMBER.
✅ Engineered week-by-week AI timelines validating Groq JSON with Zod schemas.
✅ Eliminated URL hallucinations by mapping resources to a local verified list (MDN, Odin).
✅ Implemented a secure Privacy Notice and permanent "Wipe Data" button using server actions.
✅ Boosted parser accuracy with tool-specific overrides (Pandas, PyTorch) and category groupings.
✅ Hardened telemetry with IP-scoped rate-limits including select-then-update retry logic on database conflict.
✅ Swapped legacy ATS compatibility terms with clear and accurate "Resume Readiness" descriptions.
✅ Formulated optimal composite Postgres indexes and secure RLS policies.
```
