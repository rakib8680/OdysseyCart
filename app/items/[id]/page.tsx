import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export default async function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  const relatedItems = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 3);

  return (
    <div className="container max-w-6xl mx-auto px-4 md:px-8 py-16">
      <Link
        href="/items"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Gallery */}
        <div className="w-full aspect-square bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden mix-blend-multiply flex items-center justify-center p-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain rounded-xl mix-blend-multiply max-h-[500px]"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 border-emerald-100 w-fit mb-4 uppercase tracking-wider text-xs font-bold"
          >
            {product.category}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-medium text-slate-700 mb-6">
            ${product.price.toFixed(2)}
          </p>

          <div className="prose prose-slate text-slate-600 mb-8 leading-relaxed">
            <p>{product.fullDesc}</p>
          </div>

          <div className="space-y-4 mb-8 border-y border-slate-100 py-6">
            <h3 className="font-bold text-slate-900">Key Information</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex justify-between">
                <span className="font-medium text-slate-900">
                  Availability:
                </span>{" "}
                {product.status === "Active" ? "In Stock" : "Out of Stock"}
              </li>
              <li className="flex justify-between">
                <span className="font-medium text-slate-900">Shipping:</span>{" "}
                Free Standard Shipping
              </li>
            </ul>
          </div>

          <Button
            size="lg"
            className="w-full bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20 text-md h-14"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <div className="mt-24 pt-16 border-t border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedItems.map((item) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="group block"
              >
                <div className="aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden mb-4 border border-slate-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-500 text-sm">
                  ${item.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
