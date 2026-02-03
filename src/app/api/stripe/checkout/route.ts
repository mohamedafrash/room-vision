import { NextResponse } from "next/server";
import { stripe, PLANS, PlanId } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

const getAppUrl = () => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set");
  }
  return appUrl;
};

export async function POST(request: Request) {
  try {
    const appUrl = getAppUrl();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = (await request.json()) as { planId: PlanId };
    const plan = PLANS[planId];

    if (!plan?.priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id, status, plan_id")
      .eq("user_id", user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;
    const existingSubscriptionId = subscription?.stripe_subscription_id;
    const existingStatus = subscription?.status;
    const activeStatuses = new Set([
      "active",
      "trialing",
      "past_due",
      "unpaid",
      "incomplete",
    ]);

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      // Create subscription record for the user
      await supabase.from("subscriptions").upsert(
        {
          user_id: user.id,
          stripe_customer_id: customerId,
          plan_id: "free",
          status: "incomplete",
        },
        { onConflict: "user_id" },
      );
    } else if (existingSubscriptionId && activeStatuses.has(existingStatus)) {
      // Avoid creating a second subscription; send user to billing portal instead.
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: appUrl,
      });
      return NextResponse.json({ url: portalSession.url });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${appUrl}/?success=true`,
      cancel_url: `${appUrl}/?canceled=true`,
      subscription_data: {
        metadata: { userId: user.id, planId },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
