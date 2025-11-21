import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session.userId) redirect("/auth");

  return (
    <section className="flex h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <DashboardHeader />
        {children}
      </main>
    </section>
  );
}
