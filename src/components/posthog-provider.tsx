"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { env } from "@/env";

/**
 * PostHog React context provider.
 *
 * Note: PostHog is initialized in instrumentation-client.ts, which is the
 * recommended approach for Next.js 15.3+. This provider only wraps the app
 * with the React context to enable hooks like usePostHog.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
