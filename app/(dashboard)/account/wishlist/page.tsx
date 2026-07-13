"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getWishlist, removeFromWishlist } from "@/app/actions/wishlist";
import type { WishlistItem } from "@/lib/types/wishlist";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Heart, ShoppingCart, Trash2, ImageOff } from "lucide-react";
import Link from "next/link";

export default function AccountWishlistPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWishlist() {
      if (!user) return;

      setLoading(true);
      const result = await getWishlist(user.uid);
      if (result.success) {
        setItems(result.items);
      }
      setLoading(false);
    }

    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId: string) => {
    if (!user) return;

    setActionLoadingId(productId);
    const result = await removeFromWishlist(user.uid, productId);

    if (result.success) {
      setItems((prev) => prev.filter((item) => item._id !== productId));
      toast.success("Removed from wishlist");
    } else {
      toast.error(result.error || "Failed to remove item");
    }
    setActionLoadingId(null);
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    if (!user) return;

    setActionLoadingId(item._id);
    try {
      // Use cart context's addItem — syncs both server and client cart state
      await addItem(
        {
          productId: item._id,
          title: item.title,
          price: item.discount > 0
            ? item.price * (1 - item.discount / 100)
            : item.price,
          image: item.images?.[0] || "",
        },
        1,
      );

      // Remove from wishlist after successful cart add
      await removeFromWishlist(user.uid, item._id);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch {
      toast.error("Failed to move to cart");
    }
    setActionLoadingId(null);
  };

  const getDiscountedPrice = (price: number, discount: number) =>
    discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Wishlist</h1>
        <p className="text-sm text-slate-500 mt-1">
          {items.length > 0
            ? `${items.length} saved item${items.length !== 1 ? "s" : ""}`
            : "Items you love, saved for later"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="w-8 h-8 text-emerald-500" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Browse our collection and tap the heart icon to save items you love."
          actionLabel="Browse Products"
          actionHref="/items"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const imageUrl = item.images?.[0];
            const isOutOfStock = item.stockQuantity <= 0;
            const isLoading = actionLoadingId === item._id;
            const discountedPrice = getDiscountedPrice(item.price, item.discount);

            return (
              <div
                key={item._id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <Link
                  href={`/items/${item._id}`}
                  className="block w-full aspect-[4/3] bg-slate-50 overflow-hidden relative"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                  {item.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      -{item.discount}%
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                      <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <Link
                    href={`/items/${item._id}`}
                    className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1 mb-2"
                  >
                    {item.title}
                  </Link>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-bold text-lg text-slate-900">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-sm text-slate-400 line-through">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <Button
                      onClick={() => handleMoveToCart(item)}
                      disabled={isLoading || isOutOfStock}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-sm"
                    >
                      {isLoading ? (
                        <Spinner className="w-4 h-4" />
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-1.5" />
                          Move to Cart
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemove(item._id)}
                      disabled={isLoading}
                      className="h-9 px-3 text-slate-500 hover:text-red-500 hover:border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
