//File :- app/api/stripe/isPaid/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ paid: false });
  }

  // TEMPORARY: Replace with real DB check later
  const user = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/wp-json/user/${userId}`
  ).then((r) => r.json());

  if (
    !user.stripe_subscription_status ||
    user.stripe_subscription_status !== "active"
  ) {
    return NextResponse.json({ paid: false });
  }

  return NextResponse.json({
    paid: true,
    plan: user.stripe_plan,
    status: user.stripe_subscription_status,
  });
}
