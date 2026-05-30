"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LandingAnimations() {
  useEffect(() => {
    // Register GSAP ScrollTrigger plugin safely
    gsap.registerPlugin(ScrollTrigger);

    // 1. Reduced Motion Accessibility Check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Instantly make all scroll-revealed and timeline elements fully visible
      gsap.set(
        ".navbar-fade, .hero-reveal-eyebrow, .hero-headline-word, .hero-reveal-sub, .hero-reveal-ctas, .hero-reveal-pills, .visual-card-reveal, .visual-tag-stagger, .transform-step-standardize, .transform-step-gaps, .workflow-step-card, .workflow-cta, .compare-card-left, .compare-card-middle, .compare-card-right, .compare-cta, .roadmap-phase-card, .roadmap-cta, .interview-role-card, .interview-cta, .trust-step-card, .cta-main-card, .reveal-item",
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
        }
      );
      return;
    }

    // 2. Scoped GSAP animations using gsap.context() to prevent memory leaks and ease cleanups
    const ctx = gsap.context(() => {
      // A. Initial Page Entrance Timeline (Hero Area) with cinematic eases
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro
        .fromTo(
          ".navbar-fade",
          { y: -18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: 0.1 }
        )
        .fromTo(
          ".hero-reveal-eyebrow",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          "-=0.45"
        )
        .fromTo(
          ".hero-headline-word",
          { y: 34, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.05 },
          "-=0.4"
        )
        .fromTo(
          ".hero-reveal-sub",
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.35"
        )
        .fromTo(
          ".hero-reveal-ctas",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          "-=0.3"
        )
        .fromTo(
          ".hero-reveal-pills",
          { scale: 0.96, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5 },
          "-=0.25"
        )
        .fromTo(
          ".visual-card-reveal",
          { y: 28, scale: 0.96, opacity: 0, filter: "blur(10px)" },
          { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.9 },
          "-=0.55"
        )
        .fromTo(
          ".visual-tag-stagger",
          { scale: 0.85, opacity: 0, y: 8 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
          "-=0.45"
        );

      // B. Dynamic bobbing loops for parser visual chips
      gsap.to(".floating-chip-1", {
        y: -6,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".floating-chip-2", {
        y: 6,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.3,
      });

      gsap.to(".floating-chip-3", {
        y: -4,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // C. Generic ScrollTrigger reveals with staggers for any .reveal-section
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

      // D. Media Match for Desktop-only Parallax / Scroll Scrubs (Prevent mobile layout shift & jank)
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 1024px)", () => {
        // Hero mockup card parallax
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

        // Resume transformation panels subtle offset parallax
        gsap.to(".transform-raw-panel", {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: ".transform-trigger-container",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        gsap.to(".transform-result-panel", {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: ".transform-trigger-container",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });

        // Contact Left Text Column Parallax
        gsap.to(".contact-reveal-container .reveal-item:first-child", {
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: ".contact-reveal-container",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      // E. Section 3: Interactive Scroll-Driven Resume Transformation Scrub
      const transformTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".transform-trigger-container",
          start: "top 75%",
          end: "bottom 25%",
          scrub: 0.5,
        },
      });

      transformTl.to([
        ".transform-hl-1",
        ".transform-hl-2",
        ".transform-hl-3",
        ".transform-hl-4",
        ".transform-hl-5",
        ".transform-hl-6",
      ], {
        backgroundColor: "rgba(231, 113, 125, 0.15)",
        color: "var(--accent-primary)",
        fontWeight: "bold",
        stagger: 0.08,
        duration: 0.4,
      });

      transformTl.fromTo(
        ".transform-step-standardize",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.1"
      );

      transformTl.fromTo(
        ".transform-step-gaps",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 },
        "+=0.05"
      );

      // F. Guided Workflow Progress Line and Card Reveals
      gsap.to(".workflow-scrub-line", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: ".workflow-reveal-container",
          start: "top 35%",
          end: "bottom 65%",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".workflow-step-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".workflow-reveal-container",
            start: "top 65%",
          },
        }
      );

      gsap.fromTo(
        ".workflow-cta",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".workflow-reveal-container",
            start: "bottom 95%",
          },
        }
      );

      // G. Profile Comparison Cards
      gsap.fromTo(
        [".compare-card-left", ".compare-card-middle", ".compare-card-right"],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".skill-gap-section",
            start: "top 65%",
          },
        }
      );

      gsap.fromTo(
        ".compare-cta",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".skill-gap-section",
            start: "bottom 95%",
          },
        }
      );

      // H. Roadmap Timeline Drawing and Steps
      gsap.to(".roadmap-scrub-line", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: ".roadmap-reveal-container",
          start: "top 35%",
          end: "bottom 65%",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".roadmap-phase-card",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.25,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".roadmap-reveal-container",
            start: "top 60%",
          },
        }
      );

      // I. Interview Prep Role Cards & CTA
      gsap.fromTo(
        ".interview-role-card",
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".interview-reveal-container",
            start: "top 65%",
          },
        }
      );

      gsap.fromTo(
        ".interview-cta",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".interview-reveal-container",
            start: "bottom 95%",
          },
        }
      );

      // J. Privacy Cards & Final CTA
      gsap.fromTo(
        ".trust-step-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".trust-reveal-container",
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        ".cta-main-card",
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-reveal-container",
            start: "top 75%",
          },
        }
      );

      // Recalculate ScrollTrigger positions dynamically for accuracy with Lenis
      ScrollTrigger.refresh();
    });

    // 3. Complete Component Cleanup on Unmount (Memory Leak Prevention)
    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
