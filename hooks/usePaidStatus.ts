"use client";

import { useEffect, useState } from "react";

export function usePaidStatus() {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      console.log("🔵 usePaidStatus() running...");

      try {
        const res = await fetch("/api/stripe/isPaid", { cache: "no-store" });
        console.log("🟣 isPaid API response:", res);

        const data = await res.json();
        console.log("🟢 isPaid JSON:", data);

        setPaid(data.paid);
      } catch (err) {
        console.error("❌ Failed to fetch paid status:", err);
      }

      setLoading(false);
    }

    load();
  }, []);

  return { paid, loading };
}
