export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session.userId) redirect("/dashboard");

  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
