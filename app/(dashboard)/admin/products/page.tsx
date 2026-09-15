"use client";

import { useEffect, useState, useCallback } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import Link from "next/link";
import ManageTable from "@/components/ManageTable";
import { getFilteredProducts } from "@/app/actions/products";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/Pagination";
import { ToolbarPagination } from "@/components/ui/ToolbarPagination";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { ManageTableSkeleton } from "@/components/skeletons";
import { LastUpdated } from "@/components/ui/LastUpdated";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // URL-synced state via nuqs
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: true }),
  );
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true }),
  );

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getFilteredProducts({
        page,
        limit: 10,
        search: debouncedSearch,
      });
      setProducts(result.products || []);
      setTotalCount(result.totalCount || 0);
      setTotalPages(result.totalPages || 0);
      setLastUpdated(Date.now());
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Products
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
              View, edit, and delete your product catalog.
            </p>
          </div>
          {/* Mobile Add Product Button */}
          <Link
            href="/admin/products/add"
            className="sm:hidden px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300">
            Total Products:{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">{totalCount}</strong>
          </span>
          <LastUpdated timestamp={lastUpdated} onRefresh={fetchProducts} loading={loading} />
          {/* Desktop Add Product Button */}
          <Link
            href="/admin/products/add"
            className="hidden sm:flex px-4 sm:px-5 py-2 sm:py-2.5 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Search & Top Pagination (Side-by-side on all viewports) */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search products by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value || null)}
            className="w-full pl-9 h-9 sm:h-10 text-xs sm:text-sm rounded-lg"
          />
        </div>

        {totalPages > 1 && (
          <ToolbarPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isPending={loading}
          />
        )}
      </div>

      {/* Table */}
      <div className="pt-2 relative min-h-100">
        {loading ? (
          <ManageTableSkeleton />
        ) : (
          <ManageTable products={products} onRefresh={fetchProducts} />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isPending={loading}
        />
      )}
    </div>
  );
}
