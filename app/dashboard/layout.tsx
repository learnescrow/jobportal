import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session.userId) redirect("/auth");

  return (
    <section className="mb-10">
      

      <main className="">{children}</main>
    </section>
  );
}
