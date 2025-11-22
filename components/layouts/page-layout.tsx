"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import { useUser } from "@clerk/nextjs";

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
  

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !isLoaded) return;

    if (isSignedIn && isAuthPage) {
      router.replace("/dashboard");
      return;
    }

   
  }, [hydrated, isLoaded, isSignedIn, isAuthPage, router]);

  if (!hydrated) return null;

  if (isAuthPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
