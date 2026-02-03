import { Metadata } from "next";
import { PricingCards } from "@/components/PricingCards";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PlanId } from "@/lib/stripe";
import Link from "next/link";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {hasActiveSubscription
              ? "Manage Your Plan"
              : "Upgrade Your Creative Power"}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
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
            <div className="inline-block p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-4">
                Need to make changes to your subscription?
              </p>
              <CancelSubscriptionButton />
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            All plans include access to our premium AI models. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
