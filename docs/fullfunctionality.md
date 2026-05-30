# SortMySkills — Full Functionality Documentation

This document is the complete feature reference for the newest SortMySkills build. It covers the landing page, authentication, dashboards, Career Analyser, AI roadmap generation, database structure, privacy controls, branding, animations, and deployment configuration.

---

## 1. Product Summary

SortMySkills is a student-focused career-readiness platform for placement preparation and early-career job applications.

It helps a student answer four practical questions:

1. What skills does my resume actually show?
2. What does this job description actually require?
3. What skills am I missing?
4. What should I do next?

The product is intentionally not positioned as a guaranteed placement tool, a magic resume writer, or a fake ATS bypass system. It is a structured preparation workspace that turns a resume plus a job description into visible skills, missing gaps, readiness estimates, study roadmaps, and interview prep.

---

## 2. Current Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Animations | GSAP, ScrollTrigger, Lenis |
| Auth/database | Supabase Auth + Supabase Postgres |
| AI | Groq API with fallback key support |
| Validation | Zod |
| Charts/visuals | Recharts, lucide-react |
| Notifications | Sonner |
| Email/contact | Formspree contact form, optional Gmail SMTP utility |
| Deployment target | Vercel |

---

## 3. Main Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Animated marketing landing page | Public |
| `/login` | Sign in | Public/auth route |
| `/signup` | Create account | Public/auth route |
| `/forgot-password` | Password reset initiation | Public/auth route |
| `/auth/verify` | Email verification helper page | Public/auth route |
| `/auth/callback` | Supabase OAuth callback | Public/auth route |
| `/dashboard` | User dashboard and activity overview | Protected |
| `/career-analyser` | Unified resume/JD analysis workspace | Protected |
| `/job-match` | Redirects to `/career-analyser` | Protected |
| `/skill-development` | Role planner and skill checklist | Protected |
| `/interview-packs` | Interview prep catalog | Protected |
| `/interview-packs/[slug]` | Role-specific interview pack | Protected |
| `/profile` | User profile and preferences | Protected |

Protected routes are enforced through `src/middleware.ts`.

---

## 4. Landing Page

The landing page is the public product entry point and is built as an animated premium SaaS-style page.

### Main landing page capabilities

- Auth-aware header.
- Smooth Lenis scrolling.
- GSAP page-load animations.
- Scroll-triggered section reveals.
- Scroll-driven resume transformation animations.
- Workflow progress animations.
- Roadmap timeline animations.
- Interview prep card reveals.
- Privacy/trust cards.
- Final CTA.
- Formspree contact form.
- Theme-aware logo and favicon assets.

### Landing page message

The landing page communicates:

```text
Paste resume + paste job description → see gaps → get a plan → prepare better.
```

### Landing page sections

| Section | Purpose |
|---|---|
| Header | Navigation, theme controls, auth-aware CTA |
| Hero | Explains resume clarity before applying |
| Resume transformation | Shows messy resume text becoming clean skill signals |
| Workflow | Explains the four-step product flow |
| Skill gap comparison | Shows matched and missing skills |
| Roadmap timeline | Explains how gaps become weekly action plans |
| Interview prep | Shows role-based preparation packs |
| Privacy/trust | Explains verified resources, no guarantees, data control |
| Contact | Formspree-powered feedback/collaboration form |
| Final CTA | Sends users to signup/dashboard/analyser |
| Footer | Product links, account links, short description |

---

## 5. GSAP + Lenis Animation System

### Smooth scrolling

`src/components/SmoothScrollProvider.tsx` initializes Lenis globally and connects it to GSAP ScrollTrigger:

- One Lenis instance is created.
- `ScrollTrigger.update` is called on Lenis scroll.
- `requestAnimationFrame` drives Lenis.
- Cleanup cancels RAF and destroys Lenis on unmount.

### Landing animations

`src/components/landing/LandingAnimations.tsx` handles homepage animation logic.

Implemented animation behavior:

