import { getFilteredProducts, getCategories } from "@/app/actions/products";
import { CollectionHero } from "./CollectionHero";
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
 * (getFilteredProducts + getCategories) and renders the full catalog UI.
 *
 * Designed to be wrapped in <Suspense> so the parent page shell renders
 * instantly while this component streams in when the DB queries complete.
 *
 * This is the **only** component in the items page that awaits data.
 */
export async function ProductCatalog({ params }: ProductCatalogProps) {
  // Fetch filtered products + categories in parallel
  const [result, categories] = await Promise.all([
    getFilteredProducts(params),
    getCategories(),
  ]);

  return (
    <>
      {/* Editorial hero header — needs totalCount from DB */}
      <CollectionHero
        activeCategory={(params.category as string) || undefined}
        showingCount={result.products.length}
        totalCount={result.totalCount}
      />

      {/* Client Component — controls URL filters, view mode & 2-column layout */}
      <ItemsFilter
        categories={categories}
        products={result.products}
        totalPages={result.totalPages}
        currentPage={result.currentPage}
      />
    </>
  );
}
