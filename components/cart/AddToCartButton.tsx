"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useProductInventory } from "@/hooks/cart/useProductInventory";
import { ShoppingCart, Loader2, SlidersHorizontal } from "lucide-react";
import { Product, Variant } from "@/lib/types/product";
import { cn } from "@/lib/utils";

// ==========================================
// PROPS
// ==========================================
interface AddToCartButtonProps {
  product: Product;
  selectedVariant?: Variant | null;
  className?: string;
  compactText?: boolean; // When true, uses compact "Add" / "Select" labels on mobile screens
  quantity?: number; // Optional quantity to add to cart (defaults to 1)
}

// ==========================================
// ADD TO CART BUTTON
// ==========================================
export function AddToCartButton({
  product,
  selectedVariant,
  className,
  compactText = false,
  quantity = 1,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const router = useRouter();
  const inventory = useProductInventory(product, selectedVariant);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Redirect to detail page if variant selection is required
    if (inventory.needsVariantSelection) {
      router.push(`/items/${product.slug}`, { scroll: true });
      return;
    }

    if (inventory.isMaxInCart || inventory.isOutOfStock || inventory.isBusy) return;

    // Safety clamp quantity to remaining available inventory
    const safeQuantity = Math.min(
      Math.max(1, quantity),
      inventory.availableToAdd,
    );

    if (safeQuantity <= 0) return;

    addItem(
      {
        productId: product._id,
        variantSku: selectedVariant?.sku,
        selectedOptions: selectedVariant?.options,
        title: product.title,
        price: inventory.unitPrice,
        image: inventory.resolvedImage,
        stockQuantity: inventory.totalStock,
      },
      safeQuantity,
    );
    openCart();
  };

  const isDisabled =
    inventory.isBusy ||
    (!inventory.needsVariantSelection &&
      (inventory.isOutOfStock || inventory.isMaxInCart));

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        "bg-slate-900 text-white hover:bg-emerald-600 transition-colors flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-xs whitespace-nowrap",
        className,
      )}
    >
      {inventory.isBusy ? (
        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin shrink-0" />
      ) : inventory.needsVariantSelection ? (
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
      ) : inventory.isOutOfStock ? (
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
      ) : inventory.isMaxInCart ? (
        <span className="truncate text-[10px] sm:text-xs">
          {compactText ? (
            <>
              <span className="sm:hidden">Max Limit</span>
              <span className="hidden sm:inline">All in Cart</span>
            </>
          ) : (
            `All in Cart (${inventory.inCart})`
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
            ) : quantity > 1 ? (
              `Add ${quantity} to Cart`
            ) : (
              "Add to Cart"
            )}
          </span>
        </>
      )}
    </button>
  );
}