- Navbar entrance reveal.
- Hero eyebrow reveal.
- Hero headline word stagger.
- Hero subtext and CTA reveal.
- Hero visual card reveal with blur-to-sharp animation.
- Skill chip stagger and gentle floating loops.
- Generic `.reveal-section` / `.reveal-item` scroll reveals.
- Desktop-only parallax for visual panels.
- Scroll-driven resume transformation highlights.
- Workflow progress line animation.
- Roadmap timeline line animation.
- Skill comparison card reveals.
- Interview prep card reveals.
- Privacy card reveal.
- Final CTA reveal.
- Contact section parallax/reveal support.

### Accessibility

The landing animation system checks `prefers-reduced-motion`. If the user prefers reduced motion:

- Heavy animations are skipped.
- Hidden animated elements are made visible immediately.
- Infinite chip loops are disabled.
- The page remains fully usable.

---

## 6. Contact Form

A themed contact form is implemented in:

```text
src/components/landing/ContactForm.tsx
```

### Contact form features

- Formspree submission.
- Name field.
- Email field.
- Message textarea.
- Honeypot bot-protection field.
- Loading/submitting state.
- Success state.
- Error state.
- Disabled state if the Formspree endpoint is not configured.
- Theme-matched card styling.
- Accessible labels and `aria-live` status messaging.

### Required environment variable

```env
NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT=https://formspree.io/f/your-form-id
```

The current `.env.example` includes this variable.

---

## 7. Branding, Logo, Favicon, and Metadata

The project now uses a new SortMySkills brand direction:

- Abstract `S` mark.
- Connected skill nodes.
- Roadmap arrow.
- Warm-tech color palette.
- Dark/light compatible logo assets.

### Branding assets

Brand assets are expected under:

```text
public/brand/
```

The README references:

```text
public/brand/sortmyskills-horizontal-dark.png
```

### Metadata/icon support

`src/app/layout.tsx` defines metadata for:

- App title.
- App description.
- favicon.
- 16×16 favicon.
- 32×32 favicon.
- Apple touch icon.
- Web manifest.
- Open Graph image.

Expected public assets include:

```text
public/favicon.ico
public/favicon-16x16.png
public/favicon-32x32.png
public/apple-touch-icon.png
public/icon-192.png
public/icon-512.png
public/brand/og-image.png
```

---

## 8. Authentication

Authentication uses Supabase Auth.

### Auth features

- Email/password signup.
- Email/password login.
- Google OAuth sign-in.
- Email verification flow.
- Forgot password flow.
- Password validation.
- Login/signup rate limiting.
- Auth-aware navigation.
- Protected application routes.

### User roles

User-selectable roles are restricted to:

- `student`
- `graduate`
- `job_seeker`

Users cannot self-select `admin`. If old metadata contains `admin`, dashboard display normalizes it to a non-admin label.

---

## 9. Dashboard

Route:

```text
/dashboard
```

The dashboard gives a high-level view of the user's saved profile and activity.

### Dashboard displays

- Display name.
- Target role title.
- Membership role label.
- Masked email.
- Number of audits/sessions.
- Number of job matches.
- Parser activity count.
- Latest readiness score.
- Unique skills detected.

### Dashboard data sources

The dashboard reads from:

- `profiles`
- `analysis_sessions`
- `skill_audits`
- `job_analyses`
- `parser_history`

`analysis_sessions` is treated as the primary current workspace source, while legacy tables are preserved for compatibility.

---

## 10. Profile Page

Route:

```text
/profile
```

The profile page lets users manage core account preferences.

### Profile features

- Display name update.
- Target career role selection.
- Membership status selection.
- Read-only verified email display.
- Profile data sync between Supabase Auth metadata and `public.profiles`.

### Validation

Profile updates are validated with Zod on the server. Public users cannot submit `admin` as a role.

---

## 11. Career Analyser

Route:

```text
/career-analyser
```

This is the main product workspace.

The Career Analyser combines three tools into one flow:

1. Resume readiness scan.
2. Job description skill-gap comparison.
3. AI-generated study roadmap.

### Shared inputs

The user enters:

- Resume text.
- Job description text.
- Target ready date.
- Optional focus areas.

These inputs are reused across readiness scan, gap analysis, and roadmap generation.

---

## 12. Resume Readiness Scan

The readiness scan is a heuristic estimate, not a guarantee of passing any hiring system.

### Readiness checks

The scan evaluates:

- Keyword overlap with target job description.
- Resume section structure.
- Resume word count range.
- Action verb usage.
- Contact completeness.

