import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Tech Essentials",
    description: "Premium gadgets and gear to elevate your productivity.",
    href: "/items?category=Tech",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Modern Furniture",
    description: "Minimalist pieces designed for comfort and aesthetics.",
    href: "/items?category=Furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Daily Accessories",
    description: "Sleek add-ons to complete your everyday carry.",
    href: "/items?category=Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
  },
];

export function CategorySection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Curated Collections
            </h2>
            <p className="text-slate-500 text-lg">
              Explore our selection of meticulously crafted products designed
              for the modern professional.
            </p>
          </div>
          <Link
            href="/items"
            className="group hidden md:inline-flex items-center font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
          >
            View all categories
            <ArrowUpRight className="ml-2 w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex flex-col bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-8 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col flex-1 px-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {category.name}
                  </h3>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-10 md:hidden text-center">
          <Link
            href="/items"
            className="inline-flex items-center font-bold text-emerald-600 transition-colors"
          >
            View all categories
            <ArrowUpRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
