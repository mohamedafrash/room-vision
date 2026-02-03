import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { PLANS, PlanId } from "./stripe";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create rate limiters for each subscription tier
const rateLimiters: Record<PlanId, Ratelimit | null> = {
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

export async function checkRateLimit(
  identifier: string,
  planId: PlanId = "free",
) {
  const limiter = rateLimiters[planId];

  // Unlimited plan - no rate limiting
  if (!limiter) {
    return { success: true, limit: Infinity, reset: 0, remaining: Infinity };
  }

  const { success, limit, reset, remaining } = await limiter.limit(identifier);
  return { success, limit, reset, remaining };
}
