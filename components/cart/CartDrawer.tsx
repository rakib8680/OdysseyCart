"use client";

import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ShoppingCart, ArrowRight, ShoppingBag, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { CartItem } from "./CartItem";
import { ShippingProgress, FREE_SHIPPING_THRESHOLD } from "./ShippingProgress";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    updateQuantity,
    removeItem,
    totalPrice,
    closeCart,
    busyItems,
  } = useCart();
  const router = useRouter();

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
            <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Your cart is lonely
                </h3>
                <p className="text-sm sm:text-base text-slate-500 max-w-[250px]">
                  Looks like you haven't added anything yet. Let's find some
                  favorites!
                </p>
              </div>
              <Link
                href="/items"
                onClick={closeCart}
                className="mt-4 px-6 py-3 sm:px-8 sm:py-3.5 bg-slate-900 text-white rounded-full text-sm sm:text-base font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20 flex items-center gap-2 group/btn"
              >
                Shop New Arrivals
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
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
                    isBusy={busyItems.has(item.productId)}
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
            {totalPrice >= FREE_SHIPPING_THRESHOLD && (
              <div className="flex justify-between items-center text-sm font-medium text-emerald-600 w-full -mt-1 sm:-mt-2">
                <span>Shipping</span>
                <span className="uppercase">Free</span>
              </div>
            )}
            <p className="text-[10px] sm:text-xs text-slate-500 text-center mt-1">
              Taxes and discounts calculated at checkout.
            </p>
            <button
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}
              className="w-full h-10 sm:h-12 bg-slate-900 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20 flex items-center justify-center gap-2 group/btn cursor-pointer"
            >
              Proceed to Checkout
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <div className="flex flex-col items-center gap-2 mt-1 sm:mt-2">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                  Secure Encrypted Checkout
                </span>
              </div>
              <button
                onClick={closeCart}
                className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors underline underline-offset-4 decoration-slate-200 hover:decoration-slate-400"
              >
                or Continue Shopping
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
