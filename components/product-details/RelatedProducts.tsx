import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types/product";

interface RelatedProductsProps {
  items: Product[];
}

export default function RelatedProducts({ items }: RelatedProductsProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">
        You might also like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
}
