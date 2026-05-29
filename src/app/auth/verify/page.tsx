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
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[var(--background)]">
        <Card className="w-full max-w-md text-center py-8">
          <CardBody>
            <p className="text-text-primary font-medium mb-4">Missing email parameter.</p>
            <Link href="/login" className="text-accent-green hover:underline text-sm font-medium">
              Return to Login
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[var(--background)]">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Logo className="w-8 h-8" />
        <span className="font-semibold text-text-primary">SortMySkills</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader
          title="Verify your email"
          description={`We sent a 6-digit verification code to ${email}`}
        />
        <CardBody className="pt-0">
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
          <p className="text-sm text-text-secondary">Loading...</p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
