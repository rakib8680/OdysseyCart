"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import { Search } from "lucide-react";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

/**
 * Debounced Search Bar Component.
 * Encapsulates search input logic with 300ms debounced callback to prevent race conditions
 * during external resets/pill clearing and minimize unnecessary URL updates.
 */
export function SearchBar({ search, onSearchChange }: SearchBarProps) {
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

  return (
    <div className="relative w-full md:w-auto flex-1 max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <Input
        type="text"
        placeholder="Search products by name or description..."
        className="w-full pl-10 h-10 text-xs sm:text-sm bg-white"
        value={localSearch}
        onChange={handleChange}
      />
    </div>
  );
}
