"use client";

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
 * TODO: Wire up to your analytics provider (e.g., PostHog, Mixpanel, etc.)
 */
export function track(_event: EventName, _properties?: Record<string, unknown>) {
  // No-op stub - implement with your analytics provider
}

/**
 * Identify a user for analytics tracking.
 * TODO: Wire up to your analytics provider
 */
export function identify(_userId: string, _traits?: Record<string, unknown>) {
  // No-op stub - implement with your analytics provider
}

/**
 * Reset the current user's identity (e.g., on logout).
 * TODO: Wire up to your analytics provider
 */
export function reset() {
  // No-op stub - implement with your analytics provider
}

/**
 * Capture an exception/error for error tracking.
 * TODO: Wire up to your analytics provider
 */
export function captureException(
  _error: Error | unknown,
  _additionalProperties?: Record<string, unknown>,
) {
  // No-op stub - implement with your analytics provider
}
