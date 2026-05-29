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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl px-2 sm:px-4">
      {/* Floating capsule dock with frosted glass blur and premium shadow */}
      <nav className="glass-card rounded-full border border-[var(--border-strong)] px-3 py-2 flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2.5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 dot-grid-overlay opacity-[0.08] pointer-events-none" />
        
        {mainNav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3.5 py-2 text-[11px] font-semibold rounded-full transition-all duration-200 hover-lift select-none ${
                active
                  ? "bg-accent-primary text-[#FAF8F6] shadow-sm scale-105"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-[#FAF8F6]" : "text-text-muted"}`} />
              {/* Hide text on screens below tablet (768px) to fit all 7 links cleanly */}
              <span className="hidden md:inline">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
