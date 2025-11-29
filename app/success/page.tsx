"use client";
import Link from "next/link";
export default function SuccessPage() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      <p className="mt-4 text-gray-700 mb-16">Your subscription is active.</p>
      <Link
        href="/jobs"
        className="text-sm hover:underline hover:text-blue-600  hover:bg-blue-600 hover:text-white transition mt-6  rounded-full border-1 border-blue-600 py-6 px-12 mt-20">
        back to jobs{" "}
      </Link>
    </div>
  );
}
