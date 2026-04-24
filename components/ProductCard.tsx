import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Product } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/items/${product.id}`} className="group h-full block">
      <Card className="h-full border-border/50 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col bg-card">
        <div className="w-full aspect-[4/3] bg-slate-50 overflow-hidden relative border-b border-border/50">
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
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100"
            >
              {product.category}
            </Badge>
            <span className="font-semibold text-lg text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <CardTitle className="text-xl group-hover:text-emerald-700 transition-colors">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 flex-grow">
          <p className="text-sm text-slate-500 line-clamp-2">
            {product.shortDesc}
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0 mt-auto">
          <Button className="w-full bg-slate-900 hover:bg-emerald-600 transition-colors">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
