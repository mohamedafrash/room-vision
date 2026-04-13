import { Metadata } from "next";
import { PricingCards } from "@/components/PricingCards";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PlanId } from "@/lib/stripe";
import Link from "next/link";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import { RoomVisionLogo } from "@/components/brand/RoomVisionLogo";

export const metadata: Metadata = {
  title: "Pricing | Room Vision",
  description: "Upgrade your Room Vision plan for more AI generations",
};

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_id, status")
    .eq("user_id", user.id)
    .single();

  const currentPlanId = (subscription?.plan_id || "free") as PlanId;
  const hasActiveSubscription =
    subscription?.status === "active" || subscription?.status === "trialing";

  return (
    <div className="app-shell min-h-screen">
      <div className="glow-orb orb-left" />
      <div className="glow-orb orb-right" />
      <div className="noise-layer" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex items-center justify-between gap-4">
          <RoomVisionLogo />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--rv-text-muted)] transition-colors hover:text-[var(--rv-primary)]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Studio
          </Link>
        </div>

        <div className="mb-12 text-center">
          <p className="rv-kicker mb-4">Pricing</p>
          <h1 className="mb-4 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.04em] text-[var(--rv-text)] sm:text-5xl">
            {hasActiveSubscription
              ? "Manage Your Plan"
              : "Upgrade Your Creative Power"}
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--rv-text-muted)]">
            {hasActiveSubscription
              ? `You're on the ${currentPlanId.charAt(0).toUpperCase() + currentPlanId.slice(1)} plan. Manage your subscription below.`
              : "Transform more rooms with higher generation limits. Choose the plan that fits your design needs."}
          </p>
        </div>

        <PricingCards
          currentPlanId={currentPlanId}
          hasActiveSubscription={hasActiveSubscription}
        />

        {hasActiveSubscription && currentPlanId !== "free" && (
          <div className="mt-12 text-center">
            <div className="inline-block rounded-[24px] bg-white/90 p-6 shadow-[0_24px_48px_rgba(25,28,29,0.05)]">
              <p className="mb-4 text-sm text-[var(--rv-text-muted)]">
                Need to make changes to your subscription?
              </p>
              <CancelSubscriptionButton />
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-sm text-[var(--rv-text-soft)]">
            All plans include access to our premium AI models. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
