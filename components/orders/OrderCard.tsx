"use client";

import { useState } from "react";
import { type SerializedOrder } from "@/app/actions/order";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { ImageOff, ChevronRight, Calendar } from "lucide-react";

// ==========================================
// CONSTANTS
// ==========================================

/** Max number of item thumbnails to show before "+X more" */
const MAX_THUMBNAILS = 4;

// ==========================================
// COMPONENT
// ==========================================

interface OrderCardProps {
  order: SerializedOrder;
  /** Called when the user clicks "View Details" */
  onViewDetails: (order: SerializedOrder) => void;
}

/**
 * Renders a summary card for a single order.
 * Shared across user order history and admin order management.
 * Displays: shortened ID, date, total, status badge, and item thumbnails.
 */
export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const shortId = `#OD-${order._id.slice(-6).toUpperCase()}`;
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const extraItems = order.items.length - MAX_THUMBNAILS;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors p-5">
      {/* Top Row — ID, Date, Status */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-bold text-slate-900">{shortId}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">{orderDate}</span>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Item Thumbnails */}
      <div className="flex items-center gap-2 mb-4">
        {order.items.slice(0, MAX_THUMBNAILS).map((item) => (
          <ItemThumbnail
            key={item.productId}
            image={item.image}
            title={item.title}
          />
        ))}
        {extraItems > 0 && (
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-500">
              +{extraItems}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Row — Total and Action */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-500">Total</span>
          <p className="text-lg font-bold text-slate-900">
            ${order.total.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => onViewDetails(order)}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
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
    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
      {image && !imgError ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <ImageOff className="w-4 h-4 text-slate-300" />
      )}
    </div>
  );
}
