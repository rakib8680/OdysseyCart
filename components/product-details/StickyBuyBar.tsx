"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product, Variant } from "@/lib/types/product";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { HeartButton } from "@/components/wishlist/HeartButton";
import { useWishlistIds } from "@/hooks/useWishlistIds";
import { useProductInventory } from "@/hooks/cart/useProductInventory";
import { cn } from "@/lib/utils";

interface StickyBuyBarProps {
  product: Product;
  selectedVariant?: Variant | null;
  visible: boolean;
  quantity?: number;
  className?: string;
}

/**
 * StickyBuyBar Component.
 * Floating purchase bar pinned to the bottom of the viewport when the primary buy box
 * is scrolled out of view. Reuses the SSOT inventory hook for live stock, price, and cart sync.
 */
export function StickyBuyBar({
  product,
  selectedVariant,
  visible,
  quantity = 1,
  className,
}: StickyBuyBarProps) {
  const wishlistIds = useWishlistIds();
  const inventory = useProductInventory(product, selectedVariant);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="complementary"
          aria-label="Quick purchase bar"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-2xl pb-safe",
            className,
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
            {/* Left: Thumbnail & Title Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden bg-slate-50 border border-slate-200/80 shrink-0 flex items-center justify-center">
                <img
                  src={inventory.resolvedImage}
                  alt={product.title}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>

              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-snug">
                  {product.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 truncate leading-snug mt-0.5">
                  {selectedVariant ? (
                    <span className="font-medium text-emerald-700">
                      {selectedVariant.title}
                    </span>
                  ) : (
                    <span>
                      {product.brand ? `${product.brand} · ` : ""}
                      {product.category}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Middle: Live Price & Stock Urgency (Desktop / Tablet) */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-extrabold text-slate-900">
                    ${inventory.unitPrice.toFixed(2)}
                  </span>
                  {inventory.hasDiscount && (
                    <span className="text-xs text-slate-400 line-through font-medium">
                      ${inventory.basePrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock status pill */}
              {inventory.isOutOfStock ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                  Out of Stock
                </span>
              ) : inventory.isMaxInCart ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  All in Cart ({inventory.inCart})
                </span>
              ) : inventory.totalStock <= 5 ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  Only {inventory.totalStock} Left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  In Stock
                </span>
              )}
            </div>

            {/* Right: Actions (Add to Cart + Wishlist) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile Price Display */}
              <div className="md:hidden text-right mr-1">
                <span className="text-sm font-bold text-slate-900 block leading-tight">
                  ${inventory.unitPrice.toFixed(2)}
                </span>
              </div>

              <AddToCartButton
                product={product}
                selectedVariant={selectedVariant}
                quantity={quantity}
                compactText={true}
                className="h-10 sm:h-11 px-4 sm:px-6 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-emerald-600/20"
              />

              <div className="hidden sm:inline-flex">
                <HeartButton
                  productId={product._id}
                  initialWishlisted={wishlistIds.includes(product._id)}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
