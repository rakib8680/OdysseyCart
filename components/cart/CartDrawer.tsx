"use client";

import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    closeCart,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg bg-white overflow-hidden p-0">
        {/* Header */}
        <SheetHeader className="px-3 py-3 sm:px-6 sm:py-6 border-b border-slate-100 flex-shrink-0 bg-white">
          <SheetTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-2xl font-bold">
            <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6" />
            Your Cart
            {items.length > 0 && (
              <span className="text-xs sm:text-sm font-normal text-slate-400">
                ({items.length})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-2 py-3 sm:p-6 flex flex-col gap-2 sm:gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-slate-200" />
              <p className="text-sm sm:text-lg font-medium">Your cart is empty.</p>
              <button
                onClick={closeCart}
                className="px-4 py-2 sm:px-6 bg-emerald-50 text-emerald-600 rounded-full text-sm sm:text-base font-semibold hover:bg-emerald-100 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-slate-100 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm group"
              >
                {/* Top row: Thumbnail + Info + Delete */}
                <div className="flex gap-2 sm:gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 sm:w-20 sm:h-20 bg-slate-50 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-base text-slate-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="font-bold text-emerald-600 mt-0.5 sm:mt-1 text-xs sm:text-base">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1 sm:p-1.5 text-slate-300 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Bottom row: Quantity controls + Line total */}
                <div className="flex items-center justify-between mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-slate-50">
                  <div className="flex items-center bg-slate-50 rounded-md sm:rounded-lg p-0.5 sm:p-1 border border-slate-200">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-1 sm:p-1.5 hover:bg-white rounded transition-colors cursor-pointer text-slate-600"
                    >
                      <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-1 sm:p-1.5 hover:bg-white rounded transition-colors cursor-pointer text-slate-600"
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="px-3 py-3 sm:p-6 border-t border-slate-200 flex-shrink-0 bg-slate-50 flex flex-col gap-2 sm:gap-4">
            <div className="flex justify-between items-center text-sm sm:text-lg font-bold text-slate-900 w-full">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 text-center">
              Shipping, taxes, and discounts calculated at checkout.
            </p>
            <button
              onClick={() => {
                closeCart();
                // We'll wire up checkout later!
              }}
              className="w-full h-10 sm:h-12 bg-slate-900 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20 flex items-center justify-center gap-2 group/btn cursor-pointer"
            >
              Proceed to Checkout
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
