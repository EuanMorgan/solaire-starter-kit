import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Database - required
    DATABASE_URL: z.string().url(),
    TABLE_PREFIX: z.string().default("solaire_"),
    // Auth - required (min 32 chars for security)
    BETTER_AUTH_SECRET: z.string().min(32),
    // GitHub OAuth - optional
    GITHUB_CLIENT_ID: z.string().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
    // Email (Resend) - optional
    RESEND_API_KEY: z.string().min(1).optional(),
    FROM_EMAIL: z.string().email().optional(),
    // Rate limiting (Upstash) - optional
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
