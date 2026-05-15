"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/types/cart";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onNavigate: () => void;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onNavigate,
}: CartItemProps) {
  const productHref = `/items/${item.productId}`;

  return (
    <div className="bg-white border border-slate-100 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm group">
      {/* Top row: Thumbnail + Info + Delete */}
      <div className="flex gap-2 sm:gap-4 items-start">
        {/* Clickable Thumbnail */}
        <Link
          href={productHref}
          onClick={onNavigate}
          className="w-12 h-12 sm:w-20 sm:h-20 bg-slate-50 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-slate-100 hover:border-slate-300 transition-all hover:shadow-md"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-200 hover:scale-110"
          />
        </Link>

        {/* Details with clickable title */}
        <div className="flex-1 min-w-0">
          <Link
            href={productHref}
            onClick={onNavigate}
            className="block group/link"
          >
            <h4 className="font-semibold text-xs sm:text-base text-slate-900 line-clamp-2 leading-snug group-hover/link:text-emerald-600 transition-colors">
              {item.title}
            </h4>
          </Link>
          <p className="font-bold text-emerald-600 mt-0.5 sm:mt-1 text-xs sm:text-base">
            ${item.price.toFixed(2)}
          </p>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onRemove(item.productId)}
          className="p-1 sm:p-1.5 text-slate-300 hover:text-red-500 transition-colors cursor-pointer shrink-0"
          aria-label={`Remove ${item.title} from cart`}
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Bottom row: Quantity controls + Line total */}
      <div className="flex items-center justify-between mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-slate-50">
        <div className="flex items-center bg-slate-50 rounded-md sm:rounded-lg p-0.5 sm:p-1 border border-slate-200">
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            className="p-1 sm:p-1.5 hover:bg-white rounded transition-colors cursor-pointer text-slate-600"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
          <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold text-slate-900">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="p-1 sm:p-1.5 hover:bg-white rounded transition-colors cursor-pointer text-slate-600"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        <span className="text-xs sm:text-sm font-semibold text-slate-700">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
