import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    // Email verification can be enabled later via emailVerification config
    // requireEmailVerification: true,
  },
  // GitHub OAuth provider
  // Callback URL: {baseURL}/api/auth/callback/github
  socialProviders: {
    ...(env.GITHUB_CLIENT_ID &&
      env.GITHUB_CLIENT_SECRET && {
        github: {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
        },
      }),
  },
  plugins: [
    magicLink({
      expiresIn: 600, // 10 minutes
      sendMagicLink: async ({ email, url }) => {
        // Placeholder - will be wired to Resend in EMAIL-003
        console.log(`[Magic Link] Send to ${email}: ${url}`);
      },
    }),
  ],
});
