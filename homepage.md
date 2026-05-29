# Skillqore — Premium Animated Homepage Build Prompt

## Purpose

Use this prompt to build a visually enhanced, animation-heavy homepage for **Skillqore**, inspired by the motion quality, smoothness, and premium frontend feel of **Lenis.dev** and **GSAP.com**.

Skillqore is an AI career broker for students. It diagnoses a student's current skill level, identifies gaps, recommends Coursera/free resources, generates company-specific roadmaps, improves resumes, and tracks applications.

The homepage must feel like a serious AI SaaS / developer-tool launch page, not a generic hackathon landing page.

---

## Core Product Positioning

**Skillqore** helps students answer one question:

> “What exactly should I do to become ready for my target role/company?”

It does this through:

- **SkillScan** — initial diagnostic test
- **QoreScore** — career readiness and ATS-style score
- **Course Broker** — Coursera/free resource recommendations
- **TargetPath** — company-specific roadmap
- **ResumeQore** — job-specific resume strategy
- **ApplyTrack** — application tracker
- **ProfileBoost** — LinkedIn/referral optimization

---

## Design Goal

Build a homepage that feels:

- Premium
- Technical
- Dark
- Kinetic
- Editorial
- Sharp
- Smooth
- AI-native
- Developer-tool inspired
- Motion-rich, but not chaotic

The visual direction should combine:

- **Lenis.dev** style smooth scroll and refined interaction
- **GSAP.com** style kinetic animation and bold motion sections
- Dark premium SaaS aesthetics
- Technical print-media composition
- Asymmetric editorial layouts
- Interactive dashboard-style previews

The homepage should immediately look better than a normal student project.

---

## Strict Visual Language

Follow these design rules carefully.

### Background

Use a deep off-black background:

```css
--bg: #050608;
--bg-warm: #090909;
--surface: #0D1017;
--surface-2: #121622;
--surface-warm: #141413;
```

### Text

```css
--text: #F5F7FA;
--muted: #9CA3AF;
--soft: rgba(245, 247, 250, 0.68);
```

### Accents

Use restrained electric accents:

```css
--green: #C6FF3D;
--green-2: #3BE87E;
--cyan: #45E5FF;
--cyan-2: #1AD1D7;
--purple: #8B5CF6;
--border: rgba(255,255,255,0.10);
--border-soft: rgba(244,244,243,0.06);
```

### Typography

Use:

- **Geist Sans** for headings and UI
- **Geist Mono** for labels, code-like values, scores, and technical metadata
- Optional **Georgia italic** for short editorial quotes

### Composition Rules

- Avoid repetitive symmetrical card grids
- Use asymmetric layouts
- Use large empty space
- Use varied block density
- Use strong section contrast
- Use editorial-style section titles
- Use UI fragments, score cards, graph lines, node paths, and command-style labels

### Forbidden Patterns

Do not use:

- Generic startup blue/purple gradients everywhere
- Basic centered SaaS layout
- Overused glassmorphism
- Giant blurry blobs everywhere
- Cartoon illustrations
- Graduation caps
- Books
- Trophy icons
- Generic AI brain icons
- Career ladder clichés
- Cheap neon border effects
- Excessive 3D

---

## Required Tech Stack

Use:

```bash
npm install gsap lenis @gsap/react lucide-react
```

Use:

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Lenis** for smooth scrolling
- **GSAP** for timeline animations
- **ScrollTrigger** for scroll-linked sections
- **@gsap/react** for safe animation lifecycle
- **Lucide React** for icons

Optional:

```bash
npm install framer-motion
```

Use Framer Motion only for minor hover interactions if absolutely needed. Main animation must be GSAP-based.

---

## Homepage Route

Build the homepage at:

```txt
src/app/page.tsx
```

Recommended component structure:

