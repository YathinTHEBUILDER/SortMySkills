"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console for debugging
    console.error("[App Error Boundary]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 space-y-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-danger" />
      </div>

      <div className="space-y-2 max-w-sm">
        <h2 className="text-lg font-bold text-text-primary">Something went wrong</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {error.message || "An unexpected client-side error occurred. Try refreshing the page."}
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-text-muted mt-2">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={reset} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
        <Button
          variant="secondary"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
