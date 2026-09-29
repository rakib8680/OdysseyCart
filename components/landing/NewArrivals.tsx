import { getNewArrivals } from "@/lib/data/products";
import { NewArrivalsCarousel } from "./NewArrivalsCarousel";

/**
 * NewArrivals Component (Server Component)
 *
 * Fetches recent catalog additions via getNewArrivals() and renders
 * an interactive horizontal snap-scroll runway using ProductCard.
 */
export async function NewArrivals() {
  const products = await getNewArrivals(8);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-slate-50/60 border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewArrivalsCarousel products={products} />
      </div>
    </section>
  );
}
