import Breadcrumb from "@/components/Breadcrumb";
import { auth } from "@clerk/nextjs/server";
export default async function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (userId) {
    console.log("🔍 User ID in Jobs Layout:", userId);
  }
  return (
    <section>
      <div className="max-w-6xl mx-auto py-6 px-4 md:px-0">
        <Breadcrumb />
      </div>
      {children}
    </section>
  );
}
