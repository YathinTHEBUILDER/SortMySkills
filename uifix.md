Copy-paste this into Antigravity / Cursor / Claude Code:

````md
# MASTER PROMPT — Completely Rebuild SortMySkills Landing Page with Best-in-Class GSAP + Lenis Animations

You are working on:

`YathinTHEBUILDER/SortMySkills`

Your task is to completely rebuild the landing page experience for SortMySkills.

The current landing page is visually decent, but I want a totally new structure, totally new content, and a much more premium animated experience inspired by the interaction quality of:

- `gsap.com`
- `lenis.dev`

This should feel like a best-in-class modern interactive SaaS landing page, not a generic hackathon homepage.

The landing page must feel:

- premium
- smooth
- cinematic
- useful
- student-focused
- sharp
- non-cringe
- highly animated
- technically impressive
- credible
- polished enough for demo day

Do not make it look “vibecoded”.
Do not make it look like a template.
Do not make it childish.
Do not use generic AI SaaS copy.
Do not use cringe words like:
“unlock”, “supercharge”, “revolutionize”, “next-gen”, “ecosystem”, “command center”, “operating system”, “destiny”, “AI-powered future”, “game-changing”, “hustle”, “grind”, “10x”.

---

## CRITICAL SAFETY RULES

Do not break the app.

Preserve:

- Next.js App Router structure
- Auth flow
- Supabase integration
- Middleware route protection
- Dashboard
- Career Analyser
- Skill Development
- Interview Packs
- Profile
- Theme system
- Dark/light mode
- Existing CSS variables
- Existing `ButtonLink`
- Existing `Logo`
- Existing `MarketingHeader`
- Existing `LandingAnimations` if useful, but you may rewrite it safely
- Existing GSAP and Lenis dependencies
- Existing route protection behavior

Do not:

- Remove authentication logic
- Convert the whole app into a client app unnecessarily
- Add paid APIs
- Add fake claims
- Break routes
- Add random demo pages
- Add external animation libraries beyond existing GSAP/Lenis
- Introduce heavy 3D dependencies unless already installed
- Use images from the internet
- Use fake testimonials
- Claim guaranteed placement
- Claim live web search
- Claim real ATS certification
- Claim recruiter approval

Before stopping, run:

