"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-2 border-gray-100 rounded-2xl  mb-4 overflow-hidden">
      {/* HEADER */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-lg">
        {title}
        <ChevronDown
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* CONTENT WITH ANIMATION */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}>
        <div className="p-4 border-t border-gray-100 bg-white text-gray-700">{children}</div>
      </div>
    </div>
  );
}
