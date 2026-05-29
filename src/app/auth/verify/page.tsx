"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import OtpForm from "@/components/auth/otp-form";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const typeParam = searchParams.get("type") || "signup";

  // Validate OTP type strictly
  const type =
    typeParam === "recovery"
      ? "recovery"
      : typeParam === "email_change"
        ? "email_change"
        : "signup";

  if (!email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[var(--background)] warm-noise-bg relative">
        <div className="warm-glow-effect top-[10%] left-[20%] opacity-80" />
        <Card className="w-full max-w-md premium-card text-center py-8 relative z-10 overflow-hidden">
          <CardBody>
            <p className="text-text-primary font-semibold mb-4 text-sm font-mono uppercase tracking-wider">Missing email parameter.</p>
            <Link href="/login" className="text-xs font-mono uppercase tracking-widest text-accent-primary hover:underline font-bold">
              Return to Login
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[var(--background)] warm-noise-bg relative">
      <div className="warm-glow-effect top-[10%] left-[20%] opacity-80" />

      <Link href="/" className="flex items-center gap-2 mb-8 relative z-10 group">
        <Logo className="w-8 h-8 group-hover:rotate-6 transition-transform duration-300" />
        <span className="font-semibold text-text-primary text-base tracking-tight font-serif italic">SortMySkills</span>
      </Link>

      <Card className="w-full max-w-md premium-card shadow-lg relative z-10 overflow-hidden animated-border">
        <div className="absolute inset-0 dot-grid-overlay opacity-20 pointer-events-none" />
        <CardHeader
          title="Verify Email"
          description={`We sent a 6-digit verification code to ${email}`}
          className="relative z-10 text-center pb-2"
        />
        <CardBody className="pt-0 relative z-10">
          <OtpForm email={email} type={type} />
        </CardBody>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] warm-noise-bg">
          <p className="text-xs font-mono uppercase tracking-widest text-text-muted animate-pulse">Initializing Security...</p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
