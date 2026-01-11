import { z } from "zod";
import { deleteUser, getUserStats, updateUser } from "@/modules/user/server";
import { createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
  /**
   * Get user account stats (demo of prefetch/hydrate/suspense pattern)
   */
  stats: protectedProcedure.query(async ({ ctx }) => {
    return getUserStats(ctx.session.user.id);
  }),

  /**
   * Update user profile name
   */
  updateProfile: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return updateUser(userId, { name: input.name });
    }),

  /**
   * Delete user account (requires confirmation)
   */
  deleteAccount: protectedProcedure
    .input(
      z.object({
        confirmation: z
          .string()
          .refine((val) => val === "DELETE", "Type DELETE to confirm"),
      }),
    )
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      await deleteUser(userId);
      return { success: true };
    }),
});