### Output

The scan returns:

- Final readiness score.
- Subscores.
- Missing skills.
- Quick wins.
- Word count.
- Practical improvement suggestions.

### Positioning

The product avoids claiming to be a certified ATS bypass tool. It is framed as a resume readiness estimate.

---

## 13. Job Description Match / Skill Gap Check

The skill gap checker compares resume skills against target job description skills.

### Output

- Matched skills.
- Missing skills.
- Job match score.
- Skill-specific recommendations.
- Suggested learning resources where applicable.

### Matching approach

The app uses local skill parsing and canonical skill normalization. It does not rely on fake market data or unsupported live scraping.

---

## 14. AI Study Roadmap

The roadmap endpoint is:

```text
src/app/api/roadmap/route.ts
```

### Inputs

- Resume text.
- Job description text.
- Target date.
- Optional focus areas.

### Output

The roadmap includes:

- Honest diagnosis summary.
- Top gaps.
- Week-by-week phases.
- Tasks.
- Time estimates.
- Verified free resources when matched.
- Milestones.
- Success metrics.
- Honest warning.

### AI safeguards

The roadmap system includes:

- Supabase auth check.
- IP/user rate limiting.
- Groq API call with fallback key support.
- JSON mode where supported.
- JSON repair attempt if needed.
- Zod schema validation.
- Verified resource matching.
- Fake resource removal.
- Error handling.

### No fake links

Roadmap resources are matched against:

```text
src/data/verified-resources.ts
```

If the AI returns a resource that does not match the verified resource list by URL/name/platform, the resource is removed from the final response.

The system does not claim live web browsing.

---

## 15. Verified Resource System

File:

```text
src/data/verified-resources.ts
```

The verified resource catalog contains curated free or free-access learning resources such as:

- The Odin Project.
- freeCodeCamp.
- MDN Web Docs.
- React official docs.
- Next.js Learn.
- TypeScript Handbook.
- Python for Everybody.
- CS50x.
- SQLBolt.
- Kaggle Learn.
- Google Machine Learning Crash Course.
- Docker Docs.
- GitHub Skills.
- roadmap.sh.

### Resource utilities

The file provides helpers to:

- Get relevant resources for skills.
- Check verified URLs.
- Normalize resource text.
- Match AI-returned resources against verified resources.

---

## 16. Skill Parser

Core file:

```text
src/lib/skill-map.ts
```

The parser turns messy skill text into canonical skills.

### Parser capabilities

- Handles aliases like `js`, `react.js`, `py`, `node.js`, `k8s`, and `scikit-learn`.
- Detects multi-word phrases.
- Avoids common false positives.
- Protects against English `go` being incorrectly detected as the Go language.
- Preserves specific tools instead of collapsing everything into broad categories.

### Specific skill preservation

The parser preserves skills such as:

- Pandas.
- NumPy.
- TensorFlow.
- PyTorch.
- Scikit-learn.
- Firebase.
- DynamoDB.
- Amazon EC2.
- Amazon S3.
- AWS Lambda.

### Skill categories

Detected skills can include a category, such as:

- Languages.
- Frontend Frameworks.
- Backend Frameworks.
- Databases & Storage.
- Cloud Infrastructure.
- DevOps.
- Data Science & Analytics.
- AI & Machine Learning.
- UI/UX Design.

---

## 17. Skill Development Page

Route:

```text
/skill-development
```

This page helps users plan learning for a target role.

### Main features

- Target role selection.
- Skill checklist.
- Readiness percentage.
- Role-based recommendations.
- Course/resource suggestions.
- Visual readiness chart.

This page is useful for students who want to plan preparation even before running a detailed resume/JD comparison.

---

## 18. Interview Prep Packs

Routes:

```text
/interview-packs
/interview-packs/[slug]
```

The app includes 6 role-based interview tracks with 150 questions each, for a total of 900 curated interview questions.

### Structure

Each role pack contains:

- Easy questions.
- Medium questions.
- Hard questions.

### Purpose

Interview packs help users prepare after identifying their gaps. The preparation is organized by role and difficulty instead of random question lists.

---

## 19. Saved Analysis Workspace

The app saves the user's latest analysis session so they can continue later.

### Saved data may include

