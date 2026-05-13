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
        <SheetHeader className="p-6 border-b border-slate-100 flex-shrink-0 bg-white">
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
            <ShoppingCart className="w-6 h-6" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <ShoppingCart className="w-16 h-16 text-slate-200" />
              <p className="text-lg font-medium">Your cart is empty.</p>
              <button
                onClick={closeCart}
                className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full font-semibold hover:bg-emerald-100 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 items-center bg-white border border-slate-100 p-4 rounded-2xl shadow-sm group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="font-semibold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="font-bold text-emerald-600 mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-1 hover:bg-white rounded-md transition-colors cursor-pointer text-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-1 hover:bg-white rounded-md transition-colors cursor-pointer text-slate-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="p-6 border-t border-slate-200 flex-shrink-0 bg-slate-50 flex flex-col gap-4">
            <div className="flex justify-between items-center text-lg font-bold text-slate-900 w-full px-2">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-500 text-center">
              Shipping, taxes, and discounts calculated at checkout.
            </p>
            <button
              onClick={() => {
                closeCart();
                // We'll wire up checkout later!
              }}
              className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20 flex items-center justify-center gap-2 group/btn"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
