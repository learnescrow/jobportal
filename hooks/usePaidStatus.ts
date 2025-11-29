"use client";

import { useEffect, useState } from "react";

interface PaidStatusResponse {
  paid: boolean;
  plan?: string;
  status?: string;
  current_period_end?: string;
}

export function usePaidStatus() {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/stripe/isPaid", {
          method: "GET",
          cache: "no-store",
        });

        const data: PaidStatusResponse = await res.json();

        setPaid(data.paid);
        setPlan(data.plan || null);
        setStatus(data.status || null);
      } catch (err) {
        console.error("❌ Failed to fetch paid status:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { paid, loading, plan, status };
}
