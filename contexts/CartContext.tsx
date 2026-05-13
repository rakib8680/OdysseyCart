"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getCart,
  mergeCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart as clearCartAction,
} from "@/app/actions/cart";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem } from "@/lib/types/cart";

// ---------- types ----------
interface AddToCartInput {
  productId: string;
  title: string;
  price: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: AddToCartInput, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
}

// ---------- context API ----------
const CartContext = createContext<CartContextType | undefined>(undefined);

// ---------- provider ----------
export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Derived values — recalculated automatically whenever items change
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // ---------- Step 2: Load cart on mount / auth change ----------
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Logged in — check if guest left items in localStorage
          const localData = localStorage.getItem("odyssey_cart");
          const localItems: CartItem[] = localData ? JSON.parse(localData) : [];

          if (localItems.length > 0) {
            // Merge local guest items into the user's DB cart
            const res = await mergeCart(user.uid, localItems);
            if (res.success) {
              setItems(res.items || []);
              localStorage.removeItem("odyssey_cart");
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
          const localData = localStorage.getItem("odyssey_cart");
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

  // ---------- Step 3: Auto-save guest cart to localStorage ----------
  useEffect(() => {
    // Only save to localStorage for guests, and only after initial load is done
    if (!user && !isLoading) {
      localStorage.setItem("odyssey_cart", JSON.stringify(items));
    }
  }, [items, user, isLoading]);
  // ---------- Step 4: Action functions ----------

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
        // Guest: check if item already exists
        const existingIndex = items.findIndex(
          (i) => i.productId === product.productId,
        );

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += quantity;
          setItems(updated);
          toast.success("Quantity updated");
        } else {
          // Use product info directly from the client — instant, no server call
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
        // Guest: update locally, remove if quantity <= 0
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
        localStorage.removeItem("odyssey_cart");
        toast.success("Cart cleared");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ---------- hook ----------
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
