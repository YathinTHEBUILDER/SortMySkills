import Link from "next/link";
import React from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green/40 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-accent-green text-bg-dark hover:opacity-90 px-4 py-2.5",
  secondary:
    "border border-[var(--border-muted)] bg-transparent text-text-primary hover:bg-surface-hover px-4 py-2.5",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-hover px-3 py-2",
};

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
