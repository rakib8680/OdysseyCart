"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toggleWishlistItem } from "@/app/actions/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HeartButtonProps {
  productId: string;
  initialWishlisted: boolean;
  size?: "sm" | "md";
}

export function HeartButton({
  productId,
  initialWishlisted,
  size = "sm",
}: HeartButtonProps) {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const buttonSize = size === "sm" ? "p-1.5" : "p-2";

  const handleToggle = () => {
    if (!user) {
      toast.info("Sign in to save items to your wishlist");
      return;
    }

    // Optimistic update
    const previousState = wishlisted;
    setWishlisted(!wishlisted);

    startTransition(async () => {
      const result = await toggleWishlistItem(user.uid, productId);

      if (!result.success) {
        // Revert on failure
        setWishlisted(previousState);
        toast.error(result.error || "Something went wrong");
      }
    });
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent Link navigation when inside ProductCard
        e.stopPropagation();
        handleToggle();
      }}
      disabled={isPending}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200",
        "hover:bg-white hover:scale-110 active:scale-95",
        "disabled:opacity-50 disabled:pointer-events-none",
        buttonSize,
      )}
    >
      <Heart
        className={cn(
          iconSize,
          "transition-colors duration-200",
          wishlisted
            ? "fill-red-500 text-red-500"
            : "fill-none text-slate-600 hover:text-red-400",
        )}
      />
    </button>
  );
}