- Resume text.
- Job description text.
- Target ready date.
- Focus areas.
- Readiness scan result.
- Job match result.
- Roadmap result.
- Milestone state in localStorage.

### User control

Users can delete saved analysis data from the Career Analyser page.

The delete flow clears:

- Supabase `analysis_sessions` rows for the user.
- Resume state.
- Job description state.
- Target date.
- Focus areas.
- Roadmap milestones.
- Demo data state.
- LocalStorage keys.
- Analysis result panels.

It does not delete the user account or profile.

---

## 20. Privacy and Trust Controls

### Current privacy behavior

- Resume/JD data may be saved only to the signed-in user's account.
- Users can delete saved analysis data.
- Route protection prevents anonymous access to private pages.
- Supabase RLS limits user-owned table access.
- Roadmap resources are verified locally.
- The app avoids fake placement guarantees.
- Readiness scores are framed as estimates.

### User-facing trust messages

The landing page and Career Analyser communicate:

- Roadmap resources come from verified sources.
- Scores are estimates, not guarantees.
- Saved analysis can be deleted.
- No fake links are shown.

---

## 21. Supabase Database

Migration file:

```text
supabase/migrations/001_init.sql
```

Documentation:

```text
supabase/README.md
```

### Tables

| Table | Purpose |
|---|---|
| `profiles` | User display name and target role |
| `analysis_sessions` | Saved resume/JD/roadmap workspace |
| `api_rate_limits` | Server/API request throttling |
| `ai_request_logs` | AI request diagnostics and telemetry |
| `skill_audits` | Legacy skill audit compatibility |
| `job_analyses` | Legacy job comparison compatibility |
| `parser_history` | Legacy parser history compatibility |

### RLS

Row Level Security is enabled for all user/private tables.

Users can access only their own:

- profile,
- analysis sessions,
- skill audits,
- job analyses,
- parser history,
- AI logs where applicable.

`api_rate_limits` includes authenticated user-specific policies and anonymous compatibility policies for IP-based server route throttling.

---

## 22. Rate Limiting

Core file:

```text
src/lib/rate-limit.ts
```

### Rate limiter behavior

- Uses Supabase-backed request counting.
- Tracks feature name, time window, user ID, IP address, and request count.
- Supports authenticated and anonymous requests.
- Retries once on insert conflict.
- Falls back to local in-memory rate limiting if Supabase fails.

The memory fallback is best-effort only and resets on serverless cold starts.

---

## 23. AI Router and Logging

Core file:

```text
src/lib/ai/groq-router.ts
```

### AI router features

- Feature-specific Groq key routing.
- Fallback keys.
- Timeout handling.
- JSON mode support.
- JSON repair attempt.
- AI request logging.
- Error-safe responses.

### AI logs

AI request logs can store:

- user ID,
- feature name,
- model used,
- fallback usage,
- key label,
- status,
- error code,
- latency.

---

## 24. Environment Variables

File:

```text
.env.example
```

### Required for core app

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

### Required for roadmap AI

```env
GROQ_API_KEY=
GROQ_ROADMAP_PRIMARY=
GROQ_ROADMAP_FALLBACK_1=
```

### Optional AI feature keys

```env
GROQ_WHY_NO_REPLY_PRIMARY=
GROQ_WHY_NO_REPLY_FALLBACK_1=
GROQ_WHY_NO_REPLY_FALLBACK_2=
GROQ_RESUME_BUILDER_PRIMARY=
GROQ_RESUME_BUILDER_FALLBACK_1=
GROQ_JD_TRANSLATE_PRIMARY=
GROQ_JD_TRANSLATE_FALLBACK_1=
```

### Optional email/contact

```env
GMAIL_SMTP_USER=
GMAIL_SMTP_PASSWORD=
GMAIL_SENDER_EMAIL=
GMAIL_SENDER_NAME=
NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT=
```

Supabase Auth handles core OTP/email flows. Gmail SMTP is only needed if custom Nodemailer email sending is explicitly used.

---

## 25. Theme System

The app supports:

- Dark mode.
- Light mode.
- Accent color packs.
- LocalStorage persistence.
- Theme initialization script to prevent flash.

Theme controls are available in navigation areas.

The current color packs include:

