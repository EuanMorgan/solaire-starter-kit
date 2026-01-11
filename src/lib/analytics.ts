"use client";

import posthog from "posthog-js";

/**
 * Allowed event names for type-safe tracking.
 * Add new events here as the application grows.
 */
export type EventName =
  | "user_signed_up"
  | "user_signed_in"
  | "user_signed_out"
  | "user_updated_profile"
  | "user_deleted_account"
  | "page_viewed"
  | "feature_used";

/**
 * Track an analytics event with optional properties.
 * No-ops if PostHog is not initialized.
 */
export function track(event: EventName, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;

  posthog.capture(event, properties);
}

/**
 * Identify a user for analytics tracking.
 * No-ops if PostHog is not initialized.
 */
export function identify(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;

  posthog.identify(userId, traits);
}

/**
 * Reset the current user's identity (e.g., on logout).
 * No-ops if PostHog is not initialized.
 */
export function reset() {
  if (typeof window === "undefined") return;
  if (!posthog.__loaded) return;

  posthog.reset();
}
