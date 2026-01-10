# Solaire

A modern, opinionated SaaS starter template. Built for devs who hate boilerplate.

## What's Included

### Core Stack

- **Next.js 16** with App Router, React 19, and Turbopack
- **PostgreSQL** with Drizzle ORM for type-safe database operations
- **tRPC 11** for end-to-end type safety, server-prefetched for speed
- **TypeScript** in strict mode throughout

### Authentication

- **Better Auth** with multiple strategies:
  - Email/password with verification
  - Magic link (passwordless)
  - GitHub OAuth
- Protected routes via middleware
- Session management out of the box

### Styling & UI

- **Tailwind CSS v4** for utility-first styling
- **shadcn/ui** components (pre-installed: Button, Card, Input, Form, Dialog, Toast, etc.)
- Dark mode ready

### Email

- **Resend** for transactional emails
- **React Email** templates (verification, password reset, welcome)
- Module pattern: `src/modules/email/{server,ui}`

### Testing

- **Vitest** for unit tests with React Testing Library
- **Playwright** for E2E tests
- **MSW** for API mocking
- Coverage thresholds configured

### Developer Experience

- **Biome** for linting and formatting (fast, all-in-one)
- **T3 Env** for validated environment variables
- **GitHub Actions** CI pipeline (typecheck, lint, test, e2e)
- **Storybook** for component development
- **Posthog** for analytics and session replay
- Opinionated VSCode settings included

### Automation (Ralph)

- AI-powered task automation with Claude CLI
- Pushover notifications on completion
- PRD-driven development workflow
- See `plans/` directory for setup

## Quick Start

```bash
# Clone and install
git clone <your-repo>
cd solaire
bun install

# Set up environment
cp .env.example .env
# Fill in DATABASE_URL, BETTER_AUTH_SECRET, etc.

# Start Postgres (Docker)
docker-compose up -d

# Push schema to database
bun db:push

# Start developing
bun dev
```

## Commands

```bash
# Development
bun dev              # Start dev server (Turbopack)
bun build            # Production build
bun start            # Start production server

# Database
bun db:push          # Push schema to DB
bun db:studio        # Open Drizzle Studio
bun db:generate      # Generate migrations
bun db:migrate       # Run migrations

# Testing
bun test             # Run unit tests
bun test:watch       # Watch mode
bun test:e2e         # Run Playwright E2E
bun test:e2e:ui      # Playwright with UI

# Code Quality
bun lint             # Check with Biome
bun lint:fix         # Auto-fix issues
bun typecheck        # TypeScript check

# Storybook
bun storybook        # Start Storybook dev
bun storybook:build  # Build static Storybook
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/          # Auth pages (login, signup, etc.)
│   ├── dashboard/       # Protected dashboard
│   └── api/             # API routes (tRPC, auth)
├── components/          # React components
│   └── ui/              # shadcn/ui components
├── db/
│   └── schema/          # Drizzle schemas (modular)
│       ├── auth.schema.ts
│       ├── common.ts
│       └── index.ts
├── lib/
│   ├── auth.ts          # Better Auth config
│   ├── analytics.ts     # Posthog helpers
│   └── validations/     # Zod schemas
├── modules/
│   └── email/
│       ├── server/      # Email service (Resend)
│       └── ui/          # React Email templates
├── trpc/
│   ├── routers/         # tRPC routers
│   ├── client.ts        # Client hooks
│   ├── server.ts        # Server caller
│   └── init.ts          # tRPC init + middleware
├── mocks/               # MSW handlers
└── test/                # Test utilities

plans/                   # Ralph automation
├── ralph.sh             # Main automation script
├── notify.sh            # Pushover notifications
├── prd.json             # Task definitions
└── progress.txt         # Session log

e2e/                     # Playwright tests
.github/workflows/       # CI pipeline
.vscode/                 # Editor settings
```

## Environment Variables

```env
# Required
DATABASE_URL=postgres://user:pass@localhost:5434/solaire
BETTER_AUTH_SECRET=your-secret-key
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000

# Auth Providers (optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email (optional, for transactional emails)
RESEND_API_KEY=
FROM_EMAIL=noreply@yourdomain.com

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Automation (optional)
PUSHOVER_TOKEN=
PUSHOVER_USER=
```

## Ralph Automation

Ralph is a Claude CLI-based automation system for PRD-driven development:

```bash
# Run 5 task iterations
./plans/ralph.sh 5

# Single iteration
./plans/ralph.sh 1
```

**How it works:**

1. Reads tasks from `plans/prd.json`
2. Claude picks and implements the next task
3. Logs progress to `plans/progress.txt`
4. Sends Pushover notification on completion

**Setup:**

1. Install [Claude CLI](https://claude.ai/code)
2. Add `PUSHOVER_TOKEN` and `PUSHOVER_USER` to `.env` (optional)
3. Define tasks in `plans/prd.json`

## Extending

### Adding a new OAuth provider

1. Add client ID/secret to `src/env.ts`
2. Add provider to `src/lib/auth.ts`
3. Add button to login page

### Adding Stripe (common extension)

See [Stripe Next.js guide](https://stripe.com/docs/stripe-js/react) - not included to keep boilerplate minimal.

### Adding a new database table

1. Create `src/db/schema/your-table.schema.ts`
2. Export from `src/db/schema/index.ts`
3. Run `bun db:push`

## License

MIT
