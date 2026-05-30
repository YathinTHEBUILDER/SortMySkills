Copy-paste this into Antigravity / Cursor / Claude Code:

````md id="x5cl91"
# MASTER PROMPT — Keep New Landing Page, Improve Scroll Animations + Add Themed Formspree Contact Form

You are working on:

`YathinTHEBUILDER/SortMySkills`

The new landing page is good. Do **not** rebuild it again.  
Do **not** change the whole structure.  
Do **not** rewrite all content.

Your task is only to:

1. Improve the landing page scroll animations so they feel smoother, more premium, and more GSAP/Lenis-inspired.
2. Add a polished Formspree contact form near the end of the landing page that perfectly matches the current theme.
3. Preserve everything that already works.

Make no mistakes. Do not break the app.

---

## CRITICAL RULES

Do not:
- rewrite the landing page from scratch
- change the entire visual direction
- remove existing sections
- break auth-aware CTAs
- break `MarketingHeader`
- break theme switching
- break dark/light mode
- break dashboard routes
- break Supabase logic
- add paid dependencies
- add a custom backend for contact form
- expose secrets
- add fake claims
- create layout shift or scroll jank
- create multiple Lenis instances
- create unclean GSAP memory leaks

Preserve:
- current landing page structure
- current landing page content
- current theme variables
- current responsive layout
- current route links
- `Logo`
- `ButtonLink`
- `MarketingHeader`
- `LandingAnimations`
- existing GSAP/Lenis setup
- accessibility
- reduced motion support

---

# FILES TO INSPECT FIRST

Inspect these before editing:

```txt
src/app/(marketing)/page.tsx
src/components/landing/LandingAnimations.tsx
src/components/landing/MarketingHeader.tsx
src/app/globals.css
src/components/LenisProvider.tsx
src/components/SmoothScroll.tsx
src/components/ui/Button.tsx
.env.example
package.json
````

Only edit what is necessary.

---

# PHASE 1 — IMPROVE SCROLL ANIMATIONS

File:

```txt
src/components/landing/LandingAnimations.tsx
```

The current animation system may be too basic. Improve it using GSAP properly.

Use:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
```

Register safely:

```ts
gsap.registerPlugin(ScrollTrigger);
```

Use `gsap.context()` so animations are scoped and cleaned up correctly.

Use cleanup:

```ts
return () => ctx.revert();
```

Also kill/refresh ScrollTriggers properly if needed.

---

## Animation requirements

Improve the page with premium, smooth scroll effects:

### 1. Page load sequence

Keep or improve:

* header fade/slide in
* hero eyebrow reveal
* hero headline reveal
* hero subtext reveal
* CTA reveal
* hero visual card reveal
* hero chips stagger reveal

Make it feel smoother:

* use `power4.out`, `expo.out`, or `power3.out`
* avoid cheap bounce
* avoid too many delays
* make hero feel intentional and fast

Suggested pattern:

```ts
const intro = gsap.timeline({
  defaults: { ease: "power4.out" },
});

intro
  .fromTo(".navbar-fade", { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
  .fromTo(".hero-reveal-eyebrow", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.35")
  .fromTo(".hero-reveal-title", { y: 34, opacity: 0, filter: "blur(8px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 }, "-=0.35")
  .fromTo(".hero-reveal-sub", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.35")
  .fromTo(".hero-reveal-ctas", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, "-=0.3")
  .fromTo(".visual-card-reveal", { y: 28, scale: 0.96, opacity: 0, filter: "blur(10px)" }, { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.9 }, "-=0.5");
```

Keep class names compatible with the current JSX.

---

### 2. Section scroll reveals

Replace basic IntersectionObserver-only reveals with GSAP ScrollTrigger reveals.

For each `.reveal-section`:

* reveal section heading/eyebrow first
* reveal `.reveal-item` children with stagger
* use subtle y movement
* use opacity
* do not animate layout-heavy properties aggressively

Suggested:

```ts
gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
  const items = section.querySelectorAll(".reveal-item");

  gsap.fromTo(
    items,
    { y: 36, opacity: 0, filter: "blur(8px)" },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.85,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    }
  );
});
```

Make sure elements that already have `opacity-0` become visible.

---

### 3. Scroll parallax for visual cards

Add tasteful parallax to major landing visual elements:

* hero visual card
* floating cards
* roadmap/timeline cards
* trust/contact card

Use small movement only:

