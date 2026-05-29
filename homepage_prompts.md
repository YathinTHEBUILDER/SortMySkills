# SortMySkills — Homepage Prompts & Iteration Guide

Use the prompts in this file to guide AI assistants, design generators, or developers when editing, expanding, or completely rebuilding parts of the **SortMySkills** homepage.

---

## 1. Master Style & Layout Prompt (System/Visual Architecture)
*Use this prompt when bootstrapping adjacent pages, creating new components, or explaining the visual language of the platform to a new layout engine.*

```text
Act as an elite frontend engineer and lead UI/UX designer. We are developing "SortMySkills" — a structured, career intelligence platform that replaces standard SaaS startup clichés with a premium, technical print-media aesthetic. 

Follow these strict design guidelines for all components:
- Background Palette: Deep, warm off-blacks (#090909 to #0f0f0e). Surfaces use a slightly lighter, solid charcoal (#141413).
- Accent Palette: Do not use generic startups blues or purples. Use a restrained, sharp gradient consisting of Neon Green (#3be87e) and Cyan (#1ad1d7) to highlight active states and verified nodes. 
- Lines & Dividers: Set all borders and lines to 0.5px opacity-restrained ivory white (rgba(244, 244, 243, 0.06)).
- Typography: Use Geist Sans for strict interface elements and Geist Mono for code nodes, logs, and data parameters. Pair them occasionally with a classic, book-like Georgia Serif for italicized editorial quotes.
- Grids & Composition: Never use repetitive symmetrical card grids. Use highly asymmetric layouts (e.g., a 5-column / 7-column split), varied block density, and drop-cap elements to make the design feel crafted by hand.
- Forbidden Patterns: No glassmorphism, no neon glowing border blur, no giant decorative floating blobs, no mathematically perfect centered layouts.
```

---

## 2. Actionable Prompts for Editing the Homepage

### A. Swapping the Accent Color Palette
*Use this prompt to change the platform's brand colors (e.g., transitioning from green/cyan to a warm rust/terracotta or high-end amber).*

```text
Open the files `src/app/globals.css` and `src/components/Logo.tsx`. We want to shift our restrained accent color palette from the current Neon Green/Cyan gradient to a premium, warm terracotta and sand palette. 

In `globals.css`, update the `@theme` block:
- Replace `--color-accent-green` with a deep terracotta rust `#c45b37`.
- Replace `--color-accent-cyan` with a warm sand-gold `#d9b48f`.

In `Logo.tsx`, update the `<linearGradient>` stops:
- Stop 1: `#c45b37`
- Stop 2: `#d9b48f`

Ensure that hover states, tags, and Recharts graph bars update to reflect this new premium colorway without breaking the layout dividers.
```

### B. Expanding the Local NLP Tag Extractor
*Use this prompt to add new programming languages, frameworks, or cloud databases to the homepage normalizer engine.*

```text
Open `src/app/page.tsx` and find the `SKILL_MAP` registry dictionary. We need to expand our normalized skills registry to support Cloud and Backend infrastructure. 

Add the following key-value mappings to the dictionary:
- "aws", "amazon web services", "s3", "ec2" -> "AWS"
- "gcp", "google cloud", "firebase" -> "Google Cloud"
- "docker", "kubernetes", "k8s" -> "DevOps"
- "graphql", "apollo", "gql" -> "GraphQL"
- "mongodb", "mongo", "nosql" -> "MongoDB"

Verify that when a user pastes a text containing "I deployed a docker container on GCP and query with graphql", the parser instantly outputs "DevOps", "Google Cloud", and "GraphQL" as normalized tags.
```

### C. Integrating GSAP ScrollTrigger for Scroll Animations
*Use this prompt to connect GSAP animations to the user's scroll position, making elements reveal beautifully as they scroll.*

```text
Open `src/app/page.tsx`. We want to introduce GSAP ScrollTrigger to make the section headings and panels slide up dynamically as the user scrolls down the page. 

1. Install GSAP ScrollTrigger if needed.
2. In `page.tsx`, import `ScrollTrigger` from `gsap/ScrollTrigger`.
3. Register the plugin: `gsap.registerPlugin(ScrollTrigger);`.
4. Add a `useEffect` hook targeting the pathways portals, parser playground, and philosophy essays. Set up a timeline for each section:
   - trigger: the section element
   - start: "top 85%"
   - toggleActions: "play none none reverse"
   - animation: gsap.from(elements, { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" })

Ensure this integrates smoothly with our Lenis smooth scroll provider.
```

### D. Adding a Dynamic Dark/Light Mode Toggle (Editorial theme)
*Use this prompt to implement a light mode that mimics a crisp, paper-like book layout (dark grey text on warm ivory background).*

```text
We want to implement a highly refined, paper-like light mode for SortMySkills that resembles a classical scientific journal.

1. In `src/app/globals.css`, configure light variables inside `:root`:
   - --background: #fdfdfb (warm ivory paper)
   - --foreground: #1c1c1b (charcoal print text)
   - --color-surface-card: #f5f5f2 (slightly darker paper layer)
   - --color-border-muted: rgba(28, 28, 27, 0.08)

2. Create a toggler component in `src/components/Navbar.tsx` that adds/removes the `dark` class from the `<html>` tag.
3. Ensure that when light mode is active, the entire site renders like an elegant printed book, with high text legibility, fine charcoal lines, and beautiful gray serif typography.
```

---

## 3. Brand Asset Generation Prompts (Midjourney/DALL-E)
*Use these prompts in image generators to create supplementary design mockups, icons, or landing page graphics that match the site.*

### Option A: App Icon Mockup (Matches the Uploaded Identity)
```text
A premium app icon design for "SortMySkills", featuring a stylized geometric interlocking ribbon forming the letter 'S' with an upward-pointing arrow at the top right, vibrant neon green to cyan linear gradient, glossy metal finish, set on a dark carbon fiber texture background, extreme details, realistic mockup, high-end editorial UI asset, 8k, --v 6.0
```

### Option B: High-End Technical Print Background Graphic
```text
A minimal high-end technical print graphic, architectural blueprint grid overlay, fine line diagrams of skill nodes connecting like circuit traces, dark charcoal background, subtle green and cyan accents, extreme precision, editorial poster layout, vector style, flat design, --ar 16:9
```
