# SortMySkills — Master UI Revamp Prompt

## Project

Repository: `YathinTHEBUILDER/SortMySkills`  
Branch: `main`  
Product: `SortMySkills`

SortMySkills is a career-intelligence platform for students and early-career applicants. It helps users normalize resume skills, compare their profile against job descriptions, find missing skills, build career roadmaps, practice interview questions, and eventually simulate career readiness through features like Career Twin.

## Inspiration

Use this Webflow template as the primary visual inspiration:

https://torivo.webflow.io/

Important: Do not copy the template directly. Use it as a design reference for structure, polish, rhythm, motion, spacing, and visual hierarchy.

The Torivo reference has:
- clean SaaS landing page structure
- rounded modern visual system
- bold but friendly hero section
- dashboard/product preview visuals
- large CTA buttons
- soft shapes and background graphics
- logo/trusted-by strip
- feature cards with product mockups
- process section
- result/stat section
- testimonial-style section
- integrations orbit/connection visual
- strong final CTA
- clean footer

Adapt this structure for SortMySkills as a career-intelligence platform, not a CRM/sales product.

## Primary Goal

Completely revamp the entire SortMySkills frontend into a professional, premium, modern SaaS interface inspired by Torivo.

The final UI should feel:
- polished
- custom
- premium
- student-friendly but professional
- startup-grade
- smooth and animated
- demo-ready for hackathon judges
- much better than a generic AI-generated SaaS template

Do not make it look vibecoded.

## Critical Rules

Do not break existing functionality.

Do not break:
- Supabase auth
- login/signup
- email OTP verification
- forgot password/reset password
- protected routes
- dashboard
- skill-development page
- job-match page
- interview-packs page
- parser tool
- skill parser logic
- existing data files
- route structure
- theme controls
- build process

Preserve all working business logic.

## Existing Routes To Preserve

Make sure these routes continue to work:

```txt
/
/dashboard
/login
/signup
/auth/verify
/forgot-password
/reset-password
/skill-development
/job-match
/interview-packs
/tools/parser
```

If `/career-twin` exists, preserve and redesign it too. If it does not exist yet, add it only if the current app structure supports it cleanly.

## Design Direction

Create a Torivo-inspired career SaaS design system.

Use:
- large rounded cards
- soft gradient backgrounds
- floating dashboard panels
- friendly but premium typography
- glowing but subtle CTA buttons
- animated product preview cards
- clean section spacing
- process blocks
- feature showcases
- stat/result sections
- integration/skill orbit graphics
- polished footer
- responsive layouts

Avoid:
- harsh neon cyberpunk
- cluttered dashboards
- flat plain beige UI
- generic shadcn-only appearance
- childish gamification
- too many borders
- tiny unreadable text
- overuse of monospace
- broken mobile layouts

## New Brand Feel

SortMySkills should feel like:

> “A career operating system for students.”

Not:

> “A basic resume checker.”

The UI should communicate:
- clarity
- confidence
- progress
- transformation
- career readiness
- practical placement preparation

## Color Scheme

Replace the current flat warm palette with a refined Torivo-inspired warm SaaS palette.

### Light Mode

Use this palette:

```css
--background: #F8F3EA;
--background-soft: #EFE6D8;
--surface-card: #FFFFFF;
--surface-card-warm: #FFF9F0;
--surface-muted: #E8D8C2;
--surface-hover: #F1E4D2;

--text-primary: #171717;
--text-secondary: #625B52;
--text-muted: #938879;

--border-muted: rgba(23, 23, 23, 0.10);
--border-strong: rgba(23, 23, 23, 0.18);

--accent-primary: #E36B4F;
--accent-primary-dark: #C9573F;
--accent-secondary: #D9A66F;
--accent-tertiary: #7E9F82;
--accent-ink: #25211D;

--success: #6F9B7A;
--warning: #D99A4E;
--danger: #D96A5F;
```

### Dark Mode

Use this palette:

```css
--background: #10100F;
--background-soft: #171615;
--surface-card: #1E1B18;
--surface-card-warm: #252018;
--surface-muted: #302920;
--surface-hover: #3A3127;

--text-primary: #FFF8EC;
--text-secondary: #C7B9A7;
--text-muted: #8E8172;

--border-muted: rgba(255, 248, 236, 0.10);
--border-strong: rgba(255, 248, 236, 0.18);

--accent-primary: #EF7A5F;
--accent-primary-dark: #D6674F;
--accent-secondary: #E0B178;
--accent-tertiary: #91B894;
--accent-ink: #FFF8EC;

--success: #91B894;
--warning: #E0A65C;
--danger: #E57366;
```

## Token Compatibility

Maintain compatibility with existing Tailwind/theme utility names.

