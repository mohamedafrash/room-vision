"use client";

import { PLANS, PlanId } from "@/lib/stripe";

interface SubscriptionBadgeProps {
  planId: PlanId;
  onClick?: () => void;
  as?: "button" | "span";
}

export function SubscriptionBadge({
  planId,
  onClick,
  as,
}: SubscriptionBadgeProps) {
  const plan = PLANS[planId];
  const element = as ?? (onClick ? "button" : "span");

  const colorClasses: Record<PlanId, string> = {
    free: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    pro: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    unlimited:
      "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30",
  };

  if (element === "span") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${colorClasses[planId]}`}
      >
        {planId === "unlimited" && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {plan.name}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-all hover:scale-105 ${colorClasses[planId]}`}
    >
      {planId === "unlimited" && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {plan.name}
    </button>
  );
}
