import { getNewArrivals } from "@/lib/data/products";
import { ProductCarousel } from "@/components/landing/ProductCarousel";
import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * NewArrivals Component (Server Component)
 *
 * Fetches recent catalog additions via getNewArrivals() and renders
 * an interactive horizontal snap-scroll runway using ProductCarousel.
 */
export async function NewArrivals() {
  const products = await getNewArrivals(8);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={`bg-slate-50/60 border-b border-slate-200/60 ${HOMEPAGE_TOKENS.sectionPadding} overflow-hidden`}>
      <div className={HOMEPAGE_TOKENS.container}>
        <ProductCarousel
          products={products}
          title="New Arrivals"
          subtitle="The latest additions to our architectural and design collection, curated for modern spaces."
          action={{
            label: "View All",
            href: "/items?sort=newest",
          }}
        />
      </div>
    </section>
  );
}
