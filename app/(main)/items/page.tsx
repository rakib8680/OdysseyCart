import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCatalog } from "@/components/items/ProductCatalog";
import { ItemsGridSkeleton } from "@/components/skeletons";
import { productFilterCache } from "@/lib/search-params";
import { constructMetadata } from "@/lib/utils/seo";
import { getViewModeServer } from "@/lib/utils/viewMode";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

// Dynamic SEO metadata generator synced with active URL filter state
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = productFilterCache.parse(await searchParams);

  let title = "All Products - Collection";
  let description =
    "Browse our full catalog of premium products, accessories, tech, and furniture on OdysseyCart.";

  if (params.category) {
    title = `${params.category} Collection`;
    description = `Explore our curated ${params.category} collection. Quality items with fast shipping and easy returns.`;
  } else if (params.search) {
    title = `Search: "${params.search}"`;
    description = `Search results for "${params.search}" on OdysseyCart. Discover matching top-rated products.`;
  }

  return constructMetadata({
    title,
    description,
    url: "/items",
  });
}

export default async function ItemsPage({ searchParams }: PageProps) {
  // Parse URL search params on the server using the shared cache
  const params = productFilterCache.parse(await searchParams);

  // Read view mode from cookie for zero-flash skeleton rendering
  const viewMode = await getViewModeServer();

  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-36">
        {/* Instant skeleton → streams ProductCatalog when DB queries complete */}
        <Suspense fallback={<ItemsGridSkeleton viewMode={viewMode} />}>
          <ProductCatalog params={params} />
        </Suspense>
      </div>
    </div>
  );
}