```ts
gsap.to(".visual-card-reveal", {
  yPercent: -6,
  ease: "none",
  scrollTrigger: {
    trigger: ".visual-card-reveal",
    start: "top bottom",
    end: "bottom top",
    scrub: 0.8,
  },
});
```

Do not cause mobile jank.

Use `gsap.matchMedia()`:

* desktop: allow parallax/scrub
* mobile: simpler reveal only

---

### 4. Progress line / timeline animations

If the landing page has workflow lines, roadmap lines, divider lines, timeline strokes, or progress bars, animate them on scroll.

Use classes if already present:

* `.workflow-line`
* `.roadmap-line`
* `.progress-line`
* `.timeline-line`
* `.connection-line`

If not present, add safe classes to the relevant JSX and CSS.

Animation:

* scaleX or scaleY from 0 to 1
* transform origin top/left
* scrub gently with ScrollTrigger
* no layout shifting

Example:

```ts
gsap.fromTo(
  ".workflow-line",
  { scaleX: 0, transformOrigin: "left center" },
  {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "#workflow",
      start: "top 70%",
      end: "bottom 45%",
      scrub: 0.6,
    },
  }
);
```

---

### 5. Card microinteractions

Add better hover interactions without making things childish.

Use CSS or GSAP-safe hover classes.

For cards:

* slight translateY
* border accent change
* soft glow
* no aggressive rotation
* no 3D chaos

Suggested CSS:

```css
.landing-card-hover {
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease,
    background-color 220ms ease;
}

.landing-card-hover:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--accent-primary) 38%, transparent);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.12);
}
```

Use theme-safe variables.

---

### 6. Reduced motion support

Respect:

```ts
window.matchMedia("(prefers-reduced-motion: reduce)").matches
```

If reduced motion is enabled:

* set all animated elements visible
* do not run ScrollTrigger animations
* do not run infinite floating chip loops
* keep page usable

Example:

```ts
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  gsap.set(
    ".navbar-fade, .hero-reveal-eyebrow, .hero-reveal-title, .hero-reveal-sub, .hero-reveal-ctas, .hero-reveal-pills, .visual-card-reveal, .visual-tag-stagger, .reveal-item",
    { opacity: 1, y: 0, clearProps: "filter,transform" }
  );
  return;
}
```

---

# PHASE 2 — LENIS + SCROLLTRIGGER INTEGRATION

Inspect:

```txt
src/components/LenisProvider.tsx
src/components/SmoothScroll.tsx
```

If Lenis is already active globally:

* do not create another Lenis instance
* do not duplicate smooth scroll setup
* only ensure GSAP ScrollTrigger refresh/update works correctly

If there is an existing Lenis instance with scroll callback, connect it to ScrollTrigger:

```ts
lenis.on("scroll", ScrollTrigger.update);
```

If the app does not expose Lenis instance, do not over-engineer. It is acceptable to use ScrollTrigger normally as long as there is no scroll desync.

After page animation setup:

```ts
ScrollTrigger.refresh();
```

Do not create memory leaks.

---

# PHASE 3 — ADD THEMED FORMSPREE CONTACT FORM

Add a contact section near the end of the landing page, ideally before the final CTA or just before the footer.

Preferred position:

```txt
Privacy/Trust section
Contact section
Final CTA
Footer
```

If the current landing page already has a final CTA, put the contact form immediately before the footer or before the final CTA — whichever looks more natural.

---

## Contact section requirements

Anchor:

```tsx
id="contact"
```

Eyebrow:

```txt
Contact
```

Heading:

```txt
Have feedback or want to collaborate?
```

Subheading:

```txt
Send a quick message. Whether it is a bug, idea, campus use case, or collaboration, I will read it.
```

Fields:

* Name
* Email
* Message

Optional hidden fields:

* `_subject`
* `_gotcha` honeypot

Button:

```txt
Send Message
```

Success message:

```txt
Message sent. I’ll get back to you soon.
```

Error message:

```txt
Couldn’t send the message. Please try again.
```

If Formspree endpoint is missing:

```txt
Contact form is not configured yet.
```

---

## Formspree endpoint handling

Do not hardcode a real endpoint unless already provided.

Add this to `.env.example`:

```env
NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT=https://formspree.io/f/your-form-id
```

In code, read:

```ts
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT;
```

Because the Formspree endpoint is public by nature, using a `NEXT_PUBLIC_` variable is acceptable.