```txt
src/components/landing/
  SmoothScroll.tsx
  HeroSection.tsx
  ProblemSection.tsx
  FlowSection.tsx
  SkillScanSection.tsx
  CourseBrokerSection.tsx
  ResumeQoreSection.tsx
  ApplyTrackSection.tsx
  FinalCTASection.tsx
  FloatingCard.tsx
  AnimatedText.tsx
  SectionLabel.tsx
```

Optional utilities:

```txt
src/lib/
  animations.ts
  constants.ts
```

---

# Page Structure and Animation Requirements

## 1. Navigation

Create a minimal fixed/sticky top navigation.

### Content

Left:

```txt
Skillqore
```

Right links:

```txt
SkillScan
Roadmap
Resume
Tracker
Start
```

### Visual Style

- Dark translucent background
- Thin bottom border
- Subtle blur only if it looks premium
- Small mono labels
- Accent hover underline
- CTA button with green/cyan accent

### Animation

- Navbar slides down on initial load
- Links stagger in
- CTA button has magnetic/tilt hover
- On scroll, navbar background becomes slightly more solid

---

## 2. Hero Section

This is the most important section. Make it exceptional.

### Badge

```txt
AI Career Broker for Students
```

### Main Headline

```txt
Know your level.
Build your path.
Reach your target role.
```

### Subheadline

```txt
Skillqore diagnoses your current skills, recommends Coursera and free resources, generates company-specific roadmaps, improves resumes, and tracks applications.
```

### CTA Buttons

```txt
Start SkillScan
See How It Works
```

### Hero Visual

Create a floating “career intelligence cockpit” around the hero.

Cards to include:

```txt
SkillScan Score: 42/100
Missing Skills: React, SQL, DSA
Target: Deloitte Data Analyst
Roadmap: 60 days
ATS Match: 71%
Next Action: Build one dashboard project
```

Also include a central animated visual:

- Abstract career graph
- Nodes connected by glowing lines
- One highlighted target node
- Progress line moving from “Current” to “Target”
- Subtle grid/crosshair background

### Hero Animations

Use GSAP timeline:

1. Navbar enters
2. Badge fades/slides up
3. Headline words reveal line-by-line
4. Subheadline fades in
5. CTA buttons slide up
6. Floating cards stagger in
7. Graph nodes draw in
8. Cards start slow continuous floating

### Animation Details

- Use `clip-path`, `y`, and `opacity` for text reveal
- Use `stagger: 0.08` for headline words
- Use `ease: "power3.out"`
- Cards should float with subtle `y` movement
- Do not make animations too fast
- Maintain premium pacing

---

## 3. Problem Section

### Title

```txt
Students don’t need another course platform.
They need direction.
```

### Body

Explain that students often have skills, projects, courses, resumes, and applications scattered everywhere, but no clear system that tells them what matters for their target role.

### Cards

Create 4 asymmetric problem cards:

1. Generic resumes get ignored
2. Students don’t know their real level
3. Courses are everywhere, but paths are unclear
4. Applications are hard to track

### Visual Style

- Editorial layout
- Uneven card sizes
- Thin technical dividers
- Mono labels like `PROBLEM_01`
- No repetitive grid

### Animation

Use ScrollTrigger:

- Section title reveals with text mask
- Cards slide up with stagger
- Cards slightly rotate/tilt into place
- On hover, add subtle border accent and translate movement

---

## 4. Product Flow Section

### Title

```txt
From scattered skills to company-ready execution.
```

### Flow

Create a process line:

```txt
Set Goal → SkillScan → QoreScore → Course Broker → TargetPath → ResumeQore → ApplyTrack
```

### Visual

- Horizontal flow on desktop
- Vertical flow on mobile
- Glowing nodes
- Connecting line
- Active step preview panel

Each step should show a small explanation:

```txt
Set Goal: Pick your target role and company
SkillScan: Diagnose your current level
QoreScore: Get your readiness score
Course Broker: Get external resource recommendations
TargetPath: Follow a personalized roadmap
ResumeQore: Create role-specific resume strategy
ApplyTrack: Track your applications
```

