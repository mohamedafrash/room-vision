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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/10">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-amber-400"
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

          <h2 className="text-2xl font-bold text-white mb-2">
            You&apos;ve hit your daily limit!
          </h2>
          <p className="text-gray-400">
            Your {currentPlan.name} plan allows {currentPlan.generationsPerDay}{" "}
            generations per day.
          </p>
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-indigo-500/30">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-white">{upgradePlan.name}</h3>
              <p className="text-sm text-gray-400">
                {upgradePlan.generationsPerDay === Infinity
                  ? "Unlimited"
                  : upgradePlan.generationsPerDay}{" "}
                generations/day
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                ${upgradePlanId === "pro" ? "9" : "29"}
              </div>
              <div className="text-xs text-gray-400">/month</div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={loading !== null}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50"
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
              className="w-full py-3 px-4 bg-white/5 text-gray-400 font-medium rounded-xl hover:bg-white/10 transition-all"
            >
              Maybe later
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          Cancel anytime. Secure payment via Stripe.
        </p>
      </div>
    </div>
  );
}
