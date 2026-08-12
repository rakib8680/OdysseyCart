import { getFilteredProducts, getCategories } from "@/app/actions/products";
import { CollectionHero } from "@/components/items/CollectionHero";
import { ItemsFilter } from "@/components/items/ItemsFilter";
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
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-6">
        {/* Editorial hero header */}
        <CollectionHero
          activeCategory={params.category || undefined}
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
      </div>
    </div>
  );
}
