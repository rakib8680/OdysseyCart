"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AddToCartInput, CartItem } from "@/lib/types/cart";
import { useCartPersistence } from "@/hooks/cart/useCartPersistence";
import { useCartActions } from "@/hooks/cart/useCartActions";

// ---------- types ----------
interface CartContextType {
  items: CartItem[];
  addItem: (product: AddToCartInput, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  busyItems: Set<string>;
  // UI State
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

// ---------- context API ----------
const CartContext = createContext<CartContextType | undefined>(undefined);

// ---------- provider ----------
export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Persistence: loading, saving, merging
  const { items, setItems, isLoading } = useCartPersistence(user);

  // Actions: add, update, remove, clear
  const { addItem, updateQuantity, removeItem, clearCart, busyItems } =
    useCartActions(user, items, setItems);

  // Derived values
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

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
        busyItems,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
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
