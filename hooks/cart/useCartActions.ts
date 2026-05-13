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
 * Provides all cart mutation functions.
 * Each function handles the hybrid logic:
 *   - Logged-in → Server Action (MongoDB)
 *   - Guest → Local state manipulation (auto-saved by useCartPersistence)
 */
export function useCartActions(
  user: User | null,
  items: CartItem[],
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
) {
  const addItem = async (product: AddToCartInput, quantity: number = 1) => {
    try {
      if (user) {
        const res = await addToCart(user.uid, product.productId, quantity);
        if (res.success) {
          setItems(res.items || []);
          toast.success("Added to cart");
        } else {
          toast.error(res.error || "Failed to add item");
        }
      } else {
        const existingIndex = items.findIndex(
          (i) => i.productId === product.productId,
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          setItems(updated);
          toast.success("Quantity updated");
        } else {
          setItems((prev) => [...prev, { ...product, quantity }]);
          toast.success("Added to cart");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (user) {
        const res = await updateCartItemQuantity(user.uid, productId, quantity);
        if (res.success) {
          setItems(res.items || []);
        } else {
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
    }
  };

  const removeItem = async (productId: string) => {
    try {
      if (user) {
        const res = await removeFromCart(user.uid, productId);
        if (res.success) {
          setItems(res.items || []);
          toast.success("Item removed");
        } else {
          toast.error(res.error || "Failed to remove item");
        }
      } else {
        setItems(items.filter((item) => item.productId !== productId));
        toast.success("Item removed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        const res = await clearCartAction(user.uid);
        if (res.success) {
          setItems([]);
          toast.success("Cart cleared");
        } else {
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

  return { addItem, updateQuantity, removeItem, clearCart };
}
