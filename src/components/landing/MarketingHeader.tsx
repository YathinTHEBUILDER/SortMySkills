"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeControls from "@/components/ThemeControls";
import { ButtonLink } from "@/components/ui/Button";
import { signOutAction } from "@/app/actions/auth";

import type { User } from "@supabase/supabase-js";

interface MarketingHeaderProps {
  user: User | null;
}

export default function MarketingHeader({ user }: MarketingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 navbar-fade opacity-0 border-b border-[var(--border-muted)] bg-[var(--background)]/80 backdrop-blur-md transition-all duration-300">
      <div className="flex items-center justify-between px-6 h-16 max-w-6xl mx-auto w-full">
        {/* Left Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group" onClick={closeMobileMenu}>
            <Logo className="w-7 h-7 group-hover:rotate-6 transition-transform duration-300" />
            <span className="font-semibold text-text-primary text-base tracking-tight font-serif italic">
              SortMySkills
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-sans">
            <a
              href="#product-showcase"
              className="text-xs font-semibold tracking-wide text-text-secondary hover:text-accent-primary transition-colors"
            >
              Product
            </a>
            <a
              href="#tools-preview"
              className="text-xs font-semibold tracking-wide text-text-secondary hover:text-accent-primary transition-colors"
            >
              Tools
            </a>

            <Link
              href="/interview-packs"
              className="text-xs font-semibold tracking-wide text-text-secondary hover:text-accent-primary transition-colors"
            >
              Interview Packs
            </Link>
            <Link
              href="/career-analyser"
              className="text-xs font-semibold tracking-wide text-text-secondary hover:text-accent-primary transition-colors"
            >
              Analyser
            </Link>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 sm:gap-4 font-sans">
          <div className="hidden sm:block">
            <ThemeControls />
          </div>

          {/* User Session Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold tracking-wide text-text-secondary hover:text-text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <form action={signOutAction} className="inline-flex">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-text-secondary hover:text-red-400 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold tracking-wide text-text-secondary hover:text-text-primary transition-colors"
                >
                  Sign In
                </Link>
                <ButtonLink
                  href="/signup"
                  className="h-9"
                >
                  Get Started
                </ButtonLink>
              </>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-surface-hover text-text-secondary border border-[var(--border-muted)] transition-colors cursor-pointer"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-[var(--background)]/98 backdrop-blur-lg border-t border-[var(--border-muted)] flex flex-col justify-between p-6 z-50 animate-fade-in-up">
          <nav className="flex flex-col gap-5 pt-4 font-sans">
            <a
              href="#product-showcase"
              onClick={closeMobileMenu}
              className="text-sm font-semibold tracking-wide text-text-primary hover:text-accent-primary border-b border-[var(--border-muted)] pb-2 transition-colors"
            >
              Product
            </a>
            <a
              href="#tools-preview"
              onClick={closeMobileMenu}
              className="text-sm font-semibold tracking-wide text-text-primary hover:text-accent-primary border-b border-[var(--border-muted)] pb-2 transition-colors"
            >
              Tools
            </a>

            <Link
              href="/interview-packs"
              onClick={closeMobileMenu}
              className="text-sm font-semibold tracking-wide text-text-primary hover:text-accent-primary border-b border-[var(--border-muted)] pb-2 transition-colors"
            >
              Interview Prep
            </Link>
            <Link
              href="/career-analyser"
              onClick={closeMobileMenu}
              className="text-sm font-semibold tracking-wide text-text-primary hover:text-accent-primary border-b border-[var(--border-muted)] pb-2 transition-colors"
            >
              Career Analyser
            </Link>
            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="text-sm font-semibold tracking-wide text-text-primary hover:text-accent-primary border-b border-[var(--border-muted)] pb-2 transition-colors"
            >
              Dashboard
            </Link>
          </nav>

          {/* Bottom mobile controls */}
          <div className="space-y-6 pb-10 border-t border-[var(--border-muted)] pt-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono uppercase text-text-muted">Interface Theme</span>
              <ThemeControls />
            </div>

            <div className="flex flex-col gap-3">
              {user ? (
                <form action={signOutAction} className="w-full flex">
                  <button
                    type="submit"
                    onClick={closeMobileMenu}
                    className="w-full h-11 border border-[var(--border-muted)] rounded-full text-xs font-mono uppercase tracking-widest text-text-primary bg-surface-card hover:bg-surface-hover transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out account</span>
                  </button>
                </form>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="w-full h-11 border border-[var(--border-strong)] rounded-full text-xs font-mono uppercase tracking-widest text-text-primary bg-transparent flex items-center justify-center transition-all hover:bg-surface-hover"
                  >
                    Sign In
                  </Link>
                  <ButtonLink
                    href="/signup"
                    onClick={closeMobileMenu}
                    className="w-full h-11"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </ButtonLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
