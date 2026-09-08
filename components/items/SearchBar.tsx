"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  isSearching?: boolean;
}

/**
 * Debounced Search Bar Component.
 * Encapsulates search input logic with 300ms debounced callback to prevent race conditions
 * during external resets/pill clearing, with inline micro-spinner feedback during pending queries.
 */
export function SearchBar({
  search,
  onSearchChange,
  isSearching = false,
}: SearchBarProps) {
  const [localSearch, setLocalSearch] = useState(search);

  // Industry-standard debounced callback for input typing
  const debouncedSearchChange = useDebouncedCallback((val: string) => {
    onSearchChange(val);
  }, 300);

  // Sync local state and cancel pending debounces when search prop changes externally (e.g. pill clear, reset)
  useEffect(() => {
    setLocalSearch(search);
    debouncedSearchChange.cancel();
  }, [search, debouncedSearchChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    debouncedSearchChange(val);
  };

  const isQueryActive = isSearching || localSearch !== search;

  return (
    <div className="relative w-full md:w-auto flex-1 max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <Input
        type="text"
        placeholder="Search products by name or description..."
        className={cn(
          "w-full pl-10 h-10 text-xs sm:text-sm bg-white transition-all",
          isQueryActive && "pr-10"
        )}
        value={localSearch}
        onChange={handleChange}
      />
      {isQueryActive && (
        <div
          aria-hidden="true"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center"
        >
          <Spinner className="w-3.5 h-3.5 text-slate-500" />
        </div>
      )}
    </div>
  );
}
