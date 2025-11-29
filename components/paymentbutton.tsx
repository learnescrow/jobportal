"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthPopup from "./auth-popup"; // 🔥 FIXED

interface Props {
  label: string;
  plan: string;
}

export default function PaymentButton({ label, plan }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handlePayment = async () => {
    if (plan === "free") {
      router.push("/success-free");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: plan }),
    });

    if (response.status === 401) {
      setShowPopup(true);
      setLoading(false);
      return;
    }

    const data = await response.json();
    if (data.url) window.location.href = data.url;

    setLoading(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-3 px-5 rounded-full bg-blue-600 text-white">
        {loading ? "Redirecting..." : label}
      </button>

      <AuthPopup open={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}
