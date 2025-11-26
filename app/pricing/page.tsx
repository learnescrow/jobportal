"use client";

import { motion } from "framer-motion";
import PaymentButton from "@/components/paymentbutton";
import { easeOut } from "motion";

export default function Pricing() {
  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: easeOut },
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 from-slate-900 to-slate-950 py-20 px-4 flex flex-col items-center">
      <motion.h1
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={fadeUp.transition}
        className="text-4xl md:text-5xl font-bold text-black mb-10 text-center">
        Choose Your Plan
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* FREE PLAN */}
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={fadeUp.transition}
          className="backdrop-blur-xl bg-white border border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-black mb-4">Free Plan</h2>
          <p className="text-gray-700 text-sm mb-6">Perfect for job seekers</p>
          <p className="text-4xl font-bold text-blue-700 mb-6">€0</p>

          <ul className="space-y-3 text-black text-sm">
            <li>• Immediate job updates (UK)</li>
            <li>• Immediate job updates (US)</li>
            <li>• Job alerts for other countries</li>
          </ul>

          <div className="mt-8">
            <PaymentButton plan="free" label="Start Free" />
          </div>
        </motion.div>

        {/* MONTHLY PLAN */}
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white border border-purple-400 rounded-3xl p-8 shadow-2xl scale-105">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Pro Monthly
          </h2>
          <p className="text-gray-700 text-sm mb-6">
            Best for active job hunters
          </p>

          <p className="text-4xl font-bold text-blue mb-2">€5</p>
          <p className="text-gray-700 mb-6">per month</p>

          <ul className="space-y-3 text-gray-700 text-sm">
            <li>• Referral part-time jobs (UK)</li>
            <li>• Job assistance</li>
            <li>• Consultancy via chat support</li>
            <li>• Priority job recommendations</li>
          </ul>

          <div className="mt-8">
            <PaymentButton
              label="Subscribe monthly"
              plan="price_1SXQgwJ6pHCh8WErE4m7R6Jh"
            />
          </div>
        </motion.div>

        {/* YEARLY PLAN */}
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white border border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Pro Yearly
          </h2>
          <p className="text-gray-700 text-sm mb-6">
            Save more with yearly billing
          </p>

          <p className="text-4xl font-bold text-blue mb-2">€55</p>
          <p className="text-gray-700 mb-6">11 months × €5 (1st month free)</p>

          <ul className="space-y-3 text-gray-700 text-sm">
            <li>• All monthly plan features</li>
            <li>• First month completely free</li>
            <li>• Exclusive career support</li>
            <li>• Free upgrade access to new features</li>
          </ul>

          <div className="mt-8">
            <PaymentButton
              plan="price_1SXn8hJ6pHCh8WErtERn6BCN"
              label="Subscribe Yearly"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
