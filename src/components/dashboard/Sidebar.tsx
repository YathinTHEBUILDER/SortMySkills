"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { mainNav, secondaryNav } from "@/config/navigation";
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
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        isActive(href)
          ? "bg-accent-green/10 text-accent-green font-medium"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </Link>
  );

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col border-r border-[var(--border-muted)] bg-[var(--surface-card)] transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border-muted)]">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <Logo className="w-7 h-7" />
            <span className="font-semibold text-sm text-text-primary tracking-tight">
              SortMySkills
            </span>
          </Link>
          <button
            type="button"
            className="lg:hidden p-1 text-text-secondary hover:text-text-primary"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-text-secondary/80">
            Workspace
          </p>
          {mainNav.map(({ href, label, icon }) => navLink(href, label, icon))}

          <p className="px-3 pt-6 pb-2 text-[11px] font-medium uppercase tracking-wider text-text-secondary/80">
            Account
          </p>
          {secondaryNav.map(({ href, label, icon }) => navLink(href, label, icon))}
        </nav>

        <div className="p-4 border-t border-[var(--border-muted)]">
          <p className="text-xs text-text-secondary leading-relaxed">
            Career intelligence — skills, gaps, and interview prep in one place.
          </p>
        </div>
      </aside>
    </>
  );
}
