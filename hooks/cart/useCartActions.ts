import { useState, useCallback } from "react";
import { User } from "firebase/auth";
import { AddToCartInput, CartItem } from "@/lib/types/cart";
import {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart as clearCartAction,
} from "@/app/actions/cart";
import { toast } from "sonner";

const STORAGE_KEY = "odyssey_cart";

/**
 * Provides all cart mutation functions with optimistic updates.
 * Each function handles the hybrid logic:
 *   - Logged-in → Optimistic UI update → Server Action (MongoDB) → Rollback on failure
 *   - Guest → Local state manipulation (auto-saved by useCartPersistence)
 *
 * Tracks busy state per-item to disable UI controls during server calls.
 */
export function useCartActions(
  user: User | null,
  items: CartItem[],
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
) {
  const [busyItems, setBusyItems] = useState<Set<string>>(new Set());

  // Helper to mark an item as busy/idle
  const markBusy = useCallback((productId: string) => {
    setBusyItems((prev) => new Set(prev).add(productId));
  }, []);

  const markIdle = useCallback((productId: string) => {
    setBusyItems((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  }, []);

  const addItem = async (product: AddToCartInput, quantity: number = 1) => {
    markBusy(product.productId);
    try {
      if (user) {
        // Optimistic: update UI immediately
        const existingIndex = items.findIndex(
          (i) => i.productId === product.productId,
        );
        const snapshot = [...items];

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

        // Server sync
        const res = await addToCart(user.uid, product.productId, quantity);
        if (res.success) {
          setItems(res.items || []);
          toast.success("Added to cart");
        } else {
          setItems(snapshot); // Rollback
          toast.error(res.error || "Failed to add item");
        }
      } else {
        const existingIndex = items.findIndex(
          (i) => i.productId === product.productId,
        );

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
      markIdle(product.productId);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    markBusy(productId);
    try {
      if (user) {
        // Optimistic update
        const snapshot = [...items];

        if (quantity <= 0) {
          setItems(items.filter((item) => item.productId !== productId));
        } else {
          setItems(
            items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item,
            ),
          );
        }

        // Server sync
        const res = await updateCartItemQuantity(user.uid, productId, quantity);
        if (res.success) {
          setItems(res.items || []);
        } else {
          setItems(snapshot); // Rollback
          toast.error(res.error || "Failed to update quantity");
        }
      } else {
        if (quantity <= 0) {
          setItems(items.filter((item) => item.productId !== productId));
        } else {
          setItems(
            items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item,
            ),
          );
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      markIdle(productId);
    }
  };

  const removeItem = async (productId: string) => {
    markBusy(productId);
    try {
      if (user) {
        // Optimistic: remove immediately
        const snapshot = [...items];
        setItems(items.filter((item) => item.productId !== productId));

        // Server sync
        const res = await removeFromCart(user.uid, productId);
        if (res.success) {
          setItems(res.items || []);
          toast.success("Item removed");
        } else {
          setItems(snapshot); // Rollback
          toast.error(res.error || "Failed to remove item");
        }
      } else {
        setItems(items.filter((item) => item.productId !== productId));
        toast.success("Item removed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      markIdle(productId);
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
