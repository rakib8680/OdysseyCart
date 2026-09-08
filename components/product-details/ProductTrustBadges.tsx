"use client";

import { Truck, RotateCcw, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTrustBadgesProps {
  warranty?: string;
  shippingInfo?: string;
  className?: string;
}

/**
 * ProductTrustBadges Component.
 * 4-Pillar trust and guarantee ribbon formatted in an airy 2x2 grid
 * to guarantee zero text truncation, ample breathing room, and elevated brand trust.
 */
export function ProductTrustBadges({
  warranty,
  shippingInfo,
  className,
}: ProductTrustBadgesProps) {
  const badges = [
    {
      icon: Truck,
      title: shippingInfo ? "Fast Delivery" : "Free Delivery",
      description: shippingInfo || "Free shipping on orders over $50",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Quick & easy exchanges",
    },
    {
      icon: ShieldCheck,
      title: warranty || "2-Year Warranty",
      description: "Full manufacturer coverage",
    },
    {
      icon: Lock,
      title: "Secure Checkout",
      description: "256-bit SSL encrypted",
    },
  ];

  return (
    <div
      role="region"
      aria-label="Trust and guarantee benefits"
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-200/70",
        className,
      )}
    >
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-emerald-200/70 hover:shadow-xs transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-emerald-600 shadow-2xs shrink-0 group-hover:scale-105 group-hover:border-emerald-300 transition-all">
              <Icon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                {badge.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                {badge.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
