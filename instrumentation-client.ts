import posthog from "posthog-js";

// Initialize PostHog for client-side tracking
// This is the recommended approach for Next.js 15.3+
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    // Use reverse proxy to avoid ad blockers
    api_host: "/ingest",
    // UI host for EU region (used for toolbar, heatmaps, etc.)
    ui_host: "https://eu.posthog.com",
    // Use the latest defaults for automatic pageview and pageleave capture
    capture_pageview: "history_change",
    capture_pageleave: "if_capture_pageview",
    // Enable error tracking
    capture_exceptions: true,
    // Enable debug mode in development
    debug: process.env.NODE_ENV === "development",
  });
}

// IMPORTANT: Never combine this approach with other client-side PostHog initialization
// approaches, especially components like a PostHogProvider that call posthog.init().
// instrumentation-client.ts is the correct solution for initializing client-side
// PostHog in Next.js 15.3+ apps.
