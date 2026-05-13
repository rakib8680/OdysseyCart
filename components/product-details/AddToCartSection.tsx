"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Product } from "@/lib/types/product";

export default function AddToCartSection({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";

  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addItem(
      {
        productId: product._id,
        title: product.title,
        price: discountedPrice,
        image: imageUrl,
      },
      1,
    );
    setIsAdding(false);
    openCart();
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || product.stockQuantity === 0}
      className="w-full bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20 text-md h-14 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group mt-8"
    >
      {isAdding ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : product.stockQuantity === 0 ? (
        "Out of Stock"
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2 group-hover:-translate-y-0.5 transition-transform" />
          Add to Cart
        </>
      )}
    </button>
  );
}
