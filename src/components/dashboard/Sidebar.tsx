"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="sticky top-16 z-20 w-full border-b border-[var(--border-strong)] bg-[var(--background)]/85 backdrop-blur-md px-4 sm:px-6">
      {/* Horizontal Nav List */}
      <nav className="max-w-5xl w-full mx-auto flex items-center justify-start gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
        {mainNav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 select-none shrink-0 ${
                active
                  ? "bg-accent-primary text-[#FAF8F6] shadow-xs"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-[#FAF8F6]" : "text-text-muted"}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
