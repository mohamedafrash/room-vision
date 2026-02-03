import { NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { createClient as createServerClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Use service role client for webhook (bypasses RLS)
const supabaseAdmin = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Subscription data is updated via subscription.created/updated events
        console.log(`Checkout completed: ${session.id}`);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionItem = subscription.items.data[0];
        const priceId = subscriptionItem?.price.id;

        // Find which plan matches this priceId
        const planEntry = Object.entries(PLANS).find(
          ([, plan]) => plan.priceId === priceId,
        );
        const planId = planEntry?.[0] || "free";

        // Get userId from subscription metadata
        const userId = subscription.metadata.userId;

        // Get period from subscription item (Stripe v20+ structure)
        const periodStart = subscriptionItem?.current_period_start;
        const periodEnd = subscriptionItem?.current_period_end;

        if (userId) {
          const { error: upsertError } = await supabaseAdmin
            .from("subscriptions")
            .upsert(
            {
              user_id: userId,
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              plan_id: planId,
              status: subscription.status,
              current_period_start: periodStart
                ? new Date(periodStart * 1000).toISOString()
                : null,
              current_period_end: periodEnd
                ? new Date(periodEnd * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );
          if (upsertError) {
            console.error(
              "Failed to upsert subscription from webhook:",
              upsertError,
              { subscriptionId: subscription.id },
            );
            throw upsertError;
          }
          console.log(
            `Subscription ${subscription.id} updated for user ${userId}: ${planId}`,
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Revert user to free tier when subscription is canceled
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            plan_id: "free",
            status: "canceled",
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Failed to update canceled subscription:", error);
        } else {
          console.log(`Subscription ${subscription.id} canceled`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(`Payment failed for invoice ${invoice.id}`);

        // Update subscription status to past_due
        // Get subscription ID from parent if available
        const subscriptionId =
          typeof invoice.parent?.subscription_details?.subscription === "string"
            ? invoice.parent.subscription_details.subscription
            : invoice.parent?.subscription_details?.subscription?.id;

        if (subscriptionId) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
