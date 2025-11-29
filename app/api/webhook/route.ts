import Stripe from "stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err.message);
    return new Response(`Webhook Signature Error: ${err.message}`, {
      status: 400,
    });
  }

  // -------------------------------
  // 🔥 EVENT HANDLERS
  // -------------------------------
  switch (event.type) {
    /* ------------------------------------------------------------------
       1️⃣ USER CHECKOUT SUCCESS — FIRST PAYMENT
    ------------------------------------------------------------------ */
    case "checkout.session.completed": {
      const session: any = event.data.object;

      const userId = session.metadata?.userId;
      const customer = session.customer;
      const subscriptionId = session.subscription;

      // Fetch full subscription details
      const sub: any = await stripe.subscriptions.retrieve(subscriptionId);

      console.log("🔥 NEW PAYMENT COMPLETED BY USER");
      console.log("User:", userId);
      console.log("Customer:", customer);
      console.log("Status:", sub.status);
      console.log("Plan:", sub.items.data[0].plan.id);
      console.log("Interval:", sub.items.data[0].plan.interval);
      console.log("Amount:", sub.items.data[0].plan.amount);
      console.log("Current Period End:", sub.current_period_end);

      if (userId) {
        await sendToWP("/update-stripe", {
          userId,
          stripe_customer_id: customer,
          stripe_subscription_id: subscriptionId,
          stripe_plan: sub.items.data[0].plan.id,
          amount: sub.items.data[0].plan.amount,
          interval: sub.items.data[0].plan.interval,
          currency: sub.items.data[0].plan.currency,
          status: sub.status,
          current_period_end: sub.current_period_end,
        });
      }
      break;
    }

    /* ------------------------------------------------------------------
       2️⃣ RENEWED PAYMENT / UPGRADE / DOWNGRADE
    ------------------------------------------------------------------ */
    case "customer.subscription.updated": {
      const sub: any = event.data.object;

      console.log("🔄 SUBSCRIPTION UPDATED");
      console.log("Customer:", sub.customer);
      console.log("Status:", sub.status);

      await sendToWP("/update-subscription", {
        stripe_customer_id: sub.customer,
        stripe_subscription_id: sub.id,
        status: sub.status,
        interval: sub.items.data[0].plan.interval,
        amount: sub.items.data[0].plan.amount,
        current_period_end: sub.current_period_end,
      });

      break;
    }

    /* ------------------------------------------------------------------
       3️⃣ SUBSCRIPTION STARTED (edge case)
    ------------------------------------------------------------------ */
    case "customer.subscription.created": {
      const sub: any = event.data.object;

      console.log("✨ SUBSCRIPTION CREATED (Stripe)", sub.id);

      await sendToWP("/update-subscription", {
        stripe_customer_id: sub.customer,
        stripe_subscription_id: sub.id,
        status: sub.status,
        interval: sub.items.data[0].plan.interval,
        amount: sub.items.data[0].plan.amount,
        current_period_end: sub.current_period_end,
      });

      break;
    }

    /* ------------------------------------------------------------------
       4️⃣ SUBSCRIPTION CANCELED
    ------------------------------------------------------------------ */
    case "customer.subscription.deleted": {
      const sub: any = event.data.object;

      console.log("❌ SUBSCRIPTION CANCELED");

      await sendToWP("/cancel-subscription", {
        stripe_customer_id: sub.customer,
      });

      break;
    }

    /* ------------------------------------------------------------------
       ❓ UNHANDLED EVENTS
    ------------------------------------------------------------------ */
    default:
      console.log("⚠️ Unhandled event:", event.type);
  }

  return NextResponse.json({ received: true });
}

/* -------------------------------------------------------
   🛠 Helper: Safe request to WordPress (with logging)
--------------------------------------------------------- */
async function sendToWP(route: string, body: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wp-json/ukjobs/v1${route}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    console.log(`WP UPDATED (${route}) →`, res.status);
  } catch (err) {
    console.error("❌ Failed sending data to WP:", err);
  }
}
