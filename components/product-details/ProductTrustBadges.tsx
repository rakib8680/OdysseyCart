"use client";

import { Truck, RotateCcw, ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTrustBadgesProps {
  warranty?: string;
  shippingInfo?: string;
  className?: string;
}

/**
 * ProductTrustBadges Component (Apple Store Official PDP Style).
 * Clean, borderless vertical list with hairline dividers, circular monochrome icon badges,
 * and high-contrast editorial typography. Zero bulky boxes or card containers.
 */
export function ProductTrustBadges({
  warranty,
  shippingInfo,
  className,
}: ProductTrustBadgesProps) {
  const items = [
    {
      icon: Truck,
      title: "Free & Fast Delivery",
      description:
        shippingInfo || "Free standard shipping on all orders over $50.",
    },
    {
      icon: RotateCcw,
      title: "30-Day Hassle-Free Returns",
      description:
        "Return online or in-store within 30 days of delivery for a full refund.",
    },
    {
      icon: ShieldCheck,
      title: warranty || "2-Year Quality Warranty",
      description:
        "Comprehensive hardware coverage backed by dedicated priority support.",
    },
    {
      icon: Lock,
      title: "Secure & Encrypted Checkout",
      description:
        "Bank-grade 256-bit SSL encryption. We never store your payment credentials.",
    },
  ];

  return (
    <div
      role="region"
      aria-label="Delivery and purchase guarantees"
      className={cn(
        "pt-6 mt-6 border-t border-slate-200/80 divide-y divide-slate-100",
        className,
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0 group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
