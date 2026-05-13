"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem } from "@/lib/types/cart";

// ---------- types ----------
interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => Promise<void>;
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

  // TODO: Step 2 — useEffect to load cart on mount / auth change
  // TODO: Step 3 — useEffect to persist guest cart to localStorage
  // TODO: Step 4 — Action functions (addItem, removeItem, updateQuantity, clearCart)

  // Placeholder functions (will be implemented in Step 4)
  const addItem = async () => {};
  const updateQuantity = async () => {};
  const removeItem = async () => {};
  const clearCart = async () => {};

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
