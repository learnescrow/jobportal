import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // no apiVersion

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers(); // FIXED
  const sig = headerList.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("Checkout completed:", session.id);
  }

  // Subscription updates
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object;

    console.log("Subscription updated:", subscription.id);
  }

  // Subscription cancelled
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;

    console.log("Subscription cancelled:", subscription.id);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
