"use client";

import React from "react";

type LogoVariant = "mark" | "horizontal" | "wordmark";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
}

export default function Logo({
  variant = "mark",
  className = "",
}: LogoProps) {
  // S-mark SVG structure
  const renderMark = (sizeClass: string) => (
    <svg
      className={`${sizeClass}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* S-curve Spine and loops (Theme-adaptive stroke via currentColor) */}
      <path
        d="M 48 70 C 48 58 60 58 60 52 C 60 46 48 46 48 40 C 48 34 60 34 72 34"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Bottom-most Loop (Theme-adaptive stroke via currentColor) */}
      <path
        d="M 48 70 C 58 70 66 74 66 80 C 66 86 58 86 48 86"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Left branch lines (Theme-adaptive stroke via currentColor) */}
      <line x1="48" y1="70" x2="32" y2="82" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
      <line x1="48" y1="70" x2="32" y2="58" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
      
      {/* Top-right roadmap arrow track (Sage Green #AFD275) */}
      <path
        d="M 72 34 C 80 34 80 24 80 14"
        stroke="#AFD275"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Sage green arrowhead pointing up-right */}
      <path
        d="M 74 18 L 80 12 L 86 18"
        stroke="#AFD275"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Node Circles (Connected skill nodes) */}
      <circle cx="32" cy="82" r="6" fill="#EAB364" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="58" r="6" fill="#E7717D" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="48" cy="70" r="6" fill="currentColor" />
      <circle cx="60" cy="52" r="6" fill="#E7717D" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="48" cy="40" r="6" fill="#EAB364" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="72" cy="34" r="6" fill="#E7717D" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="48" cy="86" r="6" fill="#AFD275" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );

  const renderWordmark = (textClass: string) => (
    <span className={`font-sans font-extrabold tracking-tight select-none ${textClass}`}>
      SortMy<span className="text-[#E7717D]">S</span>kills
    </span>
  );

  if (variant === "wordmark") {
    return renderWordmark(className || "text-xl");
  }

  if (variant === "horizontal") {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        {renderMark("w-7 h-7 shrink-0")}
        {renderWordmark("text-base")}
      </div>
    );
  }

  // Default variant is "mark"
  return renderMark(className || "w-8 h-8");
}
