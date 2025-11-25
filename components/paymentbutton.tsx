"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  label: string;
  plan: string; // Stripe price ID OR "free"
}

export default function PaymentButton({ label, plan }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (plan === "free") {
      router.push("/success-free");
      // TODO: Activate free plan for user (Clerk / DB)
      return;
    }

    setLoading(true);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: plan }),
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    }

    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-3 px-5 rounded-full bg-blue-600 text-white">
      {loading ? "Redirecting..." : label}
    </button>
  );
}
