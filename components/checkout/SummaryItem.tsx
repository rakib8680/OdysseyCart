"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { CartItem } from "@/lib/types/cart";

/** Single item row in the summary list — with quantity badge overlay */
export function SummaryItem({ item }: { item: CartItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
      {/* Thumbnail with quantity badge */}
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
          {item.image && !imgError ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <ImageOff className="w-5 h-5 text-slate-300" />
          )}
        </div>
        {item.quantity > 1 && (
          <span className="absolute -top-1.5 -right-1.5 bg-slate-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {item.quantity}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">
          {item.title}
        </p>
        {/* Variant Option Badges */}
        {item.selectedOptions &&
          Object.keys(item.selectedOptions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {Object.entries(item.selectedOptions).map(([key, value]) => (
                <span
                  key={key}
                  className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          )}
        <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
      </div>

      {/* Line Price */}
      <p className="text-sm font-semibold text-slate-900 shrink-0">
        ${(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  );
}
