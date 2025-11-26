"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface PremiumPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function PremiumPopup({ open, onClose }: PremiumPopupProps) {
  if (!open) return null;

  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleGoPremium = () => {
    if (!isSignedIn) {
      router.push("/auth?redirect=/pricing");
      return;
    }

    router.push("/pricing");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL OUTER */}
      <div className="relative w-full max-w-md mx-4 rounded-3xl overflow-hidden shadow-2xl premium-fade">
        <div className="bg-gradient-to-b from-[#100e2e] via-[#17143b] to-[#0c0b23] p-8 w-full h-full">
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-gray-300 hover:text-white text-xl">
            ×
          </button>

          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="text-5xl mb-3">🔐</div>
            <h2 className="text-white text-3xl font-bold">Premium Job</h2>
            <p className="text-white/70 text-[15px] mt-2 leading-relaxed">
              Unlock apply button, company website link, and all premium job
              postings.
            </p>
          </div>

          {/* GLASS CARD */}
          <div className="mt-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl premium-card">
            {/* PRICE ROW */}
            <div className="flex items-end gap-4 mb-5">
              <div className="text-white text-5xl font-extrabold">$5</div>

              <div className="ml-auto text-right">
                <span className="text-white font-semibold text-sm">
                  per month
                </span>
                <br />
                <span className="text-white/50 text-xs">Cancel anytime</span>
              </div>
            </div>

            {/* CTA BUTTON */}
            <button
              onClick={handleGoPremium} // ✅ FIXED
              className="w-full py-4 rounded-full font-semibold text-lg 
                         bg-gradient-to-r from-[#6a5cff] to-[#4a3dff] 
                         hover:from-[#7b6cff] hover:to-[#584dff] 
                         text-white shadow-lg premium-btn relative overflow-hidden">
              <span className="relative z-10">Go Premium</span>
            </button>

            <p className="text-white/60 text-center text-xs mt-4">
              Instant access. Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        .premium-fade {
          animation: fadeUp 0.35s ease-out;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .premium-card {
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }

        .premium-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 220%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: skewX(-25deg);
          opacity: 0.4;
        }

        .premium-btn:hover::before {
          animation: shimmer 0.9s ease-in-out;
        }

        @keyframes shimmer {
          0% { left: -120%; }
          100% { left: 120%; }
        }
      `}</style>
    </div>
  );
}
