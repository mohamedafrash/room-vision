"use client";

import { useState } from "react";

export function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleManageBilling}
      disabled={loading}
      className="cursor-pointer rounded-2xl bg-[var(--rv-surface-low)] px-6 py-3 text-sm font-medium text-[var(--rv-text-muted)] transition-all hover:bg-[var(--rv-surface-high)] hover:text-[var(--rv-text)] disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center gap-2">
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
          Opening...
        </span>
      ) : (
        "Cancel or Change Plan"
      )}
    </button>
  );
}
