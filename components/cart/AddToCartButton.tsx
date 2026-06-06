"use client";

import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem, openCart, items, busyItems } = useCart();

  // Check how many of this item are currently in the cart
  const cartItem = items.find((item) => item.productId === product._id);
  const currentQuantityInCart = cartItem?.quantity || 0;
  const isMaxLimitReached = currentQuantityInCart >= product.stockQuantity;
  const isBusy = busyItems.has(product._id);

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";

  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents link navigation if inside a Card
    if (isMaxLimitReached || isBusy) return;

    // Fire-and-forget: optimistic update handles UI instantly
    addItem(
      {
        productId: product._id,
        title: product.title,
        price: discountedPrice,
        image: imageUrl,
        stockQuantity: product.stockQuantity,
      },
      1,
    );
    openCart();
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isBusy || product.stockQuantity === 0 || isMaxLimitReached}
      className={cn(
        "bg-slate-900 text-white hover:bg-emerald-600 transition-colors flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed group/btn shadow-sm",
        className,
      )}
    >
      {isBusy ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : product.stockQuantity === 0 ? (
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
