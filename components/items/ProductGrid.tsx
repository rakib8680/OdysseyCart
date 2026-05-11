import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types/product";

interface ProductGridProps {
  products: Product[];
  totalCount: number;
  onResetFilters: () => void;
}

export function ProductGrid({
  products,
  totalCount,
  onResetFilters,
}: ProductGridProps) {
  return (
    <>
      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {products.length}
          </span>{" "}
          of {totalCount} products
        </p>
      </div>

      {/* Grid or Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-lg font-medium mb-2">No products found</p>
          <p className="text-sm">
            Try adjusting your filters or{" "}
            <button
              onClick={onResetFilters}
              className="text-emerald-600 underline cursor-pointer"
            >
              reset all filters
            </button>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
