"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { captureException, track } from "@/lib/analytics";

// biome-ignore lint/suspicious/noShadowRestrictedNames: Next.js error page convention
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const seenErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (seenErrorRef.current === error.digest) {
      return;
    }

    console.error(error);
    captureException(error, { digest: error.digest });
    track("application_error", {
      error_message: error.message,
      digest: error.digest,
    });

    seenErrorRef.current = error.digest ?? null;
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-destructive">
        Something went wrong
      </h1>
      <p className="text-muted-foreground">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "An unexpected error occurred."}
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Link href="/">
          <Button variant="outline">Go home</Button>
        </Link>
      </div>
    </div>
  );
}
