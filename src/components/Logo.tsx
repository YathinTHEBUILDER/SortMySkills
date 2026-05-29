"use client";

import React from "react";

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3be87e" />
          <stop offset="100%" stopColor="#1ad1d7" />
        </linearGradient>
      </defs>
      
      {/* Dynamic interlocking geometric paths representing the premium SortMySkills logo */}
      {/* Main Upward Arrow */}
      <path
        d="M88 22L92 44L82 40L62 60L50 48L70 28L66 24L88 22Z"
        fill="url(#logo-gradient)"
      />
      
      {/* S-Ribbon Path 1 (Top curve) */}
      <path
        d="M20 54L38 36H72L54 54H32L20 66L14 60L20 54Z"
        fill="url(#logo-gradient)"
      />
      
      {/* S-Ribbon Path 2 (Middle cross link) */}
      <path
        d="M72 36L44 64L32 52L60 24H72V36Z"
        fill="url(#logo-gradient)"
      />
      
      {/* S-Ribbon Path 3 (Lower center bar) */}
      <path
        d="M48 66L66 48H80L62 66H48Z"
        fill="url(#logo-gradient)"
      />
      
      {/* S-Ribbon Path 4 (Bottom support) */}
      <path
        d="M32 82L50 64H84L66 82H32Z"
        fill="url(#logo-gradient)"
      />
      
      {/* Left Interlock block */}
      <path
        d="M14 60L26 48L44 66L32 78L14 60Z"
        fill="url(#logo-gradient)"
      />
      
      {/* Right Interlock block */}
      <path
        d="M80 48L92 60L74 78L62 66L80 48Z"
        fill="url(#logo-gradient)"
      />
    </svg>
  );
}
