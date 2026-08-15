"use client";

import { useState, useEffect } from "react";
import { ViewMode } from "@/lib/types/product";
import { CATALOG_VIEW_MODE_STORAGE_KEY } from "@/lib/config/products";

/**
 * Custom hook for managing and persisting catalog view mode preference ("grid" | "list").
 * Syncs to both localStorage and a Cookie (`odyssey_catalog_view_mode`) to allow
 * Next.js SSR and `loading.tsx` skeletons to immediately render the correct view mode
 * with zero layout shift or grid-to-list flash.
 */
export function useViewMode(defaultMode: ViewMode = "grid") {
  const [viewMode, setViewModeState] = useState<ViewMode>(defaultMode);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read saved preference on mount
  useEffect(() => {
    try {
      // 1. Check cookie first
      const cookieMatch = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${CATALOG_VIEW_MODE_STORAGE_KEY}=`));
      const cookieVal = cookieMatch?.split("=")[1] as ViewMode;

      // 2. Check localStorage fallback
      const localVal = localStorage.getItem(
        CATALOG_VIEW_MODE_STORAGE_KEY
      ) as ViewMode;

      const saved =
        cookieVal === "grid" || cookieVal === "list"
          ? cookieVal
          : localVal === "grid" || localVal === "list"
          ? localVal
          : null;

      if (saved && saved !== viewMode) {
        setViewModeState(saved);
      }
    } catch {
      // Ignore storage read errors (e.g. private browsing mode)
    } finally {
      setIsHydrated(true);
    }
  }, [viewMode]);

  // Update state and write to both localStorage AND cookie for zero-flash SSR
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem(CATALOG_VIEW_MODE_STORAGE_KEY, mode);
      document.cookie = `${CATALOG_VIEW_MODE_STORAGE_KEY}=${mode}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore storage write errors
    }
  };

  return {
    viewMode,
    setViewMode,
    isHydrated,
  };
}
