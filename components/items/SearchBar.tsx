"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

/**
 * Debounced Search Bar Component.
 * Encapsulates search input logic with 300ms debounce to minimize URL updates.
 */
export function SearchBar({ search, onSearchChange }: SearchBarProps) {
  // Local state for debouncing — prevents server request on every keystroke
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedLocalSearch = useDebounce(localSearch, 300);

  // Sync local state when external search changes (e.g. reset filters)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Update parent when debounced value changes
  useEffect(() => {
    if (debouncedLocalSearch !== search) {
      onSearchChange(debouncedLocalSearch);
    }
  }, [debouncedLocalSearch, search, onSearchChange]);

  return (
    <div className="relative w-full md:w-auto flex-1 max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <Input
        type="text"
        placeholder="Search products by name or description..."
        className="w-full pl-10 h-10 text-xs sm:text-sm bg-white"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </div>
  );
}
