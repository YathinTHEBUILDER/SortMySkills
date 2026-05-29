"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { mainNav } from "@/config/navigation";
import { X } from "lucide-react";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navLink = (href: string, label: string, Icon: LucideIcon) => (
    <Link
      key={href}
      href={href}
      onClick={onClose}
      className={`flex items-center gap-3.5 px-5 py-3.5 text-xs font-sans font-semibold tracking-wide border-b border-[var(--border-muted)] transition-all duration-150 relative ${
        isActive(href)
          ? "bg-surface-card-warm text-accent-primary font-bold"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/60"
      }`}
    >
      {isActive(href) && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-primary" />
      )}
      <Icon className={`w-4 h-4 shrink-0 ${isActive(href) ? "text-accent-primary" : "text-text-muted"}`} />
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col border-r border-[var(--border-strong)] bg-surface-card transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Logo Area */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border-strong)]">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <Logo className="w-7 h-7" />
            <span className="font-bold text-sm text-text-primary tracking-tight font-serif italic">
              SortMySkills
            </span>
          </Link>
          <button
            type="button"
            className="lg:hidden p-1 text-text-secondary hover:text-text-primary border border-[var(--border-muted)] rounded-md transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto">
          <div className="px-5 pt-5 pb-2.5 border-b border-[var(--border-muted)] bg-[var(--surface-soft)]/20">
            <p className="text-[9px] font-mono text-text-muted uppercase tracking-widest">
              Workspace Platform
            </p>
          </div>
          {mainNav.map(({ href, label, icon }) => navLink(href, label, icon))}
        </nav>

        {/* Sidebar Footer details */}
        <div className="p-4 border-t border-[var(--border-strong)] bg-[var(--surface-soft)]/20">
          <div className="border border-[var(--border-strong)] bg-surface-card p-4 shadow-xs relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 dot-grid-overlay opacity-15 pointer-events-none" />
            <span className="eyebrow block text-[8px] tracking-widest text-accent-primary">SortMySkills Core</span>
            <p className="text-[9px] text-text-secondary leading-relaxed mt-2 font-mono uppercase tracking-tight">
              Design Inspired by <span className="font-serif italic text-accent-primary lowercase font-semibold">torivo</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
