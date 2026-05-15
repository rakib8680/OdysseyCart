"use client";

import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { CartItem } from "./CartItem";
import { ShippingProgress } from "./ShippingProgress";

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
        <div className="flex-1 overflow-y-auto px-2 py-3 sm:p-6 flex flex-col">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-slate-200" />
              <p className="text-sm sm:text-lg font-medium">
                Your cart is empty.
              </p>
              <button
                onClick={closeCart}
                className="px-4 py-2 sm:px-6 bg-emerald-50 text-emerald-600 rounded-full text-sm sm:text-base font-semibold hover:bg-emerald-100 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress */}
              <div className="mb-2 sm:mb-4">
                <ShippingProgress subtotal={totalPrice} />
              </div>

              {/* Cart Items */}
              <AnimatePresence>
                {items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    onNavigate={closeCart}
                  />
                ))}
              </AnimatePresence>
            </>
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
