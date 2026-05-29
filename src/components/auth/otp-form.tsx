"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailOtpAction, resendOtpAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";

interface OtpFormProps {
  email: string;
  type: "signup" | "recovery" | "email_change";
}

export default function OtpForm({ email, type }: OtpFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Resend cooldown timer state
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // References to input elements
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle changes in each input
  const handleChange = (value: string, index: number) => {
    // Only accept numeric digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move focus back if current is empty
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current index
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    // Check if pasted value is a 6-digit number
    if (/^\d{6}$/.test(pasteData)) {
      const pasteDigits = pasteData.split("");
      setOtp(pasteDigits);
      // Focus the last input box
      inputRefs.current[5]?.focus();
    }
  };

  // Submit OTP Verification
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const token = otp.join("");
    if (token.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    startTransition(async () => {
      const res = await verifyEmailOtpAction({ email, token, type });
      if ("success" in res && res.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(("error" in res && res.error) || "Verification failed. Please check the code and try again.");
      }
    });
  };

  // Trigger Resend OTP Action
  const handleResend = () => {
    if (resendCooldown > 0) return;
    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      // resendOtpAction strictly takes 'signup' | 'email_change'
      const resendType = type === "recovery" ? "signup" : type;
      const res = await resendOtpAction({ email, type: resendType });
      if ("success" in res && res.success) {
        setSuccessMessage(res.message || "A new code has been sent!");
        setResendCooldown(60); // 60 seconds cooldown
      } else {
        setError(("error" in res && res.error) || "Failed to resend verification code.");
      }
    });
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between gap-2 sm:gap-3 py-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            disabled={isPending}
            aria-label={`Digit ${index + 1}`}
            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold bg-[var(--background)] border border-[var(--border-muted)] rounded-xl focus:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/20 transition-all text-text-primary disabled:opacity-50"
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-400 font-medium text-center">{error}</p>}
      {successMessage && <p className="text-sm text-accent-green font-medium text-center">{successMessage}</p>}

      <Button
        type="submit"
        disabled={!isOtpComplete || isPending}
        className="w-full h-11 transition-all"
      >
        {isPending ? "Verifying..." : "Verify Code"}
      </Button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isPending}
          className="text-sm text-text-secondary hover:text-accent-green disabled:opacity-50 font-medium transition-colors cursor-pointer"
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Didn't receive a code? Resend"}
        </button>
      </div>
    </form>
  );
}
