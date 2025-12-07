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
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    /* --------------------------------------------
       1️⃣ FIRST PAYMENT SUCCESS
    -------------------------------------------- */
    case "checkout.session.completed": {
      const session: any = event.data.object;

      const userId = session.metadata?.userId;
      const customer = session.customer;
      const subscriptionId = session.subscription;

      if (!userId) {
        console.log("Missing userId in metadata");
        return NextResponse.json({ received: true });
      }

      // ⭐ FIX: Write metadata into the subscription
      await stripe.subscriptions.update(subscriptionId, {
        metadata: { userId },
      });

      // Retrieve updated subscription
      const sub: any = await stripe.subscriptions.retrieve(subscriptionId);

      await sendToWP({
        clerk_user_id: userId,
        email: session.customer_details?.email,
        name: session.customer_details?.name,
        plan_type: "monthly",
        stripe_customer_id: customer,
        stripe_subscription_id: subscriptionId,
        status: sub.status,
        current_period_end: sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : undefined,
        last_payment_at: new Date().toISOString(),
      });

      break;
    }

    /* --------------------------------------------
       2️⃣ SUBSCRIPTION UPDATED (renewal, payment succeeded)
    -------------------------------------------- */
    case "customer.subscription.updated": {
      const sub: any = event.data.object;

      const userId = sub.metadata?.userId;

      if (!userId) {
        console.log(" Missing userId in subscription.updated");
        break;
      }

      await sendToWP({
        clerk_user_id: userId,
        stripe_customer_id: sub.customer,
        stripe_subscription_id: sub.id,
        status: sub.status,
        current_period_end: new Date(
          sub.current_period_end * 1000
        ).toISOString(),
      });

      break;
    }

    /* --------------------------------------------
       3️⃣ SUBSCRIPTION CANCELED
    -------------------------------------------- */
    case "customer.subscription.deleted": {
      const sub: any = event.data.object;

      const userId = sub.metadata?.userId;

      if (!userId) {
        console.log(" Missing userId in subscription.deleted");
        break;
      }

      await sendToWP({
        clerk_user_id: userId,
        status: "canceled",
      });

      break;
    }

    /* --------------------------------------------
       4️⃣ SUBSCRIPTION CREATED (must sync metadata!)
    -------------------------------------------- */
    case "customer.subscription.created": {
      const sub: any = event.data.object;

      const userId = sub.metadata?.userId;

      if (userId) {
        await sendToWP({
          clerk_user_id: userId,
          stripe_customer_id: sub.customer,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_end: new Date(
            sub.current_period_end * 1000
          ).toISOString(),
        });
      } else {
        console.log("Missing userId in subscription.created");
      }

      break;
    }

    default:
      console.warn(event.type);
  }

  return NextResponse.json({ received: true });
}

/* ----------------------------------------------------
   Send to WP endpoint
------------------------------------------------------ */
async function sendToWP(body: any) {
  try {
    const cleanBody = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v !== undefined)
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APISTRIPE_URL}/wp-json/jobportal/v1/subscription`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanBody),
      }
    );
  } catch (err) {
    console.warn(err);
  }
}
