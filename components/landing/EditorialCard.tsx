import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Product } from "@/lib/data";

interface EditorialCardProps {
  product: Product;
  isLarge?: boolean;
}

export function EditorialCard({ product, isLarge }: EditorialCardProps) {
  return (
    <Link
      href={`/items/${product.id}`}
      className="group flex flex-col h-full w-full"
    >
      {/* Image Container - Borderless and clean */}
      <div
        className={`relative w-full ${
          isLarge ? "aspect-[4/3] md:aspect-[16/9]" : "aspect-[4/3]"
        } bg-slate-100 rounded-2xl overflow-hidden mb-6`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-slate-900 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Typography - Minimalist, no borders */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex justify-between items-start mb-2">
          <h3
            className={`font-bold text-slate-900 ${
              isLarge ? "text-2xl md:text-3xl" : "text-xl"
            }`}
          >
            {product.name}
          </h3>
          <span
            className={`font-medium text-slate-500 ${
              isLarge ? "text-xl" : "text-lg"
            }`}
          >
            ${product.price.toFixed(2)}
          </span>
        </div>

        {isLarge && (
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mb-6 line-clamp-2">
            {product.shortDesc}
          </p>
        )}

        <div className="mt-auto flex items-center text-sm font-bold text-emerald-600 uppercase tracking-wide">
          <span className="group-hover:text-emerald-700 transition-colors">
            Discover
          </span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
