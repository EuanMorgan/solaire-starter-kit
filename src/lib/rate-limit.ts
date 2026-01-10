import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/env";

/**
 * Rate limiting with Upstash Redis.
 * Returns null if env vars not configured (graceful skip).
 * Uses sliding window: 10 requests per 10 seconds.
 */
export const ratelimit =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        prefix: "@solaire/ratelimit",
      })
    : null;
