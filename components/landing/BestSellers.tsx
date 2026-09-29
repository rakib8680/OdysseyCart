import { getBestSellers } from "@/lib/data/products";
import { ProductCarousel } from "@/components/landing/ProductCarousel";
import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * BestSellers Component (Server Component)
 *
 * Fetches top-performing catalog items sorted by popularity score
 * (numReviews * averageRating) and renders an interactive snap-scroll carousel.
 */
export async function BestSellers() {
  const products = await getBestSellers(8);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={`bg-white border-b border-slate-200/60 ${HOMEPAGE_TOKENS.sectionPadding}`}>
      <div className={HOMEPAGE_TOKENS.container}>
        <ProductCarousel
          products={products}
          title="Best Sellers"
          subtitle="Our most popular and highest-rated essentials, backed by verified customer reviews."
          action={{
            label: "View All",
            href: "/items?sort=popular",
          }}
        />
      </div>
    </section>
  );
}