- Terracotta.
- Neon.
- Amber.
- Slate.

---

## 26. UI and UX Principles

The newest build follows these product rules:

- No cringe AI SaaS copy.
- No fake placement guarantees.
- No fake live web search claims.
- No broken `/tools/parser` route dependency.
- No user-selectable admin role.
- No hidden data deletion issue.
- No overclaiming readiness scores.
- Premium landing visuals with practical student-focused copy.

---

## 27. Business Model Notes

SortMySkills can support a realistic freemium business model:

### Free student tier

- Basic resume readiness scan.
- Resume/JD skill gap comparison.
- Limited roadmap generation.
- Interview prep access.

### Premium student tier

- Multiple saved target roles.
- Advanced roadmap history.
- Deeper progress tracking.
- More interview prep tooling.
- Enhanced resume improvement support.

### College partnership tier

- Placement-readiness visibility.
- Batch-level skill gap insights.
- Early intervention for students.
- Placement cell dashboards in future versions.

### Training/bootcamp partnerships

- Recommend verified free resources first.
- Optional partnerships only with trusted providers.
- No misleading resource recommendations.

---

## 28. Demo Flow

Recommended 5-minute hackathon demo flow:

1. Open landing page and show the problem statement.
2. Sign in or open dashboard.
3. Open Career Analyser.
4. Paste sample resume text.
5. Paste sample job description.
6. Run readiness scan.
7. Run skill gap check.
8. Select target date and generate roadmap.
9. Show verified resources and week-by-week phases.
10. Open interview packs.
11. Show delete saved analysis control.
12. Close with business model and impact.

---

## 29. Known Limitations

Current limitations to communicate honestly:

- Readiness score is heuristic and not a guaranteed hiring-system result.
- Roadmap quality depends on resume/JD input quality.
- Verified resources are curated locally and not live-searched.
- Rate limiting uses Supabase and a best-effort memory fallback.
- Some analytics tables are retained for legacy dashboard compatibility.
- Formspree contact form requires a configured public endpoint.
- The platform is not a replacement for real projects, networking, or interview practice.

---

## 30. Validation Checklist

Before final demo or deployment, verify:

- `npm run lint` passes.
- `npm run build` passes.
- Supabase migration has been run.
- Environment variables are configured.
- Favicon appears in browser tab.
- Landing page loads smoothly.
- Contact form works with Formspree endpoint.
- Login/signup work.
- Protected routes redirect correctly.
- Career Analyser saves and deletes sessions correctly.
- Roadmap generation works with Groq keys.
- Fake resources are not shown.
- Interview packs open correctly.
- Dashboard reads latest analysis data.

---

## 31. Core Files Reference

| File | Purpose |
|---|---|
| `src/app/(marketing)/page.tsx` | Landing page |
| `src/components/landing/MarketingHeader.tsx` | Marketing header/navigation |
| `src/components/landing/LandingAnimations.tsx` | GSAP landing animations |
| `src/components/landing/ContactForm.tsx` | Formspree contact form |
| `src/components/SmoothScrollProvider.tsx` | Lenis smooth scroll integration |
| `src/app/(app)/career-analyser/page.tsx` | Main analysis workspace |
| `src/app/api/roadmap/route.ts` | Roadmap AI API |
| `src/lib/ai/roadmap-schema.ts` | Zod schema for roadmap output |
| `src/lib/ai/groq-router.ts` | Groq routing/fallback/repair logic |
| `src/data/verified-resources.ts` | Verified resource catalog |
| `src/lib/skill-map.ts` | Skill parser and canonical mappings |
| `src/lib/rate-limit.ts` | Supabase-backed API rate limiting |
| `src/app/actions/auth.ts` | Auth actions |
| `src/app/actions/profile.ts` | Profile update action |
| `src/app/actions/analysis.ts` | Delete saved analysis action |
| `supabase/migrations/001_init.sql` | Database schema and RLS |
| `supabase/README.md` | Supabase setup instructions |
| `.env.example` | Environment variable template |

---

## Final One-Line Summary

SortMySkills turns a student's resume and a real job description into visible skills, missing gaps, a readiness estimate, a weekly preparation roadmap, verified learning resources, and role-based interview prep — while keeping saved analysis data under the user's control.