### Animation

Use ScrollTrigger:

- Pin the section on desktop if stable
- Progress line fills as user scrolls
- Nodes activate one by one
- Preview panel content changes/highlights
- Active node glows green/cyan
- On mobile, disable pinning and use simple reveal

Important:

- Keep pinned animation stable
- Avoid layout jumps
- Avoid horizontal overflow

---

## 5. SkillScan Section

### Title

```txt
Start with a diagnosis, not a guess.
```

### Description

```txt
SkillScan tests your current level using role-based questions, practical readiness checks, and AI analysis before suggesting any course or roadmap.
```

### Visual

Create a mock diagnostic test interface:

- Question card
- Multiple choice options
- Practical readiness checks
- Current level badge
- Score meter

Example UI content:

```txt
Target Role: Frontend Developer Intern
Question: What problem does React state solve?
Current Level: Beginner+
SkillScan Score: 42/100
```

### Score Breakdown

Show mini bars:

```txt
Technical Basics: 48%
Projects: 35%
Resume Strength: 52%
Application Readiness: 28%
```

### Animation

- Score counts from 0 to 42
- Progress bars fill on scroll
- Question card changes once or twice
- Readiness labels appear with stagger
- Use `scrub: true` only if it feels smooth

---

## 6. Course Broker Section

### Title

```txt
We don’t create courses.
We route you to the right ones.
```

### Description

```txt
Skillqore recommends Coursera, freeCodeCamp, Google Skillshop, Microsoft Learn, Kaggle Learn, official docs, and YouTube resources based on your actual skill gaps.
```

### Cards

Create resource cards:

```txt
Coursera — SQL for Data Science
freeCodeCamp — JavaScript Algorithms
Google Skillshop — Analytics Fundamentals
Microsoft Learn — Azure Basics
Kaggle Learn — Python
Docs — React Official Docs
YouTube — API Project Tutorial
```

Each card should include:

- Platform
- Skill covered
- Level
- Why recommended
- External link icon

### Example Why Recommended

```txt
Recommended because your target role requires SQL and your SkillScan shows weak database fundamentals.
```

### Animation

- Cards enter as stacked cards
- On scroll, cards fan out / unstack
- Hover causes slight lift and border highlight
- Use alternating vertical offsets for editorial feel

---

## 7. TargetPath Roadmap Section

### Title

```txt
A roadmap built around your target company, not a random syllabus.
```

### Visual

Create a roadmap timeline:

```txt
Week 1: JavaScript Fundamentals
Week 2: React Basics
Week 3: API Project
Week 4: Deploy + GitHub Cleanup
Week 5: Resume Optimization
Week 6: Mock Interview + Applications
```

Each week should have:

- Task title
- Skill tag
- Estimated hours
- Resource badge
- Completion checkbox style

### Animation

- Timeline line draws vertically
- Week cards reveal one by one
- Completed checkboxes animate
- Current week pulses lightly
- Use ScrollTrigger start `"top 75%"`

---

## 8. ResumeQore Section

### Title

```txt
One master profile.
Many job-specific resumes.
```

### Description

```txt
Skillqore turns your master career profile into role and company-specific resume strategies with ATS scoring, keyword gaps, and stronger project bullets.
```

### Visual

Create a before/after resume improvement panel.

Before:

```txt
Made a website for college event.
```

After:

```txt
Developed and deployed a responsive event platform to centralize registrations, improve accessibility, and showcase event details for students.
```

### Add Cards

```txt
ATS Match: 71%
Missing Keywords: REST API, performance, accessibility
Skills to Highlight: React, GitHub, Deployment
```

### Animation

- Before bullet fades out / after bullet reveals
- ATS number counts from 0 to 71
- Keyword pills appear one by one
- Use subtle mono labels like `RESUME_DELTA`

