import { getUserStats } from "@/modules/user/server";
import { createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
  /**
   * Get user account stats (demo of prefetch/hydrate/suspense pattern)
   */
  stats: protectedProcedure.query(async ({ ctx }) => {
    return getUserStats(ctx.session.user.id);
  }),
});
