import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env";
import { sendEmail } from "@/modules/email/server/email.service";
import {
  MagicLinkEmail,
  ResetPasswordEmail,
  VerificationEmail,
} from "@/modules/email/ui";

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
  ],
});
