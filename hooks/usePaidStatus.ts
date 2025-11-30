"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export function usePaidStatus() {
  const { user, isLoaded } = useUser();
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setPaid(false);
      setLoading(false);
      return;
    }

    async function load() {
      const res = await fetch("/api/stripe/isPaid");
      const data = await res.json();
      setPaid(data.paid);
      setLoading(false);
    }

    load();
  }, [isLoaded, user]);

  return { paid, loading };
}
