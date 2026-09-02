"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useViewMode } from "@/hooks/useViewMode";
import { ViewMode } from "@/lib/types/product";

interface ItemsGridSkeletonProps {
  viewMode?: ViewMode;
}

/**
 * Single Product Grid Card Skeleton.
 * Matches `ProductCard.tsx` (aspect-square image, category, title, stars, price, mobile action).
 */
export function ProductCardSkeleton() {
  return (
    <div className="h-full rounded-xl overflow-hidden flex flex-col bg-white border border-slate-100 shadow-2xs">
      {/* Square Image Placeholder */}
      <div className="w-full aspect-square bg-slate-50 border-b border-slate-100/60 p-2.5">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>

      {/* Product Details Section */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 gap-2">
        {/* Category & Brand line */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-16 rounded-md" />
          <Skeleton className="h-3 w-10 rounded-md" />
        </div>

        {/* Product Title */}
        <Skeleton className="h-4 sm:h-5 w-3/4 rounded-md" />

        {/* Star Rating line */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-3 w-6 rounded-md" />
        </div>

        {/* Price and Discount row */}
        <div className="flex items-baseline gap-2 pt-1 mt-auto">
          <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-md" />
          <Skeleton className="h-3.5 w-10 rounded-md" />
        </div>

        {/* Mobile Only Action Button */}
        <div className="sm:hidden pt-2 mt-1">
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Single Product List Item Card Skeleton.
 * Matches `ProductListItemCard.tsx` (horizontal flex card, left image, middle meta/rating/desc, right price/actions).
 */
export function ProductListItemSkeleton() {
  return (
    <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden flex flex-row items-stretch h-36 sm:h-52 shadow-2xs">
      {/* Left Image Placeholder */}
      <div className="w-28 sm:w-56 shrink-0 h-full bg-slate-50 border-r border-slate-100 p-2.5">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>

      {/* Right Body Content */}
      <div className="flex-1 min-w-0 p-3 sm:p-5 flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 overflow-hidden">
        {/* Info Column */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1 sm:space-y-0">
          <div className="space-y-1.5">
            {/* Category badge */}
            <Skeleton className="h-4 w-16 rounded-md" />

            {/* Title */}
            <Skeleton className="h-4 sm:h-6 w-4/5 rounded-md" />

            {/* Brand */}
            <Skeleton className="h-3 w-20 rounded-md hidden sm:block" />
          </div>

          {/* Rating & Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-20 rounded-md" />
              <Skeleton className="h-3.5 w-8 rounded-md" />
            </div>
            <div className="space-y-1 hidden sm:block">
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-2/3 rounded-md" />
            </div>
          </div>
        </div>

        {/* Price & Action Column */}
        <div className="shrink-0 sm:w-48 flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-stretch gap-2 pt-1.5 sm:pt-0 border-t border-slate-100 sm:border-t-0 sm:border-l sm:pl-5 sm:bg-slate-50/50 sm:-my-5 sm:-mr-5 sm:p-5">
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <Skeleton className="h-5 sm:h-7 w-16 sm:w-24 rounded-md" />
              <Skeleton className="h-3.5 w-10 rounded-md" />
            </div>
            <Skeleton className="h-3 w-20 rounded-md hidden sm:block" />
          </div>

          <div className="flex items-center gap-1.5 sm:flex-col sm:space-y-2 w-full sm:w-auto">
            <Skeleton className="h-8 sm:h-9 w-8 sm:w-full rounded-lg" />
            <Skeleton className="h-8 sm:h-9 flex-1 sm:w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Modern Collection / Items Page Skeleton.
 * Accurately mirrors the redesigned 2-column layout:
 * 1. CollectionHero banner (breadcrumbs, badge, title, subtitle, count)
 * 2. ItemsToolbar (search bar, filter drawer trigger, quick-sort dropdown, view mode toggle)
 * 3. Sticky DesktopSidebar (category list, price range slider & presets, sort radio group)
 * 4. CategoryChips quick-nav row
 * 5. Dynamic Product Catalog (Grid vs. List view mode synced with user preference)
 */
export function ItemsGridSkeleton({
  viewMode: propViewMode,
}: ItemsGridSkeletonProps) {
  const { viewMode: hookViewMode } = useViewMode("grid");
  const activeViewMode = propViewMode || hookViewMode;

  return (
    <div className="space-y-6">
      {/* 1. Result Count Line Skeleton */}
      <div className="-mt-4 mb-6 flex items-center gap-3">
        <Skeleton className="h-px flex-1 max-w-16" />
        <Skeleton className="h-4 w-36 rounded-md" />
      </div>

      {/* 2. Top Toolbar Skeleton (Search Bar, Mobile Filter Trigger, Sort, View Toggle) */}
      <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Search Input Box */}
          <div className="relative flex-1 min-w-0">
            <Skeleton className="h-10 sm:h-11 w-full rounded-xl" />
          </div>

          {/* Mobile Filter Drawer Trigger (Visible only on mobile/tablet) */}
          <Skeleton className="lg:hidden h-10 sm:h-11 w-24 rounded-xl shrink-0" />

          {/* Desktop Quick Sort Dropdown Trigger */}
          <Skeleton className="hidden lg:block h-11 w-44 rounded-xl shrink-0" />

          {/* Desktop View Mode Toggle (Grid vs. List) */}
          <Skeleton className="hidden sm:block h-10 sm:h-11 w-20 rounded-xl shrink-0" />
        </div>

        {/* 3. Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pt-2">
          {/* Sticky Desktop Sidebar Skeleton (Hidden on mobile/tablet) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6 pr-6 border-r border-slate-100">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>

            {/* Category Filter Section */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-md" />
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1"
                  >
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-4 w-6 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-4 w-3 rounded-md" />
                <Skeleton className="h-8 flex-1 rounded-lg" />
              </div>
              {/* Quick Price Presets */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-7 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Sort Options Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <Skeleton className="h-4 w-20 rounded-md" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Product Content Area */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            {/* Category Quick-Nav Chips Row Skeleton */}
            <div className="flex items-center gap-2 overflow-x-hidden pb-1">
              {[...Array(7)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-9 w-20 sm:w-24 rounded-full shrink-0"
                />
              ))}
            </div>

            {/* Product Catalog Skeletons: Dynamic List vs. Grid View */}
            {activeViewMode === "list" ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <ProductListItemSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