---

## 9. LinkedIn / Referral Section

### Title

```txt
Turn preparation into outreach.
```

### Description

```txt
Generate LinkedIn headlines, referral messages, and recruiter-ready summaries based on your target role and current profile.
```

### Visual

Show 3 small generated content cards:

1. LinkedIn headline
2. Referral request
3. Follow-up message

Example:

```txt
CSE Student | Frontend Developer | Building AI-powered student tools | React, Next.js, Supabase
```

### Animation

- Typewriter effect for one short line
- Cards reveal with stagger
- Copy buttons glow on hover

---

## 10. ApplyTrack Section

### Title

```txt
Preparation is useless if you don’t apply.
```

### Description

```txt
Track every opportunity from saved to offer, with AI next-action suggestions for each application.
```

### Kanban Columns

```txt
Saved
Preparing
Applied
Interview
Offer
```

### Cards

Example cards:

```txt
Deloitte — Data Analyst Intern
Razorpay — Frontend Intern
Zoho — Software Developer
```

### AI Next Action Bubble

```txt
Finish your SQL dashboard project before applying. Then update your Deloitte-specific resume.
```

### Animation

- Kanban columns reveal with stagger
- Cards slide into columns
- One card moves subtly from Preparing to Applied
- AI bubble appears after a delay

---

## 11. Final CTA Section

### Title

```txt
Your target role needs a path.
Skillqore builds it.
```

### Subtitle

```txt
Diagnose your level, sort your gaps, follow the roadmap, and apply with confidence.
```

### CTA Buttons

```txt
Start SkillScan
Build My Career Path
```

### Animation

- Large text reveal
- Background grid brightens slightly
- CTA buttons glow on hover
- Final floating nodes converge into the Skillqore logo or wordmark

---

# Animation Implementation Requirements

## Lenis Setup

Create a smooth scroll wrapper.

Requirements:

- Initialize Lenis client-side only
- Sync Lenis with GSAP ScrollTrigger
- Destroy Lenis on unmount
- Respect reduced motion
- Avoid hydration errors

Pseudo implementation requirements:

```txt
Lenis raf loop → gsap.ticker integration OR requestAnimationFrame loop
ScrollTrigger.update() on Lenis scroll
```

## GSAP Setup

Requirements:

- Register ScrollTrigger client-side
- Use `useGSAP` or GSAP context cleanup
- Scope animations to component refs
- Avoid duplicate ScrollTriggers
- Kill ScrollTriggers on cleanup where needed
- Use transform and opacity instead of expensive layout properties

Recommended animation types:

- Text reveal using clip-path
- Card stagger reveal
- Count-up score
- Scroll-linked progress line
- Floating cards
- Path/node drawing
- Timeline draw
- Keyword pill reveals
- Kanban card movement

## Reduced Motion

If user prefers reduced motion:

- Disable Lenis smooth scroll
- Disable infinite floating
- Disable pinned sections
- Replace animation with simple fade-in or static layout

Use:

```js
window.matchMedia("(prefers-reduced-motion: reduce)")
```

---

# Responsive Requirements

## Desktop

- Full animation experience
- Large typography
- Asymmetric layouts
- Flow section can be pinned
- Floating hero cards visible

## Tablet

- Reduce floating card count
- Keep sections readable
- Avoid too much overlap

## Mobile

- Stack all sections vertically
- Disable pinned flow
- Reduce motion
- Hide or simplify some floating cards
- Avoid horizontal scrolling
- CTA buttons must remain easy to tap

---

# Performance Requirements

The homepage must feel smooth.

Avoid:

- Too many blur layers
- Too many infinite animations
- Heavy filters
- Large images
- Layout-triggering animation
- Scroll jank
- Horizontal overflow
- Multiple nested smooth scroll containers

Use:

- `transform`
- `opacity`
- `will-change` only for animated elements
- Lightweight CSS gradients
- SVG lines for node paths
- CSS variables
- Lazy motion where possible

