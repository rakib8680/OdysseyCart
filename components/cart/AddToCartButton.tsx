"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Loader2, SlidersHorizontal } from "lucide-react";
import { Product, Variant } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/constants/images";

// ==========================================
// PROPS
// ==========================================
interface AddToCartButtonProps {
  product: Product;
  selectedVariant?: Variant | null;
  className?: string;
  compactText?: boolean; // When true, uses compact "Add" / "Select" labels on mobile screens
}

// ==========================================
// ADD TO CART BUTTON
// ==========================================
export function AddToCartButton({
  product,
  selectedVariant,
  className,
  compactText = false,
}: AddToCartButtonProps) {
  const { addItem, openCart, items, busyItems } = useCart();
  const router = useRouter();

  const hasVariants = product.variants && product.variants.length > 0;
  const needsVariantSelection = hasVariants && !selectedVariant;

  // Resolve price, stock, and image based on variant or base product
  const hasDiscount = product.discount > 0;
  const basePrice = selectedVariant?.price ?? product.price;
  const resolvedPrice = hasDiscount
    ? basePrice * (1 - product.discount / 100)
    : basePrice;
  const resolvedStock = selectedVariant?.stockQuantity ?? product.stockQuantity;
  const resolvedImage =
    selectedVariant?.imageIndex !== undefined
      ? product.images?.[selectedVariant.imageIndex] ||
        product.images?.[0] ||
        FALLBACK_PRODUCT_IMAGE
      : product.images?.[0] || FALLBACK_PRODUCT_IMAGE;

  // Cart deduplication: match by (productId + variantSku)
  const cartItem = items.find((item) =>
    selectedVariant
      ? item.productId === product._id &&
        item.variantSku === selectedVariant.sku
      : item.productId === product._id && !item.variantSku,
  );
  const currentQuantityInCart = cartItem?.quantity || 0;
  const isMaxLimitReached = currentQuantityInCart >= resolvedStock;
  const isBusy = busyItems.has(
    selectedVariant ? `${product._id}:${selectedVariant.sku}` : product._id,
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Redirect to detail page if variant selection is required
    if (needsVariantSelection) {
      router.push(`/items/${product.slug}`);
      return;
    }

    if (isMaxLimitReached || isBusy) return;

    addItem(
      {
        productId: product._id,
        variantSku: selectedVariant?.sku,
        selectedOptions: selectedVariant?.options,
        title: product.title,
        price: resolvedPrice,
        image: resolvedImage,
        stockQuantity: resolvedStock,
      },
      1,
    );
    openCart();
  };

  return (
    <button
      onClick={handleClick}
      disabled={
        isBusy ||
        (!needsVariantSelection && (resolvedStock === 0 || isMaxLimitReached))
      }
      className={cn(
        "bg-slate-900 text-white hover:bg-emerald-600 transition-colors flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-xs whitespace-nowrap",
        className,
      )}
    >
      {isBusy ? (
        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin shrink-0" />
      ) : needsVariantSelection ? (
        <>
          <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 shrink-0" />
          <span className="truncate">
            {compactText ? (
              <>
                <span className="sm:hidden">Select</span>
                <span className="hidden sm:inline">Select Options</span>
              </>
            ) : (
              "Select Options"
            )}
          </span>
        </>
      ) : resolvedStock === 0 ? (
        <span className="truncate">
          {compactText ? (
            <>
              <span className="sm:hidden">Sold Out</span>
              <span className="hidden sm:inline">Out of Stock</span>
            </>
          ) : (
            "Out of Stock"
          )}
        </span>
      ) : isMaxLimitReached ? (
        <span className="truncate text-[10px] sm:text-xs">
          {compactText ? (
            <>
              <span className="sm:hidden">Max Limit</span>
              <span className="hidden sm:inline">Max Limit in Cart</span>
            </>
          ) : (
            "Max Limit"
          )}
        </span>
      ) : (
        <>
          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 shrink-0 group-hover/btn:-translate-y-0.5 transition-transform" />
          <span className="truncate">
            {compactText ? (
              <>
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add to Cart</span>
              </>
            ) : (
              "Add to Cart"
            )}
          </span>
        </>
      )}
    </button>
  );
}
