import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Product } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group h-full p-0 gap-0 border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col bg-white">
      <div className="w-full aspect-[4/3] bg-slate-50 overflow-hidden relative border-b border-slate-100">
        <img
          src={product.image}
          alt={product.name}
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
          <span className="font-semibold text-lg text-slate-900">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <CardTitle className="text-xl">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 flex-grow">
        <p className="text-sm text-slate-500 line-clamp-2">
          {product.shortDesc}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 mt-auto border-0 bg-white">
        <Link
          href={`/items/${product.id}`}
          className="w-full bg-slate-900 text-white hover:bg-emerald-600 transition-colors h-10 rounded-md flex items-center justify-center text-sm font-medium"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
