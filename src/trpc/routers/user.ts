import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { setPasswordSchema } from "@/lib/validations/auth";
import { sendEmail } from "@/modules/email/server/email.service";
import { PasswordAddedEmail } from "@/modules/email/ui";
import { getUserStats, userHasPassword } from "@/modules/user/server";
import { createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
  /**
   * Get user account stats (demo of prefetch/hydrate/suspense pattern)
   */
  stats: protectedProcedure.query(async ({ ctx }) => {
    return getUserStats(ctx.session.user.id);
  }),

  /**
   * Check if user has a password (credential account)
   */
  hasPassword: protectedProcedure.query(async ({ ctx }) => {
    return userHasPassword(ctx.session.user.id);
  }),

  /**
   * Set password for OAuth/magic link users who don't have one
   */
  setPassword: protectedProcedure
    .input(setPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify user doesn't already have a password
      const hasPassword = await userHasPassword(ctx.session.user.id);
      if (hasPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have a password. Use change password instead.",
        });
      }

      // Set password using better-auth API
      const reqHeaders = await headers();
      const result = await auth.api.setPassword({
        body: { newPassword: input.newPassword },
        headers: reqHeaders,
      });

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set password",
        });
      }

      // Send notification email
      void sendEmail({
        to: ctx.session.user.email,
        subject: "Password added to your account",
        react: PasswordAddedEmail({
          userName: ctx.session.user.name || "there",
        }),
      });

      return { success: true };
    }),
});
