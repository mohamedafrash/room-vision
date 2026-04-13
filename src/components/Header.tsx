"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./Button";
import { SubscriptionBadge } from "./SubscriptionBadge";
import { PlanId } from "@/lib/stripe";
import { RoomVisionLogo } from "@/components/brand/RoomVisionLogo";

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
    <header className="rv-frame rv-outline sticky top-4 z-20 flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-5">
      <div className="flex items-center gap-8">
        <RoomVisionLogo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--rv-text-muted)] md:flex">
          <span className="border-b-2 border-[var(--rv-primary)] pb-1 font-semibold text-[var(--rv-primary)]">
            Dashboard
          </span>
          <button
            type="button"
            onClick={onToggleHistory}
            className="transition hover:text-[var(--rv-primary)]"
          >
            {isHistoryVisible ? "Hide archive" : "Show archive"}
          </button>
          <Link href="/pricing" className="transition hover:text-[var(--rv-primary)]">
            Pricing
          </Link>
        </nav>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/pricing">
          <SubscriptionBadge planId={planId} as="span" />
        </Link>
        <Button variant="secondary" onClick={onToggleHistory} className="md:hidden">
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
