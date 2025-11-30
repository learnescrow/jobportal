import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ paid: false });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APISTRIPE_URL;
  const url = `${baseUrl}/wp-json/jobportal/v1/subscription/${userId}`;

  const wp = await fetch(url);
  if (!wp.ok) return NextResponse.json({ paid: false });

  const data = await wp.json();
  return NextResponse.json({ paid: data.exists === true });
}
