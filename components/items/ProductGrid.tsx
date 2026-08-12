import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types/product";
import Link from "next/link";

interface ProductGridProps {
  products: Product[];
  wishlistIds?: string[];
}

export function ProductGrid({ products, wishlistIds = [] }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-24 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-lg font-medium mb-2">No products found</p>
        <p className="text-sm">
          Try adjusting your filters or{" "}
          <Link href="/items" className="text-emerald-600 underline">
            view all products
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} wishlistIds={wishlistIds} />
      ))}
    </div>
  );
}
