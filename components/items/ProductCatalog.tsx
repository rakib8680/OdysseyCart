import { getFilteredProducts, getCategories } from "@/app/actions/products";
import { ItemsFilter } from "./ItemsFilter";

// ==========================================
// PROPS
// ==========================================
interface ProductCatalogProps {
  params: Record<string, string | number | undefined>;
}

// ==========================================
// PRODUCT CATALOG (Async Server Component)
// ==========================================
/**
 * Async Server Component that performs the heavy database queries
 * (getFilteredProducts + getCategories) and renders the dynamic catalog UI.
 *
 * Placed inside <Suspense> while the parent page shell (CollectionHero)
 * renders instantly. Streams in result count + search toolbar + sidebar + grid.
 */
export async function ProductCatalog({ params }: ProductCatalogProps) {
  // Fetch filtered products + categories in parallel
  const [result, categories] = await Promise.all([
    getFilteredProducts(params),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      {/* Result Count Indicator — streams in smoothly under the static hero header */}
      <div className="-mt-4 mb-6 flex items-center gap-3">
        <div className="h-px flex-1 max-w-16 bg-slate-200" />
        <p className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {result.products.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {result.totalCount}
          </span>{" "}
          {result.totalCount === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Client Component — controls URL filters, view mode & 2-column layout */}
      <ItemsFilter
        categories={categories}
        products={result.products}
        totalPages={result.totalPages}
        currentPage={result.currentPage}
      />
    </div>
  );
}
