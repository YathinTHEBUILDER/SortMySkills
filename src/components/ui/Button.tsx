import Link from "next/link";
import React from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 disabled:opacity-50 disabled:pointer-events-none";

const ghostStyle = "text-text-secondary hover:text-text-primary hover:bg-surface-hover px-3 py-2 text-xs font-mono uppercase tracking-widest";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

function splitClassName(className: string) {
  if (!className) return { wrapperClass: "", contentClass: "" };
  
  const wrapperClasses: string[] = [];
  const contentClasses: string[] = [];

  const classes = className.split(/\s+/).filter(Boolean);
  for (const cls of classes) {
    if (
      cls.startsWith("w-") ||
      cls.startsWith("h-") ||
      cls.startsWith("m-") ||
      cls.startsWith("mt-") ||
      cls.startsWith("mr-") ||
      cls.startsWith("mb-") ||
      cls.startsWith("ml-") ||
      cls.startsWith("mx-") ||
      cls.startsWith("my-") ||
      cls === "flex-1" ||
      cls === "flex-none" ||
      cls === "shrink-0" ||
      cls === "grow" ||
      cls === "absolute" ||
      cls === "relative" ||
      cls === "static" ||
      cls === "fixed" ||
      cls.startsWith("top-") ||
      cls.startsWith("right-") ||
      cls.startsWith("bottom-") ||
      cls.startsWith("left-") ||
      cls.startsWith("z-") ||
      cls === "hidden" ||
      cls === "block" ||
      cls === "inline-block" ||
      cls === "flex" ||
      cls === "inline-flex" ||
      cls.startsWith("grid") ||
      cls.startsWith("col-") ||
      cls.startsWith("row-")
    ) {
      wrapperClasses.push(cls);
    } else {
      contentClasses.push(cls);
    }
  }

  return {
    wrapperClass: wrapperClasses.join(" "),
    contentClass: contentClasses.join(" "),
  };
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

  const wrapperVariantClass = variant === "primary" ? "torivo-btn-primary" : "torivo-btn-secondary";
  const { wrapperClass, contentClass } = splitClassName(className);

  return (
    <div className={`torivo-btn-wrapper ${wrapperVariantClass} ${wrapperClass}`}>
      <div className="torivo-btn-shadow" />
      <button
        className={`torivo-btn-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 disabled:opacity-50 disabled:pointer-events-none ${contentClass}`}
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
  }  const wrapperVariantClass = variant === "primary" ? "torivo-btn-primary" : "torivo-btn-secondary";
  const { wrapperClass, contentClass } = splitClassName(className);

  return (
    <div className={`torivo-btn-wrapper ${wrapperVariantClass} ${wrapperClass}`}>
      <div className="torivo-btn-shadow" />
      <Link
        href={href}
        onClick={onClick}
        className={`torivo-btn-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 ${contentClass}`}
      >
        {children}
      </Link>
    </div>
  );
}
