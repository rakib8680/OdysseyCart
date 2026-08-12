"use client";

import { useState, useCallback } from "react";
import { Product } from "@/lib/types/product";

/**
 * Custom Hook for managing Quick View modal state across product cards.
 */
export function useQuickView() {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openQuickView = useCallback((product: Product) => {
    setActiveProduct(product);
    setIsOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsOpen(false);
    setActiveProduct(null);
  }, []);

  return {
    activeProduct,
    isOpen,
    openQuickView,
    closeQuickView,
  };
}
