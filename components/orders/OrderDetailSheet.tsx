"use client";

import type { SerializedOrder } from "@/lib/types/order";
import { type OrderStatus } from "@/lib/models/Order";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { SummaryItem } from "@/components/checkout/SummaryItem";
import { PriceLine } from "@/components/checkout/PriceLine";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  Tag,
  Check,
  Loader2,
} from "lucide-react";
import { formatOrderId } from "@/lib/utils";

// ==========================================
// FULFILLMENT TIMELINE CONFIG
// ==========================================

/** The linear fulfillment steps shown on the visual tracker */
const TIMELINE_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "paid", label: "Order Placed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

/**
 * Returns the index of the current step in the timeline.
 * -1 means the order hasn't reached the fulfillment flow yet (failed/pending).
 */
function getTimelineIndex(status: OrderStatus): number {
  return TIMELINE_STEPS.findIndex((step) => step.key === status);
}

// ==========================================
// COMPONENT
// ==========================================

interface OrderDetailSheetProps {
  order: SerializedOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus?: (
    orderId: string,
    nextStatus: "shipped" | "delivered",
    expectedUpdatedAt: string,
  ) => Promise<void>;
  isUpdatingStatus?: boolean;
}

/**
 * Sliding detail drawer for viewing a single order.
 * Reuses SummaryItem and PriceLine from checkout (DRY).
 * Shared across user account and admin dashboards.
 */
export function OrderDetailSheet({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
  isUpdatingStatus,
}: OrderDetailSheetProps) {
  if (!order) return null;

  const shortId = formatOrderId(order._id);
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const activeIndex = getTimelineIndex(order.status);
  const isFailed = order.status === "failed";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:!max-w-xl overflow-y-auto md:p-5 "
      >
        {/* Header */}
        <SheetHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between pr-8">
            <SheetTitle className="text-lg font-bold text-slate-900">
              {shortId}
            </SheetTitle>
            <OrderStatusBadge status={order.status} />
          </div>
          <SheetDescription className="text-xs text-slate-500">
            Placed on {orderDate}
          </SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="px-4 pb-6 space-y-6">
          {/* ─── Fulfillment Timeline ─── */}
          {!isFailed && (
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Order Progress
              </h3>
              <div className="flex items-center gap-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const isComplete = activeIndex >= i;
                  const isCurrent = activeIndex === i;

                  return (
                    <div key={step.key} className="flex items-center flex-1">
                      {/* Step dot */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                            isComplete
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-slate-200 text-slate-400"
                          } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}
                        >
                          {isComplete ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                        </div>
                        <span
                          className={`text-[11px] font-medium text-center leading-tight ${
                            isComplete ? "text-emerald-700" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>

                      {/* Connector line (not after last step) */}
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1 rounded-full ${
                            activeIndex > i ? "bg-emerald-400" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── Items ─── */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Items ({order.items.length})
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 divide-y divide-slate-100">
              {order.items.map((item) => (
                <SummaryItem key={item.productId} item={item} />
              ))}
            </div>
          </section>

          {/* ─── Shipping Address ─── */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Shipping Address
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-700">
                  <p className="font-medium">{order.shippingInfo.fullName}</p>
                  <p>{order.shippingInfo.address}</p>
                  <p>
                    {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                    {order.shippingInfo.zipCode}
                  </p>
                  <p>{order.shippingInfo.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-700">
                  {order.shippingInfo.phone}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-700">
                  {order.shippingInfo.email}
                </span>
              </div>
            </div>
          </section>

          {/* ─── Payment Summary (reuses PriceLine) ─── */}
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Payment Summary
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <PriceLine label="Subtotal" value={order.subtotal} />

              {order.discount > 0 && (
                <PriceLine
                  label="Discount"
                  value={-order.discount}
                  className="text-emerald-600"
                  icon={<Tag className="w-3.5 h-3.5" />}
                />
              )}

              <PriceLine
                label="Shipping"
                value={order.shippingCost}
                isFree={order.shippingCost === 0}
                icon={<Truck className="w-3.5 h-3.5" />}
              />

              <PriceLine label="Tax (5%)" value={order.tax} />

              {/* Total */}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">
                  Total
                </span>
                <span className="text-lg font-bold text-slate-900">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              {/* Coupon badge */}
              {order.couponCode && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">
                    Coupon: {order.couponCode}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* ─── Transaction Reference ─── */}
          {order.stripePaymentId && (
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Transaction
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-500 font-mono truncate">
                  {order.stripePaymentId}
                </span>
              </div>
            </section>
          )}

          {/* ─── Admin Fulfillment Action ─── */}
          {onUpdateStatus &&
            (order.status === "paid" || order.status === "shipped") && (
              <section className="pt-4 border-t border-slate-100 mt-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Fulfillment Action
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Move this order to the next step of the pipeline.
                    </p>
                  </div>
                  {order.status === "paid" && (
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() => onUpdateStatus(order._id, "shipped", order.updatedAt)}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 text-xs font-semibold disabled:opacity-50 transition-colors"
                    >
                      {isUpdatingStatus && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      Mark as Shipped
                    </button>
                  )}
                  {order.status === "shipped" && (
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() => onUpdateStatus(order._id, "delivered", order.updatedAt)}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-xs font-semibold disabled:opacity-50 transition-colors"
                    >
                      {isUpdatingStatus && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </section>
            )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
