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

      const clerk_user_id = session.metadata?.userId;
      const customer = session.customer;
      const subscriptionId = session.subscription;

      const sub: any = await stripe.subscriptions.retrieve(subscriptionId);
      const plan = sub.items.data[0].plan;

      // PAYMENT = DONE ✔️
      if (clerk_user_id) {
        await fetch(
          `${process.env.NEXT_PUBLIC_APISTRIPE_URL}/wp-json/jobportal/v1/subscription`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clerk_user_id,
              email: session.customer_details?.email || "",
              name: session.customer_details?.name || "",

              // ⭐ THIS MEANS PAYMENT DONE
              plan_type: "premium",
              status: "active",

              stripe_customer_id: customer,
              stripe_subscription_id: subscriptionId,

              current_period_end: new Date(sub.current_period_end * 1000)
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),

              last_payment_at: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            }),
          }
        );
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
        current_period_end: new Date(sub.current_period_end * 1000)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
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
