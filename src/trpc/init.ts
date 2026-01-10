import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import { ratelimit } from "@/lib/rate-limit";

export const createTRPCContext = cache(async () => {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });
  // Get IP for rate limiting (X-Forwarded-For or fallback)
  const ip =
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return { session, ip };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

const isDev = process.env.NODE_ENV === "development";

// Sanitize input by removing sensitive fields
function sanitizeInput(input: unknown): unknown {
  if (input === null || input === undefined) return input;
  if (typeof input !== "object") return input;
  if (Array.isArray(input)) return input.map(sanitizeInput);

  const sensitiveKeys = ["password", "confirmPassword", "token", "secret"];
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = sanitizeInput(value);
    }
  }
  return sanitized;
}

const loggingMiddleware = t.middleware(async (opts) => {
  const { path, type, next, getRawInput } = opts;
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;

  const logLevel = isDev ? "info" : "debug";

  // Only get raw input in dev mode for logging
  let inputData: unknown;
  if (isDev) {
    try {
      inputData = await getRawInput();
    } catch {
      // Input may not be available for some procedures
    }
  }

  const logData = {
    path,
    type,
    durationMs,
    ...(isDev && inputData ? { input: sanitizeInput(inputData) } : {}),
  };

  if (logLevel === "info") {
    console.log(`[tRPC] ${type} ${path} - ${durationMs}ms`, logData);
  }

  return result;
});

export const baseProcedure = t.procedure.use(loggingMiddleware);

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

/**
 * Rate-limited procedure for sensitive endpoints.
 * Uses user ID if authenticated, otherwise IP address.
 * Gracefully skips if Upstash env vars not configured.
 */
export const rateLimitedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (ratelimit) {
    const identifier = ctx.session?.user?.id ?? ctx.ip;
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please try again later.",
      });
    }
  }
  return next();
});
