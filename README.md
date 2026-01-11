# Solaire

A modern Next.js 16 SaaS starter with auth, API, and database pre-configured.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) with App Router, React 19, React Compiler |
| Database | [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/) |
| API | [tRPC v11](https://trpc.io/) with [@trpc/tanstack-react-query](https://trpc.io/docs/client/react) |
| Auth | [better-auth](https://www.better-auth.com/) (email/password, magic link, GitHub OAuth) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Email | [Resend](https://resend.com/) + [React Email](https://react.email/) |
| Analytics | [PostHog](https://posthog.com/) with reverse proxy for ad-blocker bypass |
| Rate Limiting | [Upstash Redis](https://upstash.com/) sliding window rate limiter |
| Testing | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) + [Storybook](https://storybook.js.org/) + [MSW](https://mswjs.io/) |
| Linting | [Biome](https://biomejs.dev/) |

## Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/solaire.git
cd solaire
bun install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Start PostgreSQL (Docker)
docker-compose up -d

# Push schema to database
bun run db:push

# Seed test user
bun run db:seed

# Start dev server
bun dev
```

Visit [http://localhost:3000](http://localhost:3000). Login with `test@example.com` / `password123`.

## Scripts

```bash
# Development
bun dev                  # Start dev server
bun run build            # Production build
bun run start            # Start production server

# Database
bun run db:push          # Push schema to database
bun run db:studio        # Open Drizzle Studio
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations
bun run db:seed          # Seed test user

# Testing
bun run test             # Run unit tests
bun run test:watch       # Unit tests in watch mode
bun run test:coverage    # Unit tests with coverage
bun run test:e2e         # Run Playwright E2E
bun run test:e2e:ui      # Playwright with UI

# Code Quality
bun run typecheck        # TypeScript check
bun run lint             # Biome linter
bun run format           # Biome formatter
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/          # Auth pages (login, signup) - minimal layout
│   ├── (dashboard)/     # Protected pages - sidebar layout
│   └── api/             # API routes (auth, trpc, health)
├── components/          # React components
│   └── ui/              # shadcn/ui components
├── config/              # App configuration (site.ts)
├── db/                  # Drizzle ORM
│   └── schema/          # Database schemas
├── lib/                 # Utilities
│   ├── auth.ts          # better-auth server config
│   ├── auth-client.ts   # better-auth client
│   └── validations/     # Zod schemas
├── mocks/               # MSW mock handlers
├── modules/             # Feature modules
│   └── email/           # Email service & templates
├── test/                # Test utilities
└── trpc/                # tRPC setup
    └── routers/         # tRPC routers

e2e/                     # Playwright E2E tests
.github/workflows/       # CI pipeline
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `TABLE_PREFIX` | Yes | Table name prefix (e.g., `solaire_`) |
| `BETTER_AUTH_SECRET` | Yes | Auth token signing secret (32+ chars) |
| `NEXT_PUBLIC_BASE_URL` | Yes | App URL (e.g., `http://localhost:3000`) |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth app ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth app secret |
| `RESEND_API_KEY` | No | Resend API key for emails |
| `FROM_EMAIL` | No | Sender email address |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis token |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog analytics key |

See `.env.example` for all variables with descriptions.

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**
5. Copy **Client ID** and generate a **Client Secret**
6. Add to `.env`:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

For production, update URLs to your domain.

## Architecture

### Auth Flow
```
Client → better-auth client → /api/auth/[...all] → better-auth server → Drizzle → PostgreSQL
```

### API Flow
```
Client → useTRPC() hook → /api/trpc/[trpc] → tRPC router → procedure → Drizzle → PostgreSQL
```

### Route Protection
`src/proxy.ts` handles redirects:
- `/dashboard`, `/settings` → redirect to `/login` if unauthenticated
- `/login`, `/signup` → redirect to `/dashboard` if authenticated

## License

MIT
