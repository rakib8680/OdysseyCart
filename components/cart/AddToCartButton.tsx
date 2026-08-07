"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Loader2, SlidersHorizontal } from "lucide-react";
import { Product, Variant } from "@/lib/types/product";
import { cn } from "@/lib/utils";

// ==========================================
// CONSTANTS
// ==========================================
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";

// ==========================================
// PROPS
// ==========================================
interface AddToCartButtonProps {
  product: Product;
  selectedVariant?: Variant | null; // Provided on detail page via ProductDetailClient
  className?: string;
}

// ==========================================
// ADD TO CART BUTTON
// ==========================================
export function AddToCartButton({
  product,
  selectedVariant,
  className,
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
  const resolvedStock =
    selectedVariant?.stockQuantity ?? product.stockQuantity;
  const resolvedImage =
    selectedVariant?.imageIndex !== undefined
      ? product.images?.[selectedVariant.imageIndex] ||
        product.images?.[0] ||
        FALLBACK_IMAGE
      : product.images?.[0] || FALLBACK_IMAGE;

  // Cart deduplication: match by (productId + variantSku)
  const cartItem = items.find((item) =>
    selectedVariant
      ? item.productId === product._id &&
        item.variantSku === selectedVariant.sku
      : item.productId === product._id && !item.variantSku,
  );
  const currentQuantityInCart = cartItem?.quantity || 0;
  const isMaxLimitReached = currentQuantityInCart >= resolvedStock;
  const isBusy = busyItems.has(product._id);

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
        (!needsVariantSelection &&
          (resolvedStock === 0 || isMaxLimitReached))
      }
      className={cn(
        "bg-slate-900 text-white hover:bg-emerald-600 transition-colors flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-sm",
        className,
      )}
    >
      {isBusy ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : needsVariantSelection ? (
        <>
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          Select Options
        </>
      ) : resolvedStock === 0 ? (
        "Out of Stock"
      ) : isMaxLimitReached ? (
        "Max Limit in Cart"
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2 group-hover/btn:-translate-y-0.5 transition-transform" />
          Add to Cart
        </>
      )}
    </button>
  );
}
