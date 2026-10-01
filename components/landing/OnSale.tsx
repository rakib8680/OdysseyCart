import { getOnSaleProducts } from "@/lib/data/products";
import ProductCard from "@/components/ProductCard";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

/**
 * OnSale Component (Server Component)
 *
 * Queries products with active discounts (discount > 0) sorted by
 * savings percentage descending, and renders a high-density commercial deals grid.
 */
export async function OnSale() {
  const products = await getOnSaleProducts(8);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section
      className={`bg-slate-50/70 border-b border-slate-200/60 ${HOMEPAGE_TOKENS.sectionPadding}`}
    >
      <div className={HOMEPAGE_TOKENS.container}>
        <SectionHeader
          title="On Sale"
          subtitle="Save on top-rated architectural tech, furniture, and everyday essentials."
          action={{
            label: "View All Deals",
            href: "/items?sort=discount",
          }}
        />

        {/* 4-Column Responsive Deals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              showMobileAction={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
