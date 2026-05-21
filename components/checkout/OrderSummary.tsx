"use client";

import { OrderTotals } from "@/lib/utils/pricing";
import { CartItem } from "@/lib/types/cart";
import { ShippingProgress } from "@/components/cart/ShippingProgress";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { AcceptedPayments } from "@/components/ui/AcceptedPayments";
import { SummaryItem } from "./SummaryItem";
import { PriceLine } from "./PriceLine";
import { Truck, Tag, Loader2 } from "lucide-react";
import { useState } from "react";

// ==========================================
// TYPES
// ==========================================
interface OrderSummaryProps {
  items: CartItem[];
  totals: OrderTotals;
  couponCode?: string | null;
  onApplyCoupon?: (code: string) => Promise<void>;
  onRemoveCoupon?: () => void;
  isApplyingCoupon?: boolean;
}

// ==========================================
// ORDER SUMMARY SIDEBAR
// ==========================================
export function OrderSummary({
  items,
  totals,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon,
}: OrderSummaryProps) {
  const [couponInput, setCouponInput] = useState("");

  const handleApply = () => {
    if (!couponInput.trim() || !onApplyCoupon) return;
    onApplyCoupon(couponInput.trim());
  };

  const handleRemove = () => {
    if (onRemoveCoupon) {
      onRemoveCoupon();
      setCouponInput("");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Item List */}
      <div className="px-6 py-4 max-h-[320px] overflow-y-auto divide-y divide-slate-100">
        {items.map((item) => (
          <SummaryItem key={item.productId} item={item} />
        ))}
      </div>

      {/* Promo Code Input */}
      {onApplyCoupon && (
        <div className="px-6 py-4 border-t border-slate-100 bg-white">
          {couponCode ? (
            <div className="flex gap-2 items-center justify-between bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  {couponCode}
                </span>
              </div>
              <button
                onClick={handleRemove}
                className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                disabled={isApplyingCoupon}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
              />
              <button
                onClick={handleApply}
                disabled={!couponInput.trim() || isApplyingCoupon}
                className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[76px]"
              >
                {isApplyingCoupon ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Free Shipping Progress */}
      <ShippingProgress subtotal={totals.subtotal - totals.discount} />

      {/* Price Breakdown */}
      <div className="px-6 py-5 border-t border-slate-200 bg-slate-50 space-y-3">
        <PriceLine label="Subtotal" value={totals.subtotal} />

        {totals.discount > 0 && (
          <PriceLine
            label="Discount"
            value={-totals.discount}
            className="text-emerald-600"
            icon={<Tag className="w-3.5 h-3.5" />}
          />
        )}

        <PriceLine
          label="Shipping"
          value={totals.shippingCost}
          isFree={totals.shippingCost === 0}
          icon={<Truck className="w-3.5 h-3.5" />}
        />

        <PriceLine label="Tax (5%)" value={totals.tax} />

        {/* Total */}
        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-base font-bold text-slate-900">Total</span>
          <span className="text-xl font-bold text-slate-900">
            ${totals.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Accepted Payment Methods */}
      <AcceptedPayments />
    </div>
  );
}