Do not break existing classes such as:

```txt
bg-bg-dark
bg-bg-warm
bg-surface-card
bg-surface-hover
text-text-primary
text-text-secondary
text-accent-green
text-accent-cyan
fine-line
fine-border-t
fine-border-b
dot-grid-overlay
grid-bg-overlay
mono-tag
```

You may remap them to the new palette, but do not remove them unless every usage is updated safely.

## Global CSS Revamp

Update `src/app/globals.css`.

Add a professional design system.

### Utility Classes

Create or refine:

```css
.section-shell
.container-shell
.premium-card
.glass-card
.soft-card
.warm-gradient-bg
.hero-gradient
.orb-bg
.noise-overlay
.eyebrow
.hero-display
.section-title
.section-copy
.primary-cta
.secondary-cta
.feature-card
.stat-card
.process-card
.dashboard-preview-card
.floating-panel
.animated-border
.reveal-up
.hover-lift
.magnetic-card
```

### Background System

Add:
- soft radial gradients
- subtle noise overlay using CSS
- faint dot/grid pattern
- warm orange glow
- muted green accent glow
- no heavy neon

Example feel:
- Torivo’s friendly SaaS shapes
- modern cream background
- dashboard cards floating over soft gradient fields

### Motion System

Add CSS animations:
- fade-up
- soft-float
- slow-spin
- shimmer
- pulse-glow
- slide-in
- scale-in
- marquee

Respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

## Animation Requirements

Use the existing animation stack if present.

Preferred:
- CSS animations for lightweight background movement
- GSAP or Framer Motion for page reveals if already installed
- no unnecessary new animation libraries

Animate:
- navbar entry
- hero text reveal
- hero dashboard mockup reveal
- floating cards
- feature cards on scroll
- process steps
- stats counting appearance
- CTA hover
- skill chips moving subtly
- dashboard cards hover-lift

Do not overanimate. Keep it premium.

## Master Landing Page Revamp

File likely:

```txt
src/app/(marketing)/page.tsx
```

Completely redesign the landing page using the Torivo structure adapted to SortMySkills.

### Landing Page Sections

#### 1. Navbar

Create a polished sticky navbar.

Requirements:
- rounded/frosted container
- logo left
- nav links:
  - Product
  - Tools
  - Career Twin
  - Interview Packs
  - Roadmap
- right side:
  - ThemeControls
  - if logged out: Sign in + Get Started
  - if logged in: Dashboard + Sign out
- mobile menu support
- smooth hover states
- no broken auth behavior

#### 2. Hero Section

Torivo-style big hero.

Content:

Eyebrow:

```txt
Career intelligence for students
```

Headline:

```txt
Turn scattered skills into a clear career roadmap.
```

Subheadline:

```txt
SortMySkills analyzes your resume, compares it with real job descriptions, detects skill gaps, and shows the fastest path to become placement-ready.
```

Primary CTA:

```txt
Start Skill Audit
```

Secondary CTA:

```txt
Try Job Match
```

Optional third small link:

```txt
Explore Career Twin
```

Hero should include:
- large rounded dashboard preview
- skill chips transforming into normalized tags
- readiness score preview
- missing skills preview
- role fit preview
- warm gradient shape
- floating cards
- subtle animated circular/arc element

Do not use generic stock images.

Build the hero visual using HTML/CSS components.

#### 3. Trusted/Signal Strip

Inspired by Torivo’s “Trusted by” strip, but adapted.

Instead of fake brand logos, use trust/signal pills:

```txt
Built for students
Resume to roadmap
Role-fit scoring
900+ interview questions
Skill parser
Job-match engine
Career Twin simulator
```

Use a horizontal marquee or wrapped pill strip.

#### 4. Features Section

Section label:

```txt
Product features
```

Heading:

```txt
Everything you need to move from confusion to clarity.
```

Feature cards:
1. Skill DNA
2. Job Match Engine
3. Career Twin
4. Skill Gap Roadmap
5. Interview Packs
6. Parser Tool

Each feature card should include:
- icon
- short description
- mini UI mockup
- link/CTA
- hover animation

#### 5. Product Showcase Section

Create a Torivo-like product preview section with tabs/cards.

Tabs:
- Skill Audit
- Job Match
- Career Twin
- Interview Prep

Each tab/card should show:
- preview UI
- what the user gets
- CTA link to relevant route

If interactive tabs are too much, static cards are fine.

#### 6. Process Section

Inspired by Torivo’s “Our process”.

Heading:

```txt
Your career clarity flow
```

Steps:

```txt
01 — Import your skills
Paste your resume, skills, or project description.

02 — Decode your profile
SortMySkills normalizes messy skills into structured career signals.

03 — Compare with real roles
See match score, missing skills, role readiness, and rejection risks.

04 — Follow the roadmap
Get learning actions, interview packs, and practical next steps.
```

