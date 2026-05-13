import { useEffect, useState, useCallback } from "react";
import { User } from "firebase/auth";
import { CartItem } from "@/lib/types/cart";
import { getCart, mergeCart } from "@/app/actions/cart";

const STORAGE_KEY = "odyssey_cart";

/**
 * Handles loading and persisting cart data.
 * - Guests: reads/writes to localStorage.
 * - Logged-in users: fetches from MongoDB and merges any leftover guest items.
 */
export function useCartPersistence(user: User | null) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart on mount or when auth state changes
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Logged in — check if guest left items in localStorage
          const localData = localStorage.getItem(STORAGE_KEY);
          const localItems: CartItem[] = localData
            ? JSON.parse(localData)
            : [];

          if (localItems.length > 0) {
            // Merge local guest items into the user's DB cart
            const res = await mergeCart(user.uid, localItems);
            if (res.success) {
              setItems(res.items || []);
              localStorage.removeItem(STORAGE_KEY);
            }
          } else {
            // No local items — just fetch from DB
            const res = await getCart(user.uid);
            if (res.success) {
              setItems(res.items || []);
            }
          }
        } else {
          // Guest — load from localStorage
          const localData = localStorage.getItem(STORAGE_KEY);
          setItems(localData ? JSON.parse(localData) : []);
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Auto-save guest cart to localStorage
  useEffect(() => {
    if (!user && !isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, user, isLoading]);

  return { items, setItems, isLoading };
}