```bash
npm run lint
npm run build
````

If `npm run lint` fails because `next lint` is unsupported, update `package.json` safely:

```json
"lint": "eslint ."
```

Then rerun lint and build.

---

# PRODUCT CONTEXT

SortMySkills helps students and early-career candidates answer four practical questions:

1. What skills do I actually show in my resume?
2. What does this job description actually require?
3. What skills am I missing?
4. What should I do next?

Core features:

* Resume text analysis
* Job description comparison
* Skill extraction and normalization
* Resume readiness estimate
* Skill gap detection
* AI-generated roadmap using verified free resources
* Interview prep packs
* Saved analysis workspace
* Delete saved data anytime

This homepage should explain the product in a clear, visually powerful way.

---

# TECH STACK CONTEXT

The project uses:

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS 4
* Supabase
* GSAP
* Lenis
* Recharts
* lucide-react
* Sonner
* Zod

Use GSAP and Lenis intentionally.

Do not install unnecessary packages.

---

# FILES TO INSPECT FIRST

Inspect these before editing:

```txt
src/app/(marketing)/page.tsx
src/components/landing/MarketingHeader.tsx
src/components/landing/LandingAnimations.tsx
src/components/LenisProvider.tsx
src/components/SmoothScroll.tsx
src/app/globals.css
src/components/ui/Button.tsx
src/components/Logo.tsx
src/data/verified-resources.ts
src/data/interview-packs/
README.md
```

Then rebuild the landing page safely.

---

# MAIN GOAL

Completely replace the current landing page with a new experience.

Do not just tweak text.

Rebuild the structure, content, and animation system.

The new landing page should feel like this:

> A student pastes a messy resume. The page visually transforms that chaos into clean skills, missing gaps, a job-readiness score, and a practical roadmap.

The animation story should match the product story.

---

# NEW LANDING PAGE STRUCTURE

Build the landing page with this new structure:

1. Animated header
2. Cinematic hero
3. Scroll-driven resume transformation section
4. Interactive product workflow section
5. Skill gap visual section
6. Roadmap timeline section
7. Interview prep section
8. Privacy and trust section
9. Final CTA
10. Footer

This should be structurally different from the current page.

---

# SECTION 1 — HEADER

File:

```txt
src/components/landing/MarketingHeader.tsx
```

Keep it clean and minimal.

Header nav:

```txt
Product
Workflow
Roadmap
Interview Prep
```

Suggested anchors:

```txt
#product
#workflow
#roadmap
#interview-prep
```

Right side:

Logged out:

* `Sign In` → `/login`
* `Start Free` → `/signup`

Logged in:

* `Dashboard` → `/dashboard`
* `Sign out`

Keep theme controls.

Animation:

* Header should slide/fade in on page load.
* On scroll, header should subtly compress or add stronger blur/shadow.
* Do not make it jumpy.
* Keep mobile drawer clean and usable.

---

# SECTION 2 — CINEMATIC HERO

The hero should be bold and direct.

## Eyebrow

```txt
Placement prep without guesswork
```

## Main headline

Use this:

```txt
See what your resume is missing before you apply.
```

This should be large, premium, and animated word-by-word.

## Subheadline

```txt
Paste your resume and a job description. SortMySkills finds visible skills, missing requirements, and the next steps to close the gap.
```

## CTAs

Logged out:

Primary:

```txt
Start Free Analysis
```

href:

```txt
/signup
```

Secondary:

```txt
See Workflow
```

href:

```txt
#workflow
```

Logged in:

Primary:

```txt
Open Dashboard
```

href:

```txt
/dashboard
```

Secondary:

```txt
Open Analyser
```

href:

```txt
/career-analyser
```

## Hero visual concept

Create a large animated visual on the right or below the headline:

A split card showing:

Left:

```txt
messy resume text
```

Middle:

```txt
→ parsing
```

Right:

```txt
clean skill signals
```

Sample messy text:

```txt
Built React dashboards, used Python scripts, worked with SQL, Git, APIs, and basic Docker deployments.
```

Detected skill chips:

```txt
React
Python
SQL
Git
REST APIs
Docker
```

Score chips:

```txt
Job match: 72%
Missing: TypeScript, API testing
Next step: Build one typed dashboard
```

Hero animations:

* Text reveal with GSAP stagger.
* Resume card slides in with blur-to-sharp reveal.
* Skill chips pop in one by one.
* Score card animates from 0 to final value.
* Subtle floating motion on cards.
* Smooth parallax with scroll.

Must respect reduced motion.

---

# SECTION 3 — SCROLL-DRIVEN RESUME TRANSFORMATION

Anchor:

```tsx
id="product"
```

This should be the most impressive section.

Concept:

As the user scrolls, a messy resume block transforms into structured output.

Use GSAP ScrollTrigger if already available through GSAP. If ScrollTrigger is not registered yet, import and register it safely.

Sequence:

1. A large “raw resume” card appears.
2. Keywords inside it get highlighted.
3. Lines visually separate into categories.
4. Skill chips move into a clean grid.
5. A result panel appears:

   * Matched skills
   * Missing skills
   * Readiness estimate
   * Suggested next action

Content:

Heading:

```txt
From messy resume text to clear signals.
```

Subtext:

```txt
Students write skills in different ways. SortMySkills standardizes the language so your resume and job descriptions can be compared more clearly.
```

Panels:

Raw input:

```txt
“React.js, JS, Python automation, SQL basics, docker deployment, worked with APIs…”
```

Clean skills:

```txt
React
JavaScript
Python
SQL
Docker
REST APIs
```

Missing for target role:

```txt
TypeScript
Testing
API integration
```

Next action:

```txt
Build one typed React project with API calls and tests.
```

Animations:

* Pin the section briefly on desktop.
* Use scroll progress to animate each transformation step.
* On mobile, avoid heavy pinning; use simpler reveals.
* Do not cause horizontal overflow.
* Do not break normal scrolling.

---

# SECTION 4 — INTERACTIVE PRODUCT WORKFLOW

Anchor:

```tsx
id="workflow"
```

Heading:

```txt
One workflow. Four answers.
```

Subheading:

```txt
Bring your resume and a job description. The app turns them into a practical prep plan.
```

Create 4 horizontal or vertical steps:

## Step 01

Title:

```txt
Paste your resume
```

Description:

```txt
Use plain text from your resume. The analyser reads visible skills, sections, and signals.
```

## Step 02

Title:

```txt
Add a target job
```

Description:

```txt
Paste the job description you want to compare against.
```

## Step 03

Title:

```txt
Find the gaps
```

Description:

```txt
See matched skills, missing skills, readiness estimate, and fixes that matter.
```

## Step 04

Title:

```txt
Follow the roadmap
```

Description:

```txt
Get a week-by-week plan with verified free resources and interview prep.
```

Animation:

* Step cards should animate sequentially as user scrolls.
* Use a progress line that fills from step 1 to 4.
* Active step should glow or elevate.
* Use GSAP scrub animation for the line.
* Keep it performant.

CTA:

```txt
Try Career Analyser
```

href:

```txt
/career-analyser
```

---

# SECTION 5 — SKILL GAP VISUAL

Heading:

```txt
Know what is missing, not just what is present.
```

Subheading:

```txt
A resume can look good and still miss the exact skills a role expects. SortMySkills separates matched skills from real gaps.
```

Create a comparison layout:

Left card:

```txt
Your resume shows
React
Python
SQL
Git
Docker
```

Right card:

```txt
Role expects
React
TypeScript
API integration
Testing
Git
```

Middle result:

```txt
Matched
React
Git