If the env var is missing or still contains `your-form-id`, disable the submit button and show a small muted setup message.

---

## Implementation approach

Create a new client component:

```txt
src/components/landing/ContactForm.tsx
```

Use `"use client"`.

Use React state:

* `name`
* `email`
* `message`
* `status`
* `isSubmitting`

Use `fetch()`:

```ts
await fetch(FORMSPREE_ENDPOINT, {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name,
    email,
    message,
    _subject: "New SortMySkills landing page message",
  }),
});
```

Handle:

* loading
* success
* error
* basic validation
* disabled state if endpoint missing

Use no new dependencies.

Optional: use `sonner` if already installed and used elsewhere, but inline status text is enough.

---

## Contact form design

It must match the landing page theme.

Use:

* `premium-card`
* `soft-card`
* `animated-border`
* `bg-surface-card`
* `border-[var(--border-muted)]`
* `text-text-primary`
* `text-text-secondary`
* `accent-primary`

Design:

Left side:

* heading
* short text
* small trust bullets

Right side:

* form card

Suggested layout:

```tsx
<section id="contact" className="section-shell reveal-section">
  <div className="container-shell grid lg:grid-cols-2 gap-8 items-start">
    <div className="reveal-item opacity-0">
      ...
    </div>
    <ContactForm />
  </div>
</section>
```

The form card should have:

```txt
rounded-3xl
border
soft background
subtle grid/noise overlay
large message textarea
clear focus rings
theme-aware colors
```

Field styles:

```tsx
className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 transition-all"
```

Message textarea:

```tsx
min-h-[140px]
resize-y
```

Submit button should match current primary CTA style.

---

## Contact form accessibility

Must include:

* real `<label>` for every input
* `type="email"`
* `required`
* `aria-live="polite"` for status messages
* disabled button during submit
* clear error/success text
* honeypot input hidden accessibly

Example honeypot:

```tsx
<input
  type="text"
  name="_gotcha"
  tabIndex={-1}
  autoComplete="off"
  className="hidden"
  aria-hidden="true"
/>
```

---

# PHASE 4 — UPDATE HEADER/FOOTER LINKS

If the header has room, add:

```txt
Contact
```

href:

```txt
#contact
```

Do not crowd mobile nav. If adding Contact makes the header too packed, only add it to footer.

Footer should include:

```txt
Contact → #contact
```

Keep existing route links working.

Do not add broken anchors.

---

# PHASE 5 — CSS SUPPORT

File:

```txt
src/app/globals.css
```

Add only necessary helper classes.

Suggested additions:

```css
.contact-grid-glow {
  position: relative;
}

.contact-grid-glow::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--accent-primary) 20%, transparent), transparent 38%),
    radial-gradient(circle at bottom right, color-mix(in srgb, var(--accent-secondary) 16%, transparent), transparent 42%);
  pointer-events: none;
  opacity: 0.8;
  z-index: 0;
}

.contact-grid-glow > * {
  position: relative;
  z-index: 1;
}
```

Only add this if it looks good and does not break theme.

Do not overdo glow.

---

# PHASE 6 — VALIDATION

Run:

```bash
npm run lint
npm run build
```

If `npm run lint` fails because `next lint` is unsupported, update `package.json` safely:

```json
"lint": "eslint ."
```

Then rerun:

```bash
npm run lint
npm run build
```

Fix all errors.

---

# PHASE 7 — MANUAL CHECKS

Verify:

1. Landing page still loads.
2. Header still works.
3. Mobile menu still works.
4. Dark/light mode still works.
5. Smooth scroll still works.
6. Scroll animations do not flicker.
7. No elements stay invisible after scrolling.
8. Reduced motion users still see all content.
9. Contact form shows disabled/config message if endpoint is missing.
10. Contact form submits successfully when `NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT` is configured.
11. No `/tools/parser` link is introduced.
12. No broken anchors.
13. No console errors from GSAP/ScrollTrigger.
14. No duplicate Lenis instances.
15. Build passes.

---

# FINAL RESPONSE FORMAT

When done, report:

```txt
Changed files:
- ...

Scroll animation improvements:
- ...

Contact form:
- Formspree env variable added: yes/no
- ContactForm component added: yes/no
- Endpoint fallback handled: yes/no

Validation:
- npm run lint: passed / failed
- npm run build: passed / failed

Remaining setup:
- Add real Formspree endpoint to NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT
```

Be honest. Do not say lint/build passed unless actually run.

```
```
