"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import gsap from "gsap";

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle intro fade-in using GSAP
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-bg-warm/80 backdrop-blur-md fine-border-b bg-opacity-95"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <Logo className="w-8 h-8 transition-transform duration-500 group-hover:rotate-6" />
          <span className="font-mono text-sm tracking-[0.25em] text-text-primary font-bold uppercase transition-colors duration-300 group-hover:text-accent-cyan">
            SortMySkills
          </span>
        </Link>

        {/* Minimalist Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/skill-development"
            className={`font-mono text-[11px] tracking-wider uppercase transition-all duration-300 relative py-1 ${
              pathname === "/skill-development"
                ? "text-accent-green"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Skill Development
            {pathname === "/skill-development" && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-green" />
            )}
          </Link>

          <Link
            href="/job-match"
            className={`font-mono text-[11px] tracking-wider uppercase transition-all duration-300 relative py-1 ${
              pathname === "/job-match"
                ? "text-accent-cyan"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Job Match Analysis
            {pathname === "/job-match" && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-cyan" />
            )}
          </Link>

          <Link
            href="/#philosophy"
            className="font-mono text-[11px] tracking-wider uppercase text-text-secondary hover:text-text-primary transition-all duration-300 py-1"
          >
            Our Philosophy
          </Link>
        </nav>

        {/* System Status details (to give it a technical/editorial feel) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-card fine-line rounded-none text-[10px] font-mono text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span>CORE NODE ACTIVE</span>
          </div>
          <Link
            href="/job-match"
            className="px-4 py-1.5 bg-text-primary text-bg-dark text-[11px] font-mono uppercase font-semibold tracking-wider hover:bg-accent-green hover:text-bg-dark transition-all duration-300"
          >
            Launch Comparator
          </Link>
        </div>
      </div>
    </header>
  );
}
