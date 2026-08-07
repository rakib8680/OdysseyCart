import { useState, useCallback } from "react";
import { User } from "firebase/auth";
import { AddToCartInput, CartItem } from "@/lib/types/cart";
import {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart as clearCartAction,
} from "@/app/actions/cart";
import { cartItemKey, findCartIndex } from "@/lib/utils/cart";
import { toast } from "sonner";

const STORAGE_KEY = "odyssey_cart";

/**
 * Provides all cart mutation functions with optimistic updates.
 * Each function handles the hybrid logic:
 *   - Logged-in → Optimistic UI update → Server Action (MongoDB) → Rollback on failure
 *   - Guest → Local state manipulation (auto-saved by useCartPersistence)
 *
 * Tracks busy state per-item using composite key (productId + variantSku).
 */
export function useCartActions(
  user: User | null,
  items: CartItem[],
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
) {
  const [busyItems, setBusyItems] = useState<Set<string>>(new Set());

  // Helper to mark an item as busy/idle using composite key
  const markBusy = useCallback((key: string) => {
    setBusyItems((prev) => new Set(prev).add(key));
  }, []);

  const markIdle = useCallback((key: string) => {
    setBusyItems((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const addItem = async (product: AddToCartInput, quantity: number = 1) => {
    const key = cartItemKey(product);
    markBusy(key);
    try {
      if (user) {
        // Snapshot for rollback on failure
        const snapshot = [...items];

        // Optimistic: update UI + toast immediately
        const existingIndex = findCartIndex(items, product);
        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          setItems(updated);
        } else {
          setItems((prev) => [...prev, { ...product, quantity }]);
        }
        toast.success("Added to cart");

        // Server sync in background — reconcile or rollback
        const res = await addToCart(
          user.uid,
          product.productId,
          quantity,
          product.variantSku,
          product.selectedOptions,
        );
        if (res.success) {
          setItems(res.items || []);
        } else {
          setItems(snapshot); // Rollback
          toast.error(res.error || "Failed to add item");
        }
      } else {
        const existingIndex = findCartIndex(items, product);

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          setItems(updated);
          toast.success("Quantity updated");
        } else {
          setItems((prev) => [...prev, { ...product, quantity }]);
          toast.success("Added to cart");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      markIdle(key);
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
    variantSku?: string,
  ) => {
    const key = cartItemKey({ productId, variantSku });
    markBusy(key);
    try {
      if (user) {
        // Optimistic update
        const snapshot = [...items];

        if (quantity <= 0) {
          setItems(items.filter((item) => cartItemKey(item) !== key));
        } else {
          setItems(
            items.map((item) =>
              cartItemKey(item) === key ? { ...item, quantity } : item,
            ),
          );
        }

        // Server sync
        const res = await updateCartItemQuantity(
          user.uid,
          productId,
          quantity,
          variantSku,
        );
        if (res.success) {
          setItems(res.items || []);
        } else {
          setItems(snapshot); // Rollback
          toast.error(res.error || "Failed to update quantity");
        }
      } else {
        if (quantity <= 0) {
          setItems(items.filter((item) => cartItemKey(item) !== key));
        } else {
          setItems(
            items.map((item) =>
              cartItemKey(item) === key ? { ...item, quantity } : item,
            ),
          );
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      markIdle(key);
    }
  };

  const removeItem = async (productId: string, variantSku?: string) => {
    const key = cartItemKey({ productId, variantSku });
    markBusy(key);
    try {
      if (user) {
        // Optimistic: remove immediately
        const snapshot = [...items];
        setItems(items.filter((item) => cartItemKey(item) !== key));

        // Server sync
        const res = await removeFromCart(user.uid, productId, variantSku);
        if (res.success) {
          setItems(res.items || []);
          toast.success("Item removed");
        } else {
          setItems(snapshot); // Rollback
          toast.error(res.error || "Failed to remove item");
        }
      } else {
        setItems(items.filter((item) => cartItemKey(item) !== key));
        toast.success("Item removed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      markIdle(key);
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        const snapshot = [...items];
        setItems([]); // Optimistic

        const res = await clearCartAction(user.uid);
        if (res.success) {
          // toast.success("Cart cleared");
        } else {
          setItems(snapshot); // Rollback
          toast.error(res.error || "Failed to clear cart");
        }
      } else {
        setItems([]);
        localStorage.removeItem(STORAGE_KEY);
        toast.success("Cart cleared");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return { addItem, updateQuantity, removeItem, clearCart, busyItems };
}