Use numbered cards with connecting line/shape.

#### 7. Results/Stats Section

Inspired by Torivo’s results area.

Use real product metrics, not fake company metrics.

Stats:

```txt
900+ Interview Questions
6 Role Tracks
20+ Skill Categories
3-Minute Career Audit
```

If exact values differ based on current data, adapt them accurately.

Animate numbers if easy, but do not break SSR.

#### 8. Career Twin Highlight Section

Make this the standout section.

Heading:

```txt
Meet your Career Twin.
```

Copy:

```txt
A live simulation of your current career profile. See which roles are realistic, where you might get rejected, and what changes if you learn a new skill.
```

Show a visual:
- “Current Identity”
- “Strongest Role”
- “Risky Role”
- “Fastest Growth Lever”
- What-if buttons:
  - Learn TypeScript
  - Add SQL Project
  - Deploy Portfolio
  - Practice DSA

CTA:

```txt
Generate Career Twin
```

If `/career-twin` does not exist yet, CTA can point to `/dashboard` or `/job-match`.

#### 9. Integrations/Skill Orbit Section

Inspired by Torivo integrations section.

Instead of external tools, create a “Skill Ecosystem” orbit visual.

Center:

```txt
SortMySkills
```

Orbit nodes:

```txt
React
Python
SQL
TypeScript
Git
Figma
Node.js
Machine Learning
Product
Cloud
```

Use CSS circles/orbit/floating cards.

Heading:

```txt
Connect your skills into one clear career map.
```

#### 10. Testimonial/Sample Result Section

Do not use fake real-person testimonials unless clearly sample/demo.

Instead use “Sample student outcome”.

Example:

```txt
Before:
“I know React and Python but don’t know where I fit.”

After SortMySkills:
Best-fit role: Frontend Intern
Readiness: 72%
Missing: TypeScript, API Integration
Fastest fix: Build one typed React dashboard
```

Make this a polished before/after card.

#### 11. Final CTA

Torivo-style CTA section.

Heading:

```txt
Ready to stop guessing your career path?
```

Copy:

```txt
Create your skill profile, compare it with real roles, and get a roadmap you can act on today.
```

Buttons:

```txt
Get Started Free
Open Dashboard
```

#### 12. Footer

Create a clean footer with:
- logo
- short product description
- product links
- tools links
- account links
- social placeholder or GitHub link
- copyright

Do not include irrelevant Torivo/Webflow links.

## Dashboard UI Revamp

Files likely:

```txt
src/app/(app)/dashboard/page.tsx
src/components/dashboard/DashboardShell.tsx
src/components/dashboard/Sidebar.tsx
```

Make the dashboard match the new landing page design.

### Dashboard Requirements

Create a professional app workspace:
- rounded sidebar
- soft background
- premium cards
- topbar with user/profile area
- active nav states
- responsive mobile sidebar
- dashboard cards for modules

Dashboard content should show:
- welcome message
- Career Readiness snapshot
- Skill DNA summary
- Quick actions
- Recent analysis placeholder
- Recommended next action
- cards linking to:
  - Skill Development
  - Job Match
  - Interview Packs
  - Parser Tool
  - Career Twin if available

Do not leave it looking like a plain admin panel.

## Sidebar Revamp

Sidebar should include:

```txt
Dashboard
Skill Development
Job Match
Career Twin
Interview Packs
Parser Tool
Settings/Profile if available
```

If a route does not exist, do not link to it unless you create it properly.

Use:
- active route highlight
- rounded nav items
- icons
- collapsed/mobile behavior
- sign out control
- theme toggle preserved

## Auth Pages Revamp

Redesign:

```txt
src/app/login/page.tsx
src/app/signup/page.tsx
src/app/auth/verify/page.tsx
src/app/forgot-password/page.tsx
src/app/reset-password/page.tsx
```

### Auth Design

Use:
- centered premium card or split layout
- warm gradient background
- logo
- clear form labels
- polished inputs
- strong CTA button
- subtle side visual
- error/success messages
- loading states
- responsive design

OTP page:
- 6-digit OTP boxes
- paste support if already implemented
- resend timer
- premium card design
- clear copy

Do not break Supabase auth actions.

## Tool Pages Revamp

Redesign visually without breaking logic:

```txt
src/app/(app)/skill-development/page.tsx
src/app/(app)/job-match/page.tsx
src/app/(app)/interview-packs/page.tsx
src/app/(app)/tools/parser/page.tsx
```

### Skill Development Page

