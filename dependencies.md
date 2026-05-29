# Skillqore Project Dependencies

This document lists all the core and optional dependencies required to build the Skillqore premium animated homepage, as specified in the homepage instructions.

## Core Dependencies

These are required for the layout, animations, smooth scrolling, and core functionality.

| Dependency | Purpose | Installation Command |
| :--- | :--- | :--- |
| **Next.js** | Core React Framework for building the web application | Installed during project creation |
| **TypeScript** | Static typing for JavaScript | Installed during project creation |
| **Tailwind CSS** | Utility-first CSS framework for layout and styling | Installed during project creation |
| **GSAP (GreenSock Animation Platform)** | Main animation engine for timelines, kinetic motion, and scroll triggers | `npm install gsap` |
| **Lenis** | Smooth scrolling engine for consistent, premium feel across browsers | `npm install lenis` |
| **@gsap/react** | Official React wrappers and hooks for safe animation lifecycle management | `npm install @gsap/react` |
| **Lucide React** | Premium UI/UX icon set for navigation, cards, and buttons | `npm install lucide-react` |

### Core Installation Command
To install all core third-party dependencies at once, run:
```bash
npm install gsap lenis @gsap/react lucide-react
```

---

## Optional Dependencies

These dependencies can be used for secondary or enhanced interactions.

| Dependency | Purpose | Installation Command |
| :--- | :--- | :--- |
| **Framer Motion** | Used only for minor hover and simple component-level micro-interactions | `npm install framer-motion` |

---

## Technical Features & Sub-modules (GSAP)
- **ScrollTrigger**: Included in the `gsap` package, registered on the client side to enable scroll-linked elements, parallax, and section pins.
- **useGSAP hook**: Included in `@gsap/react` to automatically clean up timelines on component unmount and handle SSR safety.
