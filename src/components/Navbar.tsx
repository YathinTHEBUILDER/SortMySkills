"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import ThemeControls from "./ThemeControls";
import gsap from "gsap";

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  const linkClass = (active: boolean, accent: "green" | "cyan") =>
    `font-mono text-[11px] tracking-wider uppercase transition-all duration-300 relative py-1 ${
      active
        ? accent === "green"
          ? "text-accent-green"
          : "text-accent-cyan"
        : "text-text-secondary hover:text-text-primary"
    }`;

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-bg-warm/80 backdrop-blur-md fine-border-b"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <Logo className="w-8 h-8 transition-transform duration-500 group-hover:rotate-6" />
          <span className="font-mono text-sm tracking-[0.25em] text-text-primary font-bold uppercase transition-colors duration-300 group-hover:text-accent-cyan hidden sm:inline">
            SortMySkills
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/skill-development"
            className={linkClass(pathname === "/skill-development", "green")}
          >
            Skill Development
            {pathname === "/skill-development" && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-green" />
            )}
          </Link>

          <Link
            href="/job-match"
            className={linkClass(pathname === "/job-match", "cyan")}
          >
            Job Match
            {pathname === "/job-match" && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-cyan" />
            )}
          </Link>

          <Link
            href="/interview-packs"
            className={linkClass(pathname.startsWith("/interview-packs"), "green")}
          >
            Interview Packs
            {pathname.startsWith("/interview-packs") && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-green" />
            )}
          </Link>

          <Link
            href="/#philosophy"
            className="font-mono text-[11px] tracking-wider uppercase text-text-secondary hover:text-text-primary transition-all duration-300 py-1"
          >
            Philosophy
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeControls />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-card fine-line text-[10px] font-mono text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span>ACTIVE</span>
          </div>
          <Link
            href="/job-match"
            className="px-3 sm:px-4 py-1.5 bg-text-primary text-bg-dark text-[10px] sm:text-[11px] font-mono uppercase font-semibold tracking-wider hover:bg-accent-green hover:text-bg-dark transition-all duration-300 whitespace-nowrap"
          >
            Comparator
          </Link>
        </div>
      </div>
    </header>
  );
}
