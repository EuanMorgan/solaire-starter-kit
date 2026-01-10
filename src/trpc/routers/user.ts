import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { user } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
  /**
   * Get current user data
   */
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),

  /**
   * Update user profile name
   */
  updateProfile: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const [updated] = await db
        .update(user)
        .set({ name: input.name })
        .where(eq(user.id, userId))
        .returning();
      return updated;
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
      await db.delete(user).where(eq(user.id, userId));
      return { success: true };
    }),
});
