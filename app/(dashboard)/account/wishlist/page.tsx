"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { getWishlist, removeFromWishlist } from "@/app/actions/wishlist";
import type { WishlistItem } from "@/lib/types/wishlist";
import { EmptyState } from "@/components/ui/EmptyState";
import { WishlistSkeleton } from "@/components/skeletons";
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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Wishlist</h1>
        <p className="text-sm text-slate-500 mt-1">
          {!loading && items.length > 0
            ? `${items.length} saved item${items.length !== 1 ? "s" : ""}`
            : "Items you love, saved for later"}
        </p>
      </div>

      {loading ? (
        <WishlistSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Browse our collection and tap the heart icon to save items you love."
          actionLabel="Browse Products"
          actionHref="/items"
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <WishlistRow
              key={item._id}
              item={item}
              isLoading={actionLoadingId === item._id}
              onRemove={handleRemove}
              onMoveToCart={handleMoveToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// WISHLIST ROW (matches OrderCard style)
// ==========================================

interface WishlistRowProps {
  item: WishlistItem;
  isLoading: boolean;
  onRemove: (productId: string) => void;
  onMoveToCart: (item: WishlistItem) => void;
}

function WishlistRow({ item, isLoading, onRemove, onMoveToCart }: WishlistRowProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = item.images?.[0];
  const isOutOfStock = item.stockQuantity <= 0;
  const hasDiscount = item.discount > 0;
  const discountedPrice = hasDiscount
    ? item.price * (1 - item.discount / 100)
    : item.price;

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      {/* Image + Product Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Link
          href={`/items/${item._id}`}
          className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200/60 shadow-xs flex-shrink-0"
        >
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <ImageOff className="w-5 h-5 text-slate-300" />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/items/${item._id}`}
            className="text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1"
          >
            {item.title}
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-bold text-slate-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                ${item.price.toFixed(2)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                -{item.discount}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className="hidden sm:flex items-center min-w-[100px]">
        {isOutOfStock ? (
          <span className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        ) : (
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
            In Stock
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
        <Button
          onClick={() => onMoveToCart(item)}
          disabled={isLoading || isOutOfStock}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-8 px-3 gap-1.5"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Move to Cart
        </Button>
        <button
          onClick={() => onRemove(item._id)}
          disabled={isLoading}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          title="Remove from wishlist"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
