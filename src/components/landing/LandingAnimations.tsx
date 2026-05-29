"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export default function LandingAnimations() {
  useEffect(() => {
    // 1. Navbar and Hero Text Entrance
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      ".navbar-fade",
      { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.1 }
    );

    tl.fromTo(
      ".hero-reveal-eyebrow",
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.4"
    );

    tl.fromTo(
      ".hero-reveal-title",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      "-=0.35"
    );

    tl.fromTo(
      ".hero-reveal-sub",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.4"
    );

    tl.fromTo(
      ".hero-reveal-ctas",
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.35"
    );

    tl.fromTo(
      ".hero-reveal-pills",
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08 },
      "-=0.3"
    );

    // 2. Hero Visual Engine Staggered Reveals
    tl.fromTo(
      ".visual-card-reveal",
      { scale: 0.97, opacity: 0, y: 12 },
      { scale: 1, opacity: 1, y: 0, duration: 0.8 },
      "-=0.5"
    );

    tl.fromTo(
      ".visual-tag-stagger",
      { scale: 0.85, opacity: 0, y: 8 },
      { scale: 1, opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
      "-=0.4"
    );

    // 3. Subtle floating/bobbing animations for interactive chips
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

    // 4. Scroll Reveal Animations (Simple Scroll triggers or simple load fades for sections)
    // To keep performance high and avoid ScrollTrigger plugin bundle size issues if not imported,
    // we use a clean IntersectionObserver inside standard animations or subtle delays.
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const revealCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            entry.target.querySelectorAll(".reveal-item"),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
          );
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);
    document.querySelectorAll(".reveal-section").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
