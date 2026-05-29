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
      className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider border transition-all duration-200 ${
        isActive(href)
          ? "bg-[var(--surface-soft)] border-[var(--border-muted)] text-accent-primary font-bold shadow-xs"
          : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover/85"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
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
        className={`fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col border-r border-[var(--border-muted)] bg-surface-card transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Logo Area */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border-muted)]">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <Logo className="w-7 h-7" />
            <span className="font-semibold text-sm text-text-primary tracking-tight font-serif italic">
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
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <p className="px-3 pb-2 text-[10px] font-mono text-text-muted uppercase tracking-widest">
            Workspace
          </p>
          {mainNav.map(({ href, label, icon }) => navLink(href, label, icon))}
        </nav>

        {/* Sidebar Footer details */}
        <div className="p-5 border-t border-[var(--border-muted)] bg-[var(--surface-soft)]/20">
          <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/40 p-3.5">
            <span className="eyebrow block text-[8px] tracking-widest text-accent-primary">SortMySkills SaaS</span>
            <p className="text-[11px] text-text-secondary leading-relaxed mt-2">
              Auditing technical readiness and mapping placement gaps locally.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
