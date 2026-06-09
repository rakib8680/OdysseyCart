import { getFilteredProducts, getCategories } from "@/app/actions/products";
import { ItemsFilter } from "@/components/items/ItemsFilter";
import { Pagination } from "@/components/items/Pagination";
import { ProductGrid } from "@/components/items/ProductGrid";
import { productFilterCache } from "@/lib/search-params";

export const metadata = { title: "Collection | OdysseyCart" };

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function ItemsPage({ searchParams }: PageProps) {
  // Parse URL search params on the server using the shared cache
  const params = productFilterCache.parse(await searchParams);

  // Fetch filtered products + categories in parallel
  const [result, categories] = await Promise.all([
    getFilteredProducts(params),
    getCategories(),
  ]);

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-8 py-16 min-h-screen">
      {/* Client Component — controls URL filters */}
      <ItemsFilter categories={categories} />

      {/* Server-rendered product grid */}
      <ProductGrid
        products={result.products}
        totalCount={result.totalCount}
      />

      {/* Pagination (only when needed) */}
      {result.totalPages > 1 && (
        <Pagination
          currentPage={result.currentPage}
          totalPages={result.totalPages}
        />
      )}
    </div>
  );
}
