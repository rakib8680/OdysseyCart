"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { FilterSections, FilterSectionsProps } from "./FilterSections";

export type MobileFilterDrawerProps = FilterSectionsProps;

/**
 * Mobile Filter Drawer Component.
 * Slide-over drawer for mobile viewports (`lg:hidden`), built using the project's
 * reusable `Sheet` primitive (`components/ui/sheet.tsx`) and `FilterSections`.
 */
export function MobileFilterDrawer({
  filters,
  categories,
  activeFilterCount,
  onFilterChange,
  onReset,
}: MobileFilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            className="lg:hidden h-10 px-4 gap-2 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-emerald-600 text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        }
      />

      <SheetContent
        side="left"
        className="w-80 sm:w-96 p-0 flex flex-col h-full bg-white"
      >
        {/* Header */}
        <SheetHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-800" />
            <SheetTitle className="text-sm font-bold text-slate-900">
              Filter Products
            </SheetTitle>
          </div>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
              {activeFilterCount} active
            </span>
          )}
        </SheetHeader>

        {/* Scrollable Filter Controls */}
        <div className="flex-1 overflow-y-auto p-5">
          <FilterSections
            filters={filters}
            categories={categories}
            activeFilterCount={activeFilterCount}
            onFilterChange={onFilterChange}
            onReset={onReset}
          />
        </div>

        {/* Footer with Close Button */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <SheetClose
            render={
              <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 h-10 text-xs font-semibold cursor-pointer">
                View Results
              </Button>
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
