"use client";

import posthog from "posthog-js";

/**
 * Allowed event names for type-safe tracking.
 * Add new events here as the application grows.
 */
export type EventName =
  | "user_signed_up"
  | "user_signed_up_github"
  | "user_signed_in"
  | "user_signed_in_github"
  | "user_signed_out"
  | "user_updated_profile"
  | "user_changed_password"
  | "user_deleted_account"
  | "magic_link_requested"
  | "password_reset_requested"
  | "password_reset_completed"
  | "email_verified"
  | "email_verification_failed"
  | "signup_form_error"
  | "login_form_error"
  | "application_error"
  | "page_viewed"
  | "feature_used";

/**
 * Track an analytics event with optional properties.
 * Wired up to PostHog for event tracking.
 */
export function track(event: EventName, properties?: Record<string, unknown>) {
  posthog.capture(event, properties);
}

/**
 * Identify a user for analytics tracking.
 * Links anonymous sessions to a known user identity.
 */
export function identify(userId: string, traits?: Record<string, unknown>) {
  posthog.identify(userId, traits);
}

/**
 * Reset the current user's identity (e.g., on logout).
 * Unlinks future events from the current user.
 */
export function reset() {
  posthog.reset();
}

/**
 * Capture an exception/error for error tracking.
 * Sends error details to PostHog for monitoring.
 */
export function captureException(
  error: Error | unknown,
  additionalProperties?: Record<string, unknown>,
) {
  posthog.captureException(error, additionalProperties);
}
