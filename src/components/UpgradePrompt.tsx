"use client";

import { useState } from "react";
import { PLANS, PlanId } from "@/lib/stripe";
import { getStripe } from "@/lib/stripe-client";

interface UpgradePromptProps {
  currentPlanId: PlanId;
  onClose?: () => void;
}

export function UpgradePrompt({ currentPlanId, onClose }: UpgradePromptProps) {
  const [loading, setLoading] = useState<PlanId | null>(null);

  const currentPlan = PLANS[currentPlanId];
  const upgradePlan = currentPlanId === "free" ? PLANS.pro : PLANS.unlimited;
  const upgradePlanId = currentPlanId === "free" ? "pro" : "unlimited";

  const handleUpgrade = async () => {
    setLoading(upgradePlanId as PlanId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: upgradePlanId }),
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

  if (currentPlanId === "unlimited") {
    return null; // No upgrade available
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(25,28,29,0.25)] p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-[0_32px_72px_rgba(25,28,29,0.12)]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(0,91,111,0.12)]">
            <svg
              className="h-8 w-8 text-[var(--rv-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <h2 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-extrabold text-[var(--rv-text)]">
            You&apos;ve hit your daily limit!
          </h2>
          <p className="text-[var(--rv-text-muted)]">
            Your {currentPlan.name} plan allows {currentPlan.generationsPerDay}{" "}
            generations per day.
          </p>
        </div>

        <div className="mt-6 rounded-[20px] bg-[var(--rv-surface-low)] p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-[var(--rv-text)]">{upgradePlan.name}</h3>
              <p className="text-sm text-[var(--rv-text-muted)]">
                {upgradePlan.generationsPerDay === Infinity
                  ? "Unlimited"
                  : upgradePlan.generationsPerDay}{" "}
                generations/day
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--rv-text)]">
                ${upgradePlanId === "pro" ? "9" : "29"}
              </div>
              <div className="text-xs text-[var(--rv-text-soft)]">/month</div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={loading !== null}
            className="w-full rounded-2xl bg-gradient-to-br from-[var(--rv-primary)] to-[var(--rv-primary-strong)] px-4 py-3 font-semibold text-white transition-all hover:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
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
            ) : (
              `Upgrade to ${upgradePlan.name}`
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="w-full rounded-2xl bg-[var(--rv-surface-low)] px-4 py-3 font-medium text-[var(--rv-text-muted)] transition-all hover:bg-[var(--rv-surface-high)]"
            >
              Maybe later
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-[var(--rv-text-soft)]">
          Cancel anytime. Secure payment via Stripe.
        </p>
      </div>
    </div>
  );
}
