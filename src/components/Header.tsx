"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./Button";
import { SubscriptionBadge } from "./SubscriptionBadge";
import { PlanId } from "@/lib/stripe";

interface HeaderProps {
  onToggleHistory: () => void;
  isHistoryVisible: boolean;
  planId?: PlanId;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleHistory,
  isHistoryVisible,
  planId = "free",
  onLogout,
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 11l8-7 8 7v9a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4H9v4a2 2 0 01-2 2H3a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            RoomVision
          </p>
          <h1 className="text-lg font-semibold text-white">
            Interior AI Studio
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/pricing">
          <SubscriptionBadge planId={planId} />
        </Link>
        <Button variant="ghost" onClick={onToggleHistory}>
          {isHistoryVisible ? "Hide archive" : "Show archive"}
        </Button>
        {planId === "free" && (
          <Link href="/pricing">
            <Button variant="primary">Upgrade</Button>
          </Link>
        )}
        {onLogout && (
          <Button variant="ghost" onClick={onLogout}>
            Sign out
          </Button>
        )}
      </div>
    </header>
  );
};
