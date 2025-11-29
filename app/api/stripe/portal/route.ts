//File :- app/api/stripe/portal/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customer = process.env.TEST_STRIPE_CUSTOMER_ID!; // FIX 🔥

  const portalSession = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
