"use client";

import { useState, useEffect } from "react";
import { ViewMode } from "@/lib/types/product";
import { CATALOG_VIEW_MODE_STORAGE_KEY } from "@/lib/config/products";

/**
 * Custom hook for managing and persisting catalog view mode preference ("grid" | "list")
 * with SSR hydration safety to prevent React hydration mismatch errors.
 */
export function useViewMode(defaultMode: ViewMode = "grid") {
  const [viewMode, setViewModeState] = useState<ViewMode>(defaultMode);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read saved preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CATALOG_VIEW_MODE_STORAGE_KEY) as ViewMode;
      if (saved === "grid" || saved === "list") {
        setViewModeState(saved);
      }
    } catch {
      // Ignore localStorage read errors (e.g. private browsing mode)
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Update state and write to localStorage
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem(CATALOG_VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // Ignore localStorage write errors
    }
  };

  return {
    viewMode,
    setViewMode,
    isHydrated,
  };
}
