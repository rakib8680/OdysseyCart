import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount! / 100)
    : product.price;

  return (
    <Card className="group h-full p-0 gap-0 border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col bg-white">
      <div className="w-full aspect-[4/3] bg-slate-50 overflow-hidden relative border-b border-slate-100">
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
            -{product.discount}%
          </div>
        )}
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 border-emerald-100"
          >
            {product.category}
          </Badge>
          <div className="text-right">
            <span className="font-semibold text-lg text-slate-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="block text-xs text-slate-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        {product.brand && (
          <p className="text-xs text-slate-400 font-medium mb-1">
            {product.brand}
          </p>
        )}
        <CardTitle className="text-xl">{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 flex-grow">
        <p className="text-sm text-slate-500 line-clamp-2">
          {product.shortDescription}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto border-0 bg-white">
        <Link
          href={`/items/${product._id}`}
          className="w-full bg-slate-900 text-white hover:bg-emerald-600 transition-colors h-10 rounded-md flex items-center justify-center text-sm font-medium"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
