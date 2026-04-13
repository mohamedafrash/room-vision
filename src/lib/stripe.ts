import Stripe from "stripe";

// Lazy initialization to avoid build-time errors when env vars aren't available
let stripeInstance: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Legacy export for backward compatibility
export const stripe = {
  get customers() {
    return getStripeServer().customers;
  },
  get checkout() {
    return getStripeServer().checkout;
  },
  get subscriptions() {
    return getStripeServer().subscriptions;
  },
  get billingPortal() {
    return getStripeServer().billingPortal;
  },
  get webhooks() {
    return getStripeServer().webhooks;
  },
};

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    generationsPerMonth: 10,
    priceId: null,
  },
  pro: {
    id: "pro",
    name: "Pro",
    generationsPerMonth: 100,
    priceId: process.env.STRIPE_PRO_PRICE_ID || null,
  },
  unlimited: {
    id: "unlimited",
    name: "Studio",
    generationsPerMonth: 500,
    priceId: process.env.STRIPE_UNLIMITED_PRICE_ID || null,
  },
} as const;

export type PlanId = keyof typeof PLANS;
