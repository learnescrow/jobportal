"use client";

import React from "react";

interface Props {
  label: string;
  plan: string;
}

export default function PaymentButton({ label, plan }: Props) {
  return (
    <button
      type="button"
      className="
        w-full
        py-3
        px-5
        rounded-full
        bg-blue-600
        text-white
        font-semibold
        hover:bg-purple-700
        active:scale-95
        transition-all
        duration-200
        shadow-md
      "
      onClick={() => {
        console.log("Selected plan:", plan);
      }}>
      {label}
    </button>
  );
}