Missing
TypeScript
API integration
Testing
```

Animation:

* Cards slide in from opposite sides.
* Matching skills connect with animated lines.
* Missing skills pulse subtly.
* Avoid SVG complexity if too risky.
* Can be done with simple CSS/absolute lines.

CTA:

```txt
Compare a Job Description
```

href:

```txt
/career-analyser
```

---

# SECTION 6 — ROADMAP TIMELINE

Anchor:

```tsx
id="roadmap"
```

Heading:

```txt
Turn gaps into a weekly plan.
```

Subheading:

```txt
Roadmaps are generated from your resume, target job, deadline, and focus areas. Resources come from a verified free-resource list — no fake links.
```

Create a premium timeline with 4 phases:

## Phase 1

Title:

```txt
Fix the resume
```

Details:

```txt
Make missing skills visible. Improve sections, wording, and project proof.
```

## Phase 2

Title:

```txt
Close the skill gaps
```

Details:

```txt
Use verified free resources to learn the exact skills the role expects.
```

## Phase 3

Title:

```txt
Build proof
```

Details:

```txt
Create one focused project that demonstrates the missing requirements.
```

## Phase 4

Title:

```txt
Prepare and apply
```

Details:

```txt
Use interview packs and a sharper resume before sending applications.
```

Animation:

* Timeline should draw itself on scroll.
* Phase cards should reveal with stagger.
* Add small animated checkmarks.
* Do not overdo motion.

CTA:

```txt
Generate My Roadmap
```

href:

```txt
/career-analyser
```

---

# SECTION 7 — INTERVIEW PREP SECTION

Anchor:

```tsx
id="interview-prep"
```

Heading:

```txt
Practice after you know the gaps.
```

Subheading:

```txt
Interview packs are organized by role and difficulty, so prep does not feel random.
```

Show role cards:

```txt
Frontend
Backend
Data Analyst
Machine Learning
UX Designer
Product
```

Each card can show:

* Easy
* Medium
* Hard

Do not claim an exact number unless verified from the data folder.

If exact count is confirmed, use it consistently.

If not confirmed, use:

```txt
Role-based interview packs
```

Animation:

* Cards fan in or stack-unstack on scroll.
* On hover, card tilts slightly or reveals difficulty levels.
* Keep accessible and keyboard-friendly.

CTA:

```txt
Browse Interview Packs
```

href:

```txt
/interview-packs
```

---

# SECTION 8 — PRIVACY AND TRUST

Heading:

```txt
Your resume data stays under your control.
```

Subheading:

```txt
Saved analysis helps you continue later. You can delete saved resume, job description, roadmap, and milestone data anytime.
```

Trust cards:

1.

Title:

```txt
No fake resource links
```

Description:

```txt
Roadmap resources are matched against a verified local catalog.
```

2.

Title:

```txt
No placement guarantees
```

Description:

```txt
Readiness scores are estimates to guide preparation, not promises.
```

3.

Title:

```txt
Delete saved analysis
```

Description:

```txt
Clear your saved resume and job description data from the analyser page.
```

4.

Title:

```txt
Built for student workflows
```

Description:

```txt
The product focuses on resumes, job descriptions, skill gaps, roadmaps, and interview prep.
```

Animation:

* Cards reveal with subtle y movement and opacity.
* Use no aggressive spinning here.

---

# SECTION 9 — FINAL CTA

Heading:

```txt
Start with one resume and one job description.
```

Subheading:

```txt
In a few minutes, you will know what matches, what is missing, and what to work on next.
```

Buttons:

Logged out:

* `Start Free Analysis` → `/signup`
* `Sign In` → `/login`

Logged in:

* `Open Dashboard` → `/dashboard`
* `Open Career Analyser` → `/career-analyser`

Animation:

* CTA card should have premium animated border.
* Subtle background glow.
* No cringe text.

---

# SECTION 10 — FOOTER

Footer text:

```txt
SortMySkills helps students compare their resume with real job descriptions, identify missing skills, and prepare with a clearer plan.
```

Footer links:

Workspace:

* Career Analyser → `/career-analyser`
* Skill Roadmap → `/skill-development`
* Interview Prep → `/interview-packs`
* Dashboard → `/dashboard`

Account:

* Sign In → `/login`
* Create Account → `/signup`

Remove all `/tools/parser` links unless the route exists.

---

# ANIMATION REQUIREMENTS

Use GSAP + Lenis properly.

The animation system should include:

## Page load animations

* Header fade/slide in
* Hero eyebrow reveal
* Hero headline word-by-word reveal
* Hero subtext reveal
* CTA reveal
* Hero visual card reveal
* Skill chips stagger reveal

## Scroll animations

* Section reveal with staggered children
* Scroll-triggered resume transformation
* Workflow progress line
* Skill comparison connections
* Roadmap timeline draw
* Interview cards reveal
* CTA reveal

## Microinteractions

* Button hover lift
* Card hover tilt or glow
* Chip hover response
* Header blur on scroll
* Smooth anchor scroll with Lenis

## Motion quality

* Use easing similar to premium animation:

  * `power3.out`
  * `power4.out`
  * `expo.out`
  * `back.out(1.4)`
* Avoid cheap bouncing.
* Avoid constant excessive movement.
* Keep animations tasteful.

## Reduced motion

Respect user preference:

```ts
window.matchMedia("(prefers-reduced-motion: reduce)")
```

If reduced motion is enabled:

* disable heavy GSAP timelines
* show all elements visible
* keep page fully usable

## Performance

* Avoid animating layout-heavy properties where possible.
* Prefer:

  * transform
  * opacity
  * clip-path carefully
* Avoid huge blur animations on many elements.
* Avoid scroll jank.
* Kill GSAP ScrollTriggers on unmount.
* Do not create memory leaks.

---

# LENIS REQUIREMENTS

Check existing Lenis/SmoothScroll setup.

If Lenis is already globally active:

* do not duplicate it
* use existing provider

If not active:

* implement it safely in the existing scroll component
* ensure it works with GSAP ScrollTrigger

If using ScrollTrigger with Lenis:

* call `ScrollTrigger.update` on Lenis scroll
* keep `requestAnimationFrame` clean
* clean up on unmount

Do not create multiple Lenis instances.

---

# CSS REQUIREMENTS

Use existing theme variables where possible:

```css
var(--background)
var(--surface-card)
var(--surface-soft)
var(--border-muted)
var(--border-strong)
var(--accent-primary)
var(--accent-secondary)
var(--accent-tertiary)
```

Add new CSS classes only if needed.

Suggested classes:

```css
.landing-shell
.hero-word
.reveal-section
.reveal-item
.resume-transform-section
.workflow-line
.animated-gradient-border
.noise-layer
.magnetic-card
.skill-connection-line
.roadmap-line
```

Keep CSS organized in `globals.css` or existing landing CSS area.

Do not hardcode too many random colors.
Keep dark/light mode working.

---

# CONTENT STYLE RULES

Use simple, serious, student-focused copy.

Good:

```txt
See what your resume is missing before you apply.
Paste your resume and a job description.
Find matched skills, missing skills, and next steps.
Roadmaps use verified free resources.
Delete saved analysis anytime.
```

Bad:

```txt
Unlock your potential.
Supercharge your career.
AI-powered career operating system.
Revolutionary skill intelligence.
Normalizer sandbox.
Career DNA.
Unified orbit.
Command center.
```

---

# ROUTE SAFETY

Use only existing safe routes:

```txt
/
 /signup
 /login
 /dashboard
 /career-analyser
 /skill-development
 /interview-packs
 /profile
