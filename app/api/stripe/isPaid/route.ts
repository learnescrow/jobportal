import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  // NOT LOGGED IN → Not paid
  if (!userId) {
    return NextResponse.json({ paid: false });
  }

  console.log("🔍 Checking subscription for user:", userId);

  // CALL WORDPRESS
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APISTRIPE_URL}/wp-json/jobportal/v1/subscription/${userId}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  console.log("📦 Subscription response from WP:", data);

  // NO RECORD FOUND → Free plan
  if (!data.exists) {
    console.log("⚠️ No subscription found → paid = false");
    return NextResponse.json({ paid: false });
  }

  const sub = data.subscription;

  console.log("💳 Subscription Status:", sub.status);
  console.log("💳 Plan Type:", sub.plan_type);

  // ACTIVE → paid
  const isPaid = sub.status === "active";

  return NextResponse.json({
    paid: isPaid,
    plan: sub.plan_type,
    status: sub.status,
    current_period_end: sub.current_period_end,
  });
}