Make it feel like a role roadmap builder:
- role cards
- readiness meter
- missing skills
- roadmap panels
- course/path recommendations
- better charts/cards
- responsive layout

### Job Match Page

Make it feel like a comparison lab:
- two polished input panels
- resume vs JD
- animated analyze button
- score card
- matched/missing/supplementary skills
- suggested next steps
- Career Twin CTA if available

### Interview Packs Page

Make it feel like a professional prep library:
- role cards
- difficulty badges
- question counts
- search/filter if simple
- better empty/loading states
- polished detail pages if present

### Parser Tool Page

Make it feel like a skill normalization engine:
- raw input
- normalized output
- skill categories
- confidence/status indicators
- example chips
- clean CTA to Job Match

## Component System

Create reusable UI components if helpful:

```txt
src/components/ui/SectionHeader.tsx
src/components/ui/MetricCard.tsx
src/components/ui/FeatureCard.tsx
src/components/ui/ProductPreview.tsx
src/components/ui/StatusBadge.tsx
src/components/ui/AnimatedButton.tsx
src/components/ui/SkillChip.tsx
src/components/ui/MockDashboard.tsx
```

Do not over-abstract if it slows implementation. Use reusable components only where useful.

## Copywriting Direction

Replace generic copy with sharper product language.

Use phrases like:
- “career intelligence”
- “skill clarity”
- “role readiness”
- “gap radar”
- “career roadmap”
- “placement-ready”
- “rejection risks”
- “what-if career simulator”
- “from scattered skills to structured direction”

Avoid:
- generic “manage your business”
- CRM/sales wording from Torivo
- fake testimonials
- overpromising guaranteed jobs

## Responsive Requirements

Everything must work on:
- mobile
- tablet
- desktop
- large desktop

Check:
- navbar
- hero
- dashboard cards
- sidebar
- auth forms
- input panels
- feature grids
- CTA sections

No horizontal overflow.

## Accessibility Requirements

Ensure:
- proper semantic headings
- visible focus states
- labels for form inputs
- buttons have accessible text
- color contrast is strong
- keyboard navigation works
- links are real links
- no important text only inside images

## Technical Requirements

Before editing:
1. Inspect the current structure.
2. Identify existing components and route groups.
3. Do not blindly overwrite files.
4. Preserve working imports and server/client boundaries.

Important:
- Server components should not use client-only hooks.
- Client components should include `"use client"` only when needed.
- Do not call server actions incorrectly.
- Do not break Next.js App Router conventions.
- Do not introduce hydration errors.
- Do not use browser APIs in server components.
- Do not add paid APIs.
- Do not add external image dependencies.
- Avoid huge new packages.

## File Priority

Start with:

```txt
src/app/globals.css
src/app/(marketing)/page.tsx
src/components/Logo.tsx
src/components/ThemeControls.tsx
src/components/ui/Button.tsx
src/components/dashboard/DashboardShell.tsx
src/components/dashboard/Sidebar.tsx
src/app/(app)/dashboard/page.tsx
```

Then update auth pages.

Then update tool pages.

## Suggested Implementation Order

1. Audit current app structure.
2. Update global tokens and design utilities.
3. Build landing page hero and sections.
4. Build reusable cards/buttons/badges if needed.
5. Revamp dashboard shell/sidebar.
6. Revamp dashboard page.
7. Revamp auth pages.
8. Revamp tool pages.
9. Ensure navigation is consistent.
10. Run build.
11. Fix all errors.
12. Polish mobile responsiveness.

## Build Commands

Run:

```bash
npm install
npm run build
```

If lint exists:

```bash
npm run lint
```

Fix all errors before final output.

## Quality Bar

The final product should look like a real funded SaaS landing page and dashboard, not a student prototype.

It should feel inspired by Torivo’s:
- clean SaaS sections
- rounded visual language
- warm/friendly product graphics
- dashboard previews
- strong CTAs
- process/stat/integration sections

But it must be clearly SortMySkills:
- career intelligence
- resume skill parser
- job match
- Career Twin
- interview prep
- student placement roadmap

## Final Acceptance Checklist

The revamp is complete only if:

- Landing page looks fully redesigned and premium
- Dashboard looks like a real product workspace
- Auth pages look polished and consistent
- Tool pages no longer look basic/plain
- New color system is applied globally
- Animations are smooth and subtle
- Mobile layout works
- Existing functionality still works
- Supabase auth still works
- Protected routes still work
- Build passes
- No TypeScript errors
- No broken imports
- No broken links
- No Torivo/CRM placeholder copy remains
- No fake brand logos/testimonials are used

## Final Deliverable

After implementation, provide:
1. Summary of all files changed.
2. Explanation of the new UI system.
3. Confirmation that build passes.
4. Any remaining issues or TODOs.
