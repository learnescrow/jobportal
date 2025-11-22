"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "@/components/header";
import Footer from "@/components/Footer";   
import { useUser } from "@clerk/nextjs";
// your Zustand auth store

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { isSignedIn, isLoaded } = useUser();
  const [hydrated, setHydrated] = useState(false);

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboardPage = pathname.startsWith("/dashboard");

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Redirect logic
  useEffect(() => {
    if (!hydrated || isLoaded) return;

    // If logged in → keep them out of auth pages
    if (isSignedIn && isAuthPage) {
      router.replace("/dashboard");
      return;
    }

    // If NOT logged in → block dashboard
    if (!isSignedIn && isDashboardPage) {
      router.replace("/auth");
      return;
    }
  }, [hydrated, isLoaded, isSignedIn, pathname]);

  if (!hydrated) return null; // stop early hydration mismatches

  // 🔥 No header/footer on /auth
  if (isAuthPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // 🔥 Dashboard layout
  if (isDashboardPage) {
    return (
      <div className="">
        <main className="bg-white">{children}</main>
      </div>
    );
  }

  // 🔥 Normal pages (Header + Footer)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mt-16">{children}</main>
      <Footer />
    </div>
  );
}
