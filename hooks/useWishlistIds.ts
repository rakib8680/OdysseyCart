import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getWishlistIds } from "@/app/actions/wishlist";

/**
 * Fetches the current user's wishlist product IDs on mount.
 * Returns an empty array for guests. Shared by ItemsFilter and ProductDetailClient.
 */
export function useWishlistIds(): string[] {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setIds([]);
      return;
    }
    getWishlistIds(user.uid).then(setIds);
  }, [user]);

  return ids;
}
