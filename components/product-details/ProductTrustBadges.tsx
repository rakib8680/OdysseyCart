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
 * 4-Pillar trust and guarantee ribbon displayed directly in the conversion area
 * to eliminate buyer hesitation and elevate consumer confidence.
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
      description: shippingInfo || "On orders over $50",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Quick & easy exchanges",
    },
    {
      icon: ShieldCheck,
      title: warranty || "2-Year Warranty",
      description: "Full quality coverage",
    },
    {
      icon: Lock,
      title: "Secure Checkout",
      description: "256-bit SSL encryption",
    },
  ];

  return (
    <div
      role="region"
      aria-label="Trust and guarantee benefits"
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 sm:p-4 shadow-2xs",
        className,
      )}
    >
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/90 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-emerald-600 shadow-2xs shrink-0 group-hover:scale-105 group-hover:border-emerald-300 transition-all">
                <Icon className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight truncate mt-0.5">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
