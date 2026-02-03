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
      "10 AI generations per day",
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
      "100 AI generations per day",
      "Priority processing",
      "High-quality outputs",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "unlimited" as const,
    name: "Unlimited",
    price: "29",
    period: "month",
    description: "For professionals & agencies",
    features: [
      "Unlimited generations",
      "Fastest processing",
      "Commercial license",
      "Priority support",
      "API access (coming soon)",
    ],
    cta: "Go Unlimited",
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
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-stretch">
      {PRICING_DATA.map((plan) => {
        const isCurrent = plan.id === currentPlanId;
        const isDowngrade =
          PLANS[plan.id].generationsPerDay <
          PLANS[currentPlanId].generationsPerDay;
        const isPopular = "popular" in plan && plan.popular;

        return (
          <div
            key={plan.id}
            className={`relative flex-1 rounded-3xl p-[1px] transition-all duration-300 ${
              isCurrent
                ? "bg-gradient-to-b from-[#E97B46] to-[#E97B46]/30"
                : isPopular
                  ? "bg-gradient-to-b from-white/30 to-white/5"
                  : "bg-white/10"
            }`}
          >
            <div
              className={`h-full rounded-3xl p-8 backdrop-blur-xl ${
                isCurrent ? "bg-[#1a1a2e]" : "bg-[#0d0d14]/90"
              }`}
            >
              {/* Badge */}
              {(isPopular || isCurrent) && (
                <div className="absolute -top-3 left-6">
                  <span
                    className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-full ${
                      isCurrent
                        ? "bg-[#E97B46] text-white"
                        : "bg-white/10 text-white/80 backdrop-blur-sm border border-white/20"
                    }`}
                  >
                    {isCurrent ? "Your Plan" : "Most Popular"}
                  </span>
                </div>
              )}

              {/* Plan name */}
              <p className="text-sm font-medium text-white/50 uppercase tracking-widest mt-4">
                {plan.name}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-sm text-white/60">$</span>
                <span className="text-6xl font-bold text-white tracking-tight">
                  {plan.price}
                </span>
                <span className="text-white/40 ml-1">/ {plan.period}</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-white/50 leading-relaxed">
                {plan.description}
              </p>

              {/* Divider */}
              <div className="my-8 h-px bg-white/10" />

              {/* Features */}
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E97B46]/20 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-[#E97B46]"
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
                    <span className="text-sm text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() =>
                  hasActiveSubscription && plan.id !== "free"
                    ? handleManageSubscription()
                    : handleUpgrade(plan.id)
                }
                disabled={
                  loading === plan.id || (plan.id === "free" && isCurrent)
                }
                className={`mt-10 w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? plan.id === "free"
                      ? "bg-white/5 text-white/30 cursor-not-allowed"
                      : "bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/10"
                    : hasActiveSubscription && plan.id !== "free"
                      ? "bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/10"
                      : isDowngrade
                        ? "bg-white/5 text-white/50 hover:bg-white/10 ring-1 ring-white/10"
                        : "bg-[#E97B46] text-white hover:bg-[#F08A59] shadow-lg shadow-[#E97B46]/20"
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
