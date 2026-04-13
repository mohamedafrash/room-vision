"use client";

import { useState } from "react";
import { PLANS, PlanId } from "@/lib/stripe";
import { getStripe } from "@/lib/stripe-client";

interface PricingCardsProps {
  currentPlanId?: PlanId;
  hasActiveSubscription?: boolean;
}

const PRICING_DATA = [
  {
    id: "free" as const,
    name: "Free",
    price: "0",
    period: "month",
    description: "Perfect for trying out Room Vision",
    features: [
      "10 AI generations per month",
      "Basic room redesign",
      "Generation history",
    ],
    cta: "Current Plan",
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "9",
    period: "month",
    description: "For design enthusiasts who want more",
    features: [
      "100 AI generations per month",
      "Priority processing",
      "High-quality outputs",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "unlimited" as const,
    name: "Studio",
    price: "29",
    period: "month",
    description: "For professionals & agencies",
    features: [
      "500 AI generations per month",
      "Fastest processing",
      "Commercial license",
      "Priority support",
      "API access (coming soon)",
    ],
    cta: "Upgrade to Studio",
  },
];

export function PricingCards({
  currentPlanId = "free",
  hasActiveSubscription = false,
}: PricingCardsProps) {
  const [loading, setLoading] = useState<PlanId | null>(null);

  const handleUpgrade = async (planId: PlanId) => {
    if (planId === "free" || planId === currentPlanId) return;

    setLoading(planId);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const { url, error } = await response.json();

      if (error) {
        console.error("Checkout error:", error);
        return;
      }

      if (url) {
        const stripe = await getStripe();
        if (stripe) {
          window.location.href = url;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const { url, error } = await response.json();

      if (error) {
        console.error("Portal error:", error);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Portal error:", error);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-stretch gap-6 lg:flex-row">
      {PRICING_DATA.map((plan) => {
        const isCurrent = plan.id === currentPlanId;
        const isDowngrade =
          PLANS[plan.id].generationsPerMonth <
          PLANS[currentPlanId].generationsPerMonth;
        const isPopular = "popular" in plan && plan.popular;

        return (
          <div
            key={plan.id}
            className={`relative flex-1 rounded-[28px] transition-all duration-300 ${
              isCurrent
                ? "bg-[rgba(0,91,111,0.1)]"
                : isPopular
                  ? "bg-white"
                  : "bg-[var(--rv-surface-low)]"
            }`}
          >
            <div
              className={`h-full rounded-[28px] p-8 ${
                isCurrent
                  ? "bg-white shadow-[0_28px_60px_rgba(0,91,111,0.12)]"
                  : "bg-[rgba(255,255,255,0.9)] shadow-[0_20px_44px_rgba(25,28,29,0.05)]"
              }`}
            >
              {(isPopular || isCurrent) && (
                <div className="absolute -top-3 left-6">
                  <span
                    className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${
                      isCurrent
                        ? "bg-[var(--rv-primary)] text-white"
                        : "bg-[var(--rv-primary-soft)] text-[var(--rv-primary)]"
                    }`}
                  >
                    {isCurrent ? "Your Plan" : "Most Popular"}
                  </span>
                </div>
              )}

              <p className="mt-4 text-sm font-medium uppercase tracking-widest text-[var(--rv-text-soft)]">
                {plan.name}
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-sm text-[var(--rv-text-soft)]">$</span>
                <span className="font-[family-name:var(--font-display)] text-6xl font-extrabold tracking-[-0.05em] text-[var(--rv-text)]">
                  {plan.price}
                </span>
                <span className="ml-1 text-[var(--rv-text-soft)]">/ {plan.period}</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[var(--rv-text-muted)]">
                {plan.description}
              </p>

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--rv-primary-soft)]">
                      <svg
                        className="h-3 w-3 text-[var(--rv-primary)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-[var(--rv-text-muted)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  hasActiveSubscription && plan.id !== "free"
                    ? handleManageSubscription()
                    : handleUpgrade(plan.id)
                }
                disabled={
                  loading === plan.id || (plan.id === "free" && isCurrent)
                }
                className={`mt-10 w-full rounded-2xl px-6 py-4 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? plan.id === "free"
                      ? "bg-[var(--rv-surface-low)] text-[var(--rv-text-soft)] cursor-not-allowed"
                      : "bg-[var(--rv-surface-low)] text-[var(--rv-text)] hover:bg-[var(--rv-surface-high)]"
                    : hasActiveSubscription && plan.id !== "free"
                      ? "bg-[var(--rv-surface-low)] text-[var(--rv-text)] hover:bg-[var(--rv-surface-high)]"
                      : isDowngrade
                        ? "bg-[var(--rv-surface-low)] text-[var(--rv-text-muted)] hover:bg-[var(--rv-surface-high)]"
                        : "bg-gradient-to-br from-[var(--rv-primary)] to-[var(--rv-primary-strong)] text-white shadow-[0_18px_40px_rgba(0,91,111,0.24)] hover:scale-[0.99]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : isCurrent ? (
                  plan.id === "free" ? (
                    "Current Plan"
                  ) : (
                    "Manage Plan"
                  )
                ) : hasActiveSubscription && plan.id !== "free" ? (
                  "Manage Plan"
                ) : isDowngrade ? (
                  "Downgrade"
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
