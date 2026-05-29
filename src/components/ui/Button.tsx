import Link from "next/link";
import React from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 disabled:opacity-50 disabled:pointer-events-none";

const ghostStyle = "text-text-secondary hover:text-text-primary hover:bg-surface-hover px-3 py-2 text-xs font-mono uppercase tracking-widest";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  if (variant === "ghost") {
    return (
      <button
        className={`${base} ${ghostStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  const wrapperClass = variant === "primary" ? "torivo-btn-primary" : "torivo-btn-secondary";

  return (
    <div className={`torivo-btn-wrapper ${wrapperClass} ${className}`}>
      <div className="torivo-btn-shadow" />
      <button
        className="torivo-btn-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 disabled:opacity-50 disabled:pointer-events-none"
        {...props}
      >
        {children}
      </button>
    </div>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  onClick,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (variant === "ghost") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`${base} ${ghostStyle} ${className}`}
      >
        {children}
      </Link>
    );
  }

  const wrapperClass = variant === "primary" ? "torivo-btn-primary" : "torivo-btn-secondary";

  return (
    <div className={`torivo-btn-wrapper ${wrapperClass} ${className}`}>
      <div className="torivo-btn-shadow" />
      <Link
        href={href}
        onClick={onClick}
        className="torivo-btn-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40"
      >
        {children}
      </Link>
    </div>
  );
}

