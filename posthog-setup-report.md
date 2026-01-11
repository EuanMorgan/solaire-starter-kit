# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 16 project with PostHog analytics. The integration includes:

- **Modern client-side initialization** via `instrumentation-client.ts` (recommended for Next.js 15.3+)
- **Server-side tracking support** with `posthog-node` for API routes
- **Reverse proxy configuration** in `next.config.ts` to avoid ad blockers
- **Error tracking** with `captureException` for application errors
- **User identification** on login/signup for cross-session analytics
- **Type-safe event tracking** with a centralized analytics utility

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully creates a new account via email signup | `src/app/(auth)/signup/page.tsx` |
| `user_signed_in` | User successfully signs in via email/password authentication | `src/app/(auth)/login/page.tsx` |
| `user_signed_in_github` | User initiates GitHub OAuth sign-in flow | `src/app/(auth)/login/page.tsx` |
| `magic_link_requested` | User requests a magic link for passwordless sign-in | `src/app/(auth)/login/magic-link/page.tsx` |
| `password_reset_requested` | User requests a password reset link via forgot password form | `src/app/(auth)/forgot-password/page.tsx` |
| `password_reset_completed` | User successfully resets their password using a reset token | `src/app/(auth)/reset-password/page.tsx` |
| `email_verified` | User's email is successfully verified via verification link | `src/app/(auth)/verify-email/page.tsx` |
| `email_verification_failed` | Email verification fails due to invalid or expired token | `src/app/(auth)/verify-email/page.tsx` |
| `user_updated_profile` | User successfully updates their profile information (name) | `src/app/(dashboard)/settings/page.tsx` |
| `user_deleted_account` | User permanently deletes their account | `src/app/(dashboard)/settings/page.tsx` |
| `user_signed_out` | User signs out of the application | `src/components/app-sidebar.tsx` |
| `signup_form_error` | An error occurs during signup form submission | `src/app/(auth)/signup/page.tsx` |
| `login_form_error` | An error occurs during login form submission | `src/app/(auth)/login/page.tsx` |
| `application_error` | Captures unhandled application errors shown on the error page | `src/app/error.tsx` |

## Files Created/Modified

### Created
- `instrumentation-client.ts` - Client-side PostHog initialization
- `src/lib/posthog-server.ts` - Server-side PostHog client singleton

### Modified
- `src/lib/analytics.ts` - Added new event types and `captureException` function
- `src/components/posthog-provider.tsx` - Updated to work with instrumentation-client.ts
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `.env` - Added PostHog API key and host configuration
- Auth pages - Added event tracking calls

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://eu.posthog.com/project/114669/dashboard/482586) - Core analytics dashboard for tracking user authentication, conversions, and engagement

### Insights
- [User Signups Over Time](https://eu.posthog.com/project/114669/insights/MV1PbBhU) - Track new user registrations over time
- [Signup to Login Conversion Funnel](https://eu.posthog.com/project/114669/insights/LvDY3enY) - Track conversion from signup to first login
- [Authentication Methods Breakdown](https://eu.posthog.com/project/114669/insights/2JifPOCH) - Compare different authentication methods used
- [User Churn Events](https://eu.posthog.com/project/114669/insights/SxO3eEvd) - Track account deletions and sign-outs
- [Authentication Errors](https://eu.posthog.com/project/114669/insights/vBywvVWz) - Monitor login and signup errors for troubleshooting

## Configuration

Your PostHog environment variables are set in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_xePjCZ05t4hK1QNDfRuzv6WQ319QGwnK8Doo33ZirEx
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

The reverse proxy is configured to route through `/ingest` to avoid ad blockers.
