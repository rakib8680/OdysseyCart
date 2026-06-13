"use client";

import { useEffect, useState, useCallback } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import Link from "next/link";
import ManageTable from "@/components/ManageTable";
import { getFilteredProducts } from "@/app/actions/products";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/items/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { ManageTableSkeleton } from "@/components/skeletons";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // URL-synced state via nuqs
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            View, edit, and delete your product catalog.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-slate-500">
            Total Products:{" "}
            <span className="text-slate-900">{totalCount}</span>
          </div>
          <Link
            href="/admin/products/add"
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search products by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value || null)}
          className="w-full pl-10 h-10"
        />
      </div>

      {/* Table */}
      <div className="pt-2 relative min-h-[400px]">
        {loading ? (
          <ManageTableSkeleton />
        ) : (
          <ManageTable products={products} onRefresh={fetchProducts} />
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
