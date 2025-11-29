import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  // ⛔ Not logged in → user is not paid
  if (!userId) {
    return NextResponse.json({ paid: false });
  }

  console.log("🔍 Checking subscription for user:", userId);

  // CALL WORDPRESS SUBSCRIPTION API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APISTRIPE_URL}/wp-json/jobportal/v1/subscription/${userId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    console.log("❌ WP returned error:", res.status);
    return NextResponse.json({ paid: false });
  }

  const data = await res.json();

  console.log("📦 Subscription response from WP:", data);

  // If WP says user does not exist → free user
  if (!data.exists || !data.subscription) {
    console.log("⚠️ No subscription found → paid = false");
    return NextResponse.json({ paid: false });
  }

  const sub = data.subscription;

  // ⚠️ WordPress table uses ENUM:
  // status: active | canceled | expired
  const isPaid = sub.status === "active";

  console.log("💳 Subscription status:", sub.status);
  console.log("💳 Paid:", isPaid);

  return NextResponse.json({
    paid: isPaid,
    plan: sub.plan_type,
    status: sub.status,
    current_period_end: sub.current_period_end,
  });
}
