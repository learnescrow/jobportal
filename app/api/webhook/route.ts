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
    return new Response(`Webhook Signature Error: ${err.message}`, {
      status: 400,
    });
  }

  // 🔥 HANDLERS
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const userId = session.metadata?.userId;
      const customer = session.customer;
      const subscription = session.subscription;

      if (userId) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wp-json/ukjobs/v1/update-stripe`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              stripe_customer_id: customer,
              stripe_subscription_id: subscription,
            }),
          }
        );
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const sub = event.data.object;

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wp-json/ukjobs/v1/update-subscription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stripe_customer_id: sub.customer,
            stripe_subscription_id: sub.id,
            status: sub.status,
          }),
        }
      );

      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wp-json/ukjobs/v1/cancel-subscription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stripe_customer_id: sub.customer,
          }),
        }
      );

      break;
    }

    default:
      console.log("Unhandled event:", event.type);
  }

  return NextResponse.json({ received: true });
}
