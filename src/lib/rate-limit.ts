import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { PLANS, PlanId } from "./stripe";

let redisClient: Redis | null = null;
let rateLimiters: Record<PlanId, Ratelimit | null> | null = null;

const getRedisClient = () => {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set",
    );
  }

  redisClient = new Redis({ url, token });
  return redisClient;
};

const getRateLimiters = () => {
  if (rateLimiters) return rateLimiters;

  const redis = getRedisClient();
  rateLimiters = {
    free: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PLANS.free.generationsPerDay, "24 h"),
      analytics: true,
      prefix: "ratelimit:free",
    }),
    pro: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(PLANS.pro.generationsPerDay, "24 h"),
      analytics: true,
      prefix: "ratelimit:pro",
    }),
    unlimited: null, // No rate limit for unlimited tier
  };
  return rateLimiters;
};

export async function checkRateLimit(
  identifier: string,
  planId: PlanId = "free",
) {
  const limiter = getRateLimiters()[planId];

  // Unlimited plan - no rate limiting
  if (!limiter) {
    return { success: true, limit: Infinity, reset: 0, remaining: Infinity };
  }

  const { success, limit, reset, remaining } = await limiter.limit(identifier);
  return { success, limit, reset, remaining };
}
