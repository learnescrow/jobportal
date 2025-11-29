import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ paid: false });
  }

  console.log("🔍 Checking subscription for user:", userId);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APISTRIPE_URL}/wp-json/jobportal/v1/subscription/${userId}`,
    { cache: "no-store" }
  );

  // Log response status
  console.log("🌐 WP API Status:", res.status);

  // ❗ You must parse JSON BEFORE logging the content
  let data;
  try {
    data = await res.json();
    console.log("📦 WP Subscription JSON:", data);
  } catch (err) {
    console.log("❌ Failed to parse JSON:", err);
    return NextResponse.json({ paid: false });
  }

  // If no subscription record → free
  if (!data.exists || !data.subscription) {
    console.log("⚠️ User has NO subscription in DB");
    return NextResponse.json({ paid: false });
  }

  const sub = data.subscription;

  console.log("💳 Subscription Status:", sub.status);
  console.log("💳 Plan Type:", sub.plan_type);
  console.log("💳 Current Period End:", sub.current_period_end);

  const isPaid = sub.status === "active";

  return NextResponse.json({
    paid: isPaid,
    plan: sub.plan_type,
    status: sub.status,
    current_period_end: sub.current_period_end,
  });
}