```

Do not link to:

```txt
/tools/parser
```

unless you actually create that route.

For homepage feature CTAs, prefer:

```txt
/career-analyser
/interview-packs
/dashboard
/signup
/login
```

---

# QUESTION COUNT SAFETY

Inspect:

```txt
src/data/interview-packs/
docs/INTERVIEW_PACKS.md
README.md
```

Find the actual number of interview questions.

If confirmed, use the correct number consistently.

If not confirmed, avoid exact numbers and use:

```txt
role-based interview packs
```

Do not use `900+` unless the data actually supports it.

---

# IMPLEMENTATION PLAN

## Step 1 — Inspect current files

Read:

```txt
src/app/(marketing)/page.tsx
src/components/landing/MarketingHeader.tsx
src/components/landing/LandingAnimations.tsx
src/app/globals.css
src/components/LenisProvider.tsx
src/components/SmoothScroll.tsx
src/components/ui/Button.tsx
```

Understand existing animation setup before editing.

## Step 2 — Rebuild landing page structure

Replace the current landing page sections with the new structure.

Use clean JSX.
Keep it readable.
Avoid one massive unreadable component if possible.

If needed, create local arrays for section data.

## Step 3 — Rebuild animation logic

Update or replace:

```txt
src/components/landing/LandingAnimations.tsx
```

Implement:

* hero load timeline
* section reveal animations
* scroll-triggered resume transform
* workflow progress
* roadmap timeline
* reduced motion handling
* cleanup on unmount

## Step 4 — Update header anchors

Update:

```txt
src/components/landing/MarketingHeader.tsx
```

Make anchors match the new landing page:

```txt
#product
#workflow
#roadmap
#interview-prep
```

## Step 5 — Update CSS

Update:

```txt
src/app/globals.css
```

Add only necessary animation/layout helper classes.

Keep existing classes if still used elsewhere.

Do not break dashboards.

## Step 6 — Remove broken links

Search:

```txt
/tools/parser
#tools-preview
```

Remove or replace.

## Step 7 — Validate

Run:

```bash
npm run lint
npm run build
```

Fix everything.

---

# QUALITY BAR

The final landing page should feel like:

* smooth scroll experience
* animated product story
* premium SaaS polish
* clear student-focused value
* strong enough for hackathon judges
* not bloated
* not gimmicky
* not cringe
* not broken

The page should immediately communicate:

```txt
Paste resume + paste JD → see gaps → get plan → prepare better.
```

---

# FINAL REPORT FORMAT

When done, report:

```txt
Changed files:
- ...

New landing page sections:
- ...

Animation system:
- ...

Route/link fixes:
- ...

Question count used:
- ...

Validation:
- npm run lint: passed / failed
- npm run build: passed / failed

Remaining limitations:
- ...
```

Be honest.

Do not say lint/build passed unless actually run.
Do not leave broken routes.
Do not leave broken anchors.
Do not leave fake claims.
Do not break the rest of the app.

```
```
