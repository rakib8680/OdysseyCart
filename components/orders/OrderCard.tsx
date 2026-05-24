"use client";

import { useState } from "react";
import { type SerializedOrder } from "@/app/actions/order";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { ImageOff, ChevronRight } from "lucide-react";
import { formatOrderId } from "@/lib/utils";

// ==========================================
// CONSTANTS
// ==========================================

/** Max number of item thumbnails to show before "+X more" */
const MAX_THUMBNAILS = 3;

// ==========================================
// COMPONENT
// ==========================================

interface OrderCardProps {
  order: SerializedOrder;
  /** Called when the user clicks "View Details" */
  onViewDetails: (order: SerializedOrder) => void;
}

/**
 * Renders a compact, dashboard-optimized summary row for an order.
 * Adapts to a single horizontal line on larger screens, and a tight card on mobile.
 */
export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const shortId = formatOrderId(order._id);
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const extraItems = order.items.length - MAX_THUMBNAILS;

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      {/* Row 1/Col 1: ID, Date & Status (Status on right on mobile) */}
      <div className="flex items-center justify-between sm:justify-start gap-4 sm:min-w-[160px]">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-slate-900">{shortId}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>{orderDate}</span>
            <span className="hidden sm:inline">•</span>
            <span className="truncate max-w-[100px] hidden sm:inline">
              {order.shippingInfo.fullName}
            </span>
          </div>
        </div>
        <div className="sm:hidden">
          <OrderStatusBadge status={order.status} showIcon={false} />
        </div>
      </div>

      {/* Row 2/Col 2: Product Thumbnails & Item Count/Recipient */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex items-center -space-x-1 overflow-hidden">
          {order.items.slice(0, MAX_THUMBNAILS).map((item) => (
            <ItemThumbnail
              key={item.productId}
              image={item.image}
              title={item.title}
            />
          ))}
          {extraItems > 0 && (
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center relative z-10 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500">
                +{extraItems}
              </span>
            </div>
          )}
        </div>
        <span className="text-[11px] text-slate-500 ml-1 hidden md:inline">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
        <span className="text-[11px] text-slate-500 truncate max-w-[120px] sm:hidden">
          for {order.shippingInfo.fullName}
        </span>
      </div>

      {/* Col 3: Desktop Status Badge (hidden on mobile) */}
      <div className="hidden sm:flex items-center sm:justify-center min-w-[110px]">
        <OrderStatusBadge status={order.status} showIcon={false} />
      </div>

      {/* Row 3/Col 4 & 5: Price & Details button (aligned horizontally on mobile) */}
      <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
        <div className="sm:text-right sm:min-w-[90px]">
          <div className="flex items-baseline gap-1 sm:block">
            <span className="text-xs text-slate-400 sm:hidden">Total:</span>
            <span className="text-sm font-bold text-slate-900">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        <div>
          <button
            onClick={() => onViewDetails(order)}
            className="flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Details
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ITEM THUMBNAIL (Internal — avoids repeating img/fallback logic)
// ==========================================

/** Small product thumbnail with image fallback — used only within OrderCard */
function ItemThumbnail({ image, title }: { image: string; title: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200/60 shadow-xs relative z-0 flex-shrink-0">
      {image && !imgError ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <ImageOff className="w-3.5 h-3.5 text-slate-300" />
      )}
    </div>
  );
}
