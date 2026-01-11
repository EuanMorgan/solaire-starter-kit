# CLAUDE.md

AI assistant context for the Solaire project.

## Commands

```bash
# Development
bun dev              # Start Next.js dev server
bun run build        # Production build
bun run start        # Start production server

# Database
bun run db:push      # Push schema changes to database
bun run db:studio    # Open Drizzle Studio
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
bun run db:seed      # Seed test user (test@example.com / password123)

# Testing
bun run test         # Run Vitest unit tests
bun run test:watch   # Vitest watch mode
bun run test:coverage # Vitest with coverage report
bun run test:e2e     # Run Playwright E2E tests
bun run test:e2e:ui  # Playwright with UI
bun run test:storybook # Run Storybook component tests

# Storybook
bun run storybook    # Start Storybook dev server (port 6006)
bun run build-storybook # Build Storybook for production

# Code Quality
bun run typecheck    # TypeScript type checking
bun run lint         # Biome linter
bun run format       # Biome formatter
```

## Architecture

Next.js 16 app with tRPC v11, better-auth, Drizzle ORM, and Tailwind v4.

### Directory Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Auth pages (login, signup, etc.) - minimal layout
│   ├── (dashboard)/  # Protected pages - sidebar layout
│   └── api/          # API routes (auth, trpc, health)
├── components/       # React components
│   └── ui/           # shadcn/ui components
├── config/           # App configuration (site.ts)
├── db/               # Drizzle ORM
│   └── schema/       # Database schemas
├── lib/              # Utilities
│   ├── auth.ts       # better-auth server config
│   ├── auth-client.ts # better-auth client
│   └── validations/  # Zod schemas
├── mocks/            # MSW v2 mock handlers
├── modules/          # Feature modules (email)
├── test/             # Test utilities
└── trpc/             # tRPC setup
    ├── routers/      # tRPC routers
    ├── client.tsx    # Client provider
    └── server.tsx    # Server helpers
```

### Data Flow

1. **tRPC**: Client components use `useTRPC()` hook → tRPC client → `/api/trpc/[trpc]` → procedures
2. **Auth**: better-auth handles sessions → `auth.api.getSession()` in tRPC context → `protectedProcedure`
3. **Database**: Drizzle ORM → PostgreSQL via `postgres` driver

## Testing Patterns

### tRPC Procedure Testing

Use `createCaller` with mocked context. Mock env and db modules before importing router:

```ts
import { TRPCError } from "@trpc/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/env", () => ({
  env: {
    DATABASE_URL: "postgres://test:test@localhost:5432/test",
    BETTER_AUTH_SECRET: "test-secret",
    NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
    TABLE_PREFIX: "test_",
  },
}));

vi.mock("@/db", () => ({
  db: {
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: "1", name: "Updated" }]),
  },
}));

vi.mock("@/lib/rate-limit", () => ({ ratelimit: null }));

const { appRouter } = await import("../_app");

const mockUser = { id: "user-123", name: "Test", email: "test@example.com" };
const mockSession = { id: "session-123", userId: "user-123", token: "token" };

const createCaller = (sessionData) =>
  appRouter.createCaller({ session: sessionData, ip: "localhost" });

describe("userRouter.me", () => {
  it("returns user when authenticated", async () => {
    const caller = createCaller({ session: mockSession, user: mockUser });
    const result = await caller.user.me();
    expect(result).toEqual(mockUser);
  });

  it("throws UNAUTHORIZED when no session", async () => {
    const caller = createCaller(null);
    await expect(caller.user.me()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
```

### Zod Schema Testing

Test validation behavior, not schema structure:

```ts
import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "../auth";

describe("loginSchema", () => {
  it("rejects invalid email format", () => {
    const result = loginSchema.safeParse({ email: "not-email", password: "Password1" });
    expect(result.success).toBe(false);
  });

  it("rejects password under 8 chars", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "short" });
    expect(result.success).toBe(false);
  });

  it("accepts valid input", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "Password1" });
    expect(result.success).toBe(true);
  });
});

describe("signupSchema", () => {
  it("rejects mismatched confirmPassword", () => {
    const result = signupSchema.safeParse({
      name: "Test",
      email: "test@example.com",
      password: "Password1",
      confirmPassword: "Password2",
    });
    expect(result.success).toBe(false);
    const error = result.error?.issues.find((i) => i.path[0] === "confirmPassword");
    expect(error).toBeDefined();
  });
});
```

### E2E Testing with Playwright

Test user flows, not component internals. Use helper for auth:

```ts
// e2e/helpers/auth.ts
import type { Page } from "@playwright/test";

export async function loginAsTestUser(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/dashboard");
}

// e2e/dashboard/dashboard.spec.ts
import { expect, test } from "@playwright/test";
import { loginAsTestUser } from "../helpers/auth";

test.describe("Dashboard", () => {
  test("redirects unauthenticated to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test("shows user name when authenticated", async ({ page }) => {
    await loginAsTestUser(page);
    await expect(page.getByText("Test User")).toBeVisible();
  });
});
```

### MSW v2 Mock Handlers

For component tests requiring API mocking:

```ts
// src/mocks/handlers.ts
import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("*/api/trpc/user.me", () => {
    return HttpResponse.json({
      result: {
        data: {
          id: "test-user",
          name: "Test User",
          email: "test@example.com",
        },
      },
    });
  }),

  http.get("*/api/health", () => {
    return HttpResponse.json({ status: "ok" });
  }),
];

// Override handlers in tests
import { server } from "@/mocks/server";

test("handles error state", async () => {
  server.use(
    http.get("*/api/trpc/user.me", () => {
      return HttpResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
    })
  );
  // ... test error UI
});
```

### Component Testing with Providers

Use `renderWithProviders` for components needing tRPC/React Query:

```ts
import { renderWithProviders, screen } from "@/test/utils";
import { UserProfile } from "./UserProfile";

test("renders user profile", async () => {
  renderWithProviders(<UserProfile />);
  expect(await screen.findByText("Test User")).toBeInTheDocument();
});
```

## Key Conventions

- **Next.js 16**: `params` and `searchParams` are Promises - must await
- **Tailwind v4**: CSS-first config in `globals.css`, no `tailwind.config.ts`
- **Route protection**: `src/proxy.ts` redirects unauthenticated users
- **Test user**: `test@example.com` / `password123` (run `bun run db:seed`)
- **Table prefix**: All tables use `TABLE_PREFIX` env var for multi-tenancy

## Claude Instructions

### Environment Setup

When setting up for local development, copy the `.env` file from `.env.local`:

```bash
cp .env.local .env
```

### Before Pushing Code

**IMPORTANT**: Always run these checks before pushing any code:

```bash
bun run typecheck && bun run lint && bun run format
```

This ensures:
1. TypeScript types are valid
2. Code passes linting rules
3. Code is properly formatted

Fix any errors before committing and pushing.
