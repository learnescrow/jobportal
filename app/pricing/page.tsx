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
        {/* ⭐ PART-TIME PLAN — £5 */}
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={fadeUp.transition}
          className="backdrop-blur-xl bg-white border border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-black mb-4">
            Part-Time Plan
          </h2>
          <p className="text-gray-700 text-sm mb-6">
            Boost your hiring for flexible roles without breaking the budget.
          </p>
          <p className="text-4xl font-bold text-blue-700 mb-6">£5 / month</p>

          <ul className="space-y-3 text-black text-sm">
            <li className="leading-[25px]">
              • Highlight your part-time vacancies to local talent
            </li>
            <li className="leading-[25px]">
              • Live 30-day listing included every month
            </li>
            <li className="leading-[25px]">
              • Perfect for small businesses or seasonal staffing
            </li>
            <li className="leading-[25px]">
              • Designed to fill roles quickly and efficiently
            </li>
          </ul>

          <div className="mt-8">
            <PaymentButton
              plan="price_1SXRE0JH3syQM9G6FZpngfhT"
              label="Subscribe £5"
            />
          </div>
        </motion.div>

        {/* 🚀 FULL-TIME PLAN — £15 */}
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white border border-purple-400 rounded-3xl p-8 shadow-2xl scale-105">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Full-Time Plan
          </h2>

          <p className="text-gray-700 text-sm mb-6">
            Secure top UK talent for long-term success.
          </p>

          <p className="text-4xl font-bold text-blue mb-2">£15 / month</p>

          <ul className="space-y-3 text-gray-700 text-sm">
            <li className="leading-[25px]">
              • 30-day featured listing renewed every month
            </li>
            <li className="leading-[25px]">
              • Increased visibility across search results
            </li>
            <li className="leading-[25px]">
              • Ideal for building strong and committed teams
            </li>
            <li className="leading-[25px]">
              • Attract experienced professionals ready to grow with you
            </li>
          </ul>

          <div className="mt-8">
            <PaymentButton
              label="Subscribe £15"
              plan="price_1SZ53vJH3syQM9G6bI4y6wPo"
            />
          </div>
        </motion.div>

        {/* 🌍 SPONSORSHIP PLAN — £25 */}
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white border border-gray-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Sponsorship Plan
          </h2>
          <p className="text-gray-700 text-sm mb-6">
            Hire globally and expand your talent reach.
          </p>

          <p className="text-4xl font-bold text-blue mb-2">£25 / month</p>

          <ul className="space-y-3 text-gray-700 text-sm">
            <li className="leading-[25px]">
              • Premium 30-day listing with sponsorship highlight
            </li>
            <li className="leading-[25px]">
              • Tailored visibility for skilled international applicants
            </li>
            <li className="leading-[25px]">
              • Perfect for specialist and high-demand roles
            </li>
            <li className="leading-[25px]">
              • Helps fill vacancies that require advanced qualifications
            </li>
          </ul>

          <div className="mt-8">
            <PaymentButton
              plan="price_1SZ54lJH3syQM9G6330cKyGE"
              label="Subscribe £25"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
