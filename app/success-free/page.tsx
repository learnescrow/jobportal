"use client";
import Link from "next/link";
export default function FreeSuccess() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold text-blue-600">
        Free Plan Activated 🎉
      </h1>
      <p className="mt-4 text-gray-700 mb-10">You are now using the free plan.</p>
      <Link
        href="/jobs"
        className="text-sm hover:underline hover:text-blue-600  hover:bg-blue-600 hover:text-white transition mt-6  rounded-full border-1 border-blue-600 py-6 px-12 ">
        back to jobs{" "}
      </Link>
    </div>
  );
}
