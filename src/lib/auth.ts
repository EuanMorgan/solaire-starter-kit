import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { cookies } from "next/headers";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env";
import { sendEmail } from "@/modules/email/server/email.service";
import {
  MagicLinkEmail,
  ResetPasswordEmail,
  VerificationEmail,
  WelcomeEmail,
} from "@/modules/email/ui";

export const auth = betterAuth({
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          void sendEmail({
            to: user.email,
            subject: "Welcome to Solaire",
            react: WelcomeEmail({ userName: user.name || "there" }),
          });
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,

    sendResetPassword: async ({ user, url }) => {
      // Don't await to prevent timing attacks
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({ resetUrl: url }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Don't await to prevent timing attacks
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        react: VerificationEmail({ verificationUrl: url }),
      });
    },
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
        // Don't await to prevent timing attacks
        void sendEmail({
          to: email,
          subject: "Sign in to your account",
          react: MagicLinkEmail({ magicLinkUrl: url }),
        });
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;

/**
 * Get session in server components.
 * Workaround for Next.js 16 bug where auth.api.getSession() returns null
 * despite valid session cookies. Fetches via API endpoint instead.
 * @see https://github.com/better-auth/better-auth/issues/7008
 * @see https://github.com/better-auth/better-auth/issues/4188
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/auth/get-session`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as Session | null;
  return data?.session ? data : null;
}
