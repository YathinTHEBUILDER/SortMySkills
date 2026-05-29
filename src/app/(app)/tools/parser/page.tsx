"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ParserRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/career-analyser");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center font-mono text-xs text-text-muted">
      Redirecting to unified Career Analyser...
    </div>
  );
}
