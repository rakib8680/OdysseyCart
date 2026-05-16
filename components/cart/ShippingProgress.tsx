"use client";

import { Truck, PartyPopper } from "lucide-react";
import { SHIPPING_THRESHOLD } from "@/lib/utils/pricing";

// Re-export for backward compatibility (CartDrawer imports this)
export const FREE_SHIPPING_THRESHOLD = SHIPPING_THRESHOLD;

interface ShippingProgressProps {
  subtotal: number;
}

export function ShippingProgress({ subtotal }: ShippingProgressProps) {
  const amountLeft = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const percentage = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const isUnlocked = amountLeft === 0;

  return (
    <div
      className={`rounded-lg sm:rounded-xl p-2.5 sm:p-4 border transition-colors duration-300 ${
        isUnlocked
          ? "bg-emerald-50 border-emerald-200"
          : "bg-slate-50 border-slate-100"
      }`}
    >
      {/* Text */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        {isUnlocked ? (
          <>
            <PartyPopper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-700">
              You've unlocked <span className="uppercase">free shipping!</span>
            </p>
          </>
        ) : (
          <>
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
            <p className="text-xs sm:text-sm text-slate-600">
              <span className="font-bold text-slate-900">
                ${amountLeft.toFixed(2)}
              </span>{" "}
              away from free shipping
            </p>
          </>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isUnlocked
              ? "bg-emerald-500"
              : "bg-gradient-to-r from-slate-400 to-emerald-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Scale markers */}
      <div className="flex justify-between mt-1 sm:mt-1.5">
        <span className="text-[9px] sm:text-[10px] text-slate-400">$0</span>
        <span className="text-[9px] sm:text-[10px] text-slate-400">
          ${FREE_SHIPPING_THRESHOLD}
        </span>
      </div>
    </div>
  );
}