---

# Accessibility Requirements

Add:

- Semantic HTML
- Proper heading hierarchy
- Visible focus states
- Accessible buttons
- `aria-label` for icon-only buttons
- Sufficient contrast
- Reduced-motion fallback
- Keyboard-friendly navigation

---

# Copywriting Tone

Use confident product language.

Avoid:

- “Unlock your potential”
- “Empower your future”
- “Revolutionize your career”
- “One-stop solution”
- “AI-powered platform for everything”

Prefer:

- “Know your current level”
- “Find what you’re missing”
- “Follow a company-specific path”
- “Build resumes that match the role”
- “Track applications until you get there”

---

# Final Deliverable Checklist

The finished homepage must include:

- Premium animated hero
- Lenis smooth scrolling
- GSAP timeline intro
- ScrollTrigger section reveals
- Animated product flow
- SkillScan preview
- Course Broker preview
- TargetPath roadmap preview
- ResumeQore preview
- LinkedIn/referral preview
- ApplyTrack preview
- Final CTA
- Fully responsive layout
- Reduced-motion support
- No generic SaaS template look
- No hydration errors
- No broken routing
- Clean reusable components

---

# Master Implementation Prompt

Use the following prompt directly in Cursor, Antigravity, or any coding assistant:

```text
Act as an elite frontend engineer, motion designer, and UI/UX lead.

Build a premium, animation-heavy homepage for Skillqore, an AI career broker platform for students.

Skillqore diagnoses a student's current skill level, finds skill gaps, recommends Coursera/free resources, generates company-specific roadmaps, improves resumes, optimizes LinkedIn/referral outreach, and tracks applications.

The homepage must be visually inspired by Lenis.dev and GSAP.com: smooth scrolling, kinetic motion, bold typography, dark technical aesthetic, premium developer-tool feel, and scroll-based storytelling.

Use Next.js, TypeScript, Tailwind CSS, Lenis, GSAP, ScrollTrigger, @gsap/react, and lucide-react.

The page must include these sections:
1. Navigation
2. Hero
3. Problem section
4. Product flow
5. SkillScan diagnostic preview
6. Course Broker resource preview
7. TargetPath roadmap preview
8. ResumeQore resume strategy preview
9. LinkedIn/referral outreach preview
10. ApplyTrack application tracker preview
11. Final CTA

Design requirements:
- Dark near-black background
- Neon green/cyan restrained accents
- Thin technical borders
- Editorial asymmetric layout
- Geist Sans / Geist Mono typography
- No generic startup template
- No cartoon education visuals
- No graduation caps/books/trophies
- No cheap neon glow overload
- Avoid repetitive symmetrical card grids

Animation requirements:
- Lenis smooth scroll globally
- GSAP intro timeline
- ScrollTrigger reveals for each section
- Hero text stagger reveal
- Floating hero cards
- Animated career graph nodes
- Scroll-linked product flow line
- Count-up readiness/ATS scores
- Roadmap timeline draw
- Keyword pill reveal
- Kanban card movement
- Reduced-motion fallback
- Mobile-safe animation behavior

Implementation requirements:
- Create clean reusable landing components
- Use client-side animation safely
- Register ScrollTrigger only on client
- Clean up animations properly
- Avoid hydration errors
- Avoid layout shift
- Keep performance smooth
- Ensure full responsiveness

Make the homepage feel like a premium AI SaaS launch page that could impress hackathon judges immediately.
```

---

## Notes for Developers

This homepage should be given 2–3 focused hours maximum during the hackathon. Prioritize:

1. Hero animation
2. Product flow animation
3. SkillScan preview
4. ResumeQore preview
5. Final polish

Do not spend the entire hackathon on the homepage. The product MVP still needs:

- SkillScan test
- scoring engine
- course recommender
- roadmap generator
- resume strategy
- application tracker
