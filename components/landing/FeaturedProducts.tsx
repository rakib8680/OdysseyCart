import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialCard } from "./EditorialCard";
import { getFeaturedProducts } from "@/lib/data/products";

export async function FeaturedProducts() {
  const featured = await getFeaturedProducts(3);

  // Don't render the section if there are no featured products
  if (!featured || featured.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-5 mb-8 sm:pb-8 sm:mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Featured Edition
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">
              Curated architectural pieces engineered for elevated modern living.
            </p>
          </div>
          <Link
            href="/items"
            className="hidden sm:inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-emerald-600 transition-colors"
          >
            <span>View All Collection</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 sm:gap-y-12 md:gap-y-16">
          {/* Main Massive Product (Spans 8 columns) */}
          <div className="md:col-span-8">
            <EditorialCard product={featured[0]} isLarge />
          </div>

          {/* Side Stacked Products (Spans 4 columns) */}
          {featured.length > 1 && (
            <div className="md:col-span-4 flex flex-col gap-8 sm:gap-12">
              {featured[1] && <EditorialCard product={featured[1]} />}
              {featured[2] && <EditorialCard product={featured[2]} />}
            </div>
          )}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 sm:hidden border-t border-slate-200 pt-6">
          <Link
            href="/items"
            className="flex items-center justify-center text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-emerald-600 transition-colors"
          >
            <span>View All Collection</span>
            <ArrowRight className="ml-2 w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
