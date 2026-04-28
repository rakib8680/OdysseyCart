import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/data";
import { EditorialCard } from "./EditorialCard";

export function FeaturedProducts() {
  const featured = MOCK_PRODUCTS.slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-8 mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Featured Edition
            </h2>
          </div>
          <Link
            href="/items"
            className="hidden sm:inline-flex items-center text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
          >
            View All Collection
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-16">
          {/* Main Massive Product (Spans 8 columns) */}
          <div className="md:col-span-8">
            <EditorialCard product={featured[0]} isLarge />
          </div>

          {/* Side Stacked Products (Spans 4 columns) */}
          <div className="md:col-span-4 flex flex-col gap-12">
            <EditorialCard product={featured[1]} />
            <EditorialCard product={featured[2]} />
          </div>
        </div>

        {/* Mobile View All */}
        <div className="mt-12 sm:hidden border-t border-slate-200 pt-8">
          <Link
            href="/items"
            className="flex items-center justify-center text-sm font-bold uppercase tracking-widest text-slate-900"
          >
            View All Collection
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
