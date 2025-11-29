//File :- app/api/stripe/subscription/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TEMPORARY — remove after webhook is implemented
  return NextResponse.json({
    plan: "Premium",
    interval: "monthly",
    status: "active",
  });
}
