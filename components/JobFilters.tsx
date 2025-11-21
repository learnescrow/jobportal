"use client";

import { useState } from "react";

const jobTypes = [
  "Full Time",
  "Part Time",
  "Contract",
  "Temporary",
  "Internship",
];

export default function JobFilters({ activeType, onTypeChange }: any) {
  return (
    <div className="flex flex-wrap gap-3 mb-10 items-center">
      {/* Filter pills */}
      {jobTypes.map((type: string) => (
        <button
          key={type}
          onClick={() => onTypeChange(type === activeType ? "" : type)}
          className={`
            px-5 py-2 rounded-xl border transition
            ${
              activeType === type
                ? "bg-black text-white border-black"
                : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
            }
          `}>
          {type}
        </button>
      ))}

      {/* Clear Filter button - ONLY when filter active */}
      {activeType && (
        <button
          onClick={() => onTypeChange("")}
          className="px-5 py-2 rounded-xl border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700">
          Clear filter ✕
        </button>
      )}
    </div>
  );
}
