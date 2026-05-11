import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/app/actions/products";
import ProductCard from "@/components/ProductCard";
import { Shield, Truck, Weight, Ruler, Tag, Star, Package } from "lucide-react";

export default async function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  // Fetch related items (same category, exclude current)
  const allProducts = await getProducts();
  const relatedItems = allProducts
    .filter(
      (p: any) => p.category === product.category && p._id !== product._id,
    )
    .slice(0, 3);

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";

  // Calculate discounted price
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  // Parse specs (could be a Map or plain object)
  const specsEntries: [string, string][] = product.specs
    ? Object.entries(product.specs)
    : [];

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery */}
        <div className="sticky top-24">
          <div className="w-full aspect-square bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden mix-blend-multiply flex items-center justify-center p-8 relative">
            {/* Discount Badge */}feat(product): enrich product model with 9 new fields

- Added brand, tags, specs, discount, isFeatured, warranty,
  shippingInfo, weight, and dimensions to Product schema
- Updated Zod validation to cover all new fields with defaults
- Redesigned AddProductForm with 4 organized sections
- Rebuilt item detail page with specs table, discount badges,
  key info cards, brand labels, and tag chips
- Updated ProductCard to show discount badges and brand

            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full z-10">
                -{product.discount}% OFF
              </div>
            )}
            {/* Featured Badge */}
            {product.isFeatured && (
              <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 z-10">
                <Star className="w-3 h-3 fill-white" />
                Featured
              </div>
            )}
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-contain rounded-xl mix-blend-multiply max-h-[500px]"
            />
          </div>

          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.images.slice(0, 4).map((img: string, i: number) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-50 rounded-xl border border-slate-200 overflow-hidden p-2"
                >
                  <img
                    src={img}
                    alt={`${product.title} - ${i + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-start">
          {/* Brand & Category */}
          <div className="flex items-center gap-3 mb-4">
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase tracking-wider text-xs font-bold"
            >
              {product.category}
            </Badge>
            {product.brand && (
              <span className="text-sm font-medium text-slate-500">
                by{" "}
                <span className="text-slate-700 font-semibold">
                  {product.brand}
                </span>
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            {product.title}
          </h1>

          {/* Price Section */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-slate-900">
              ${discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-slate-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                Save ${(product.price - discountedPrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-slate text-slate-600 mb-8 leading-relaxed">
            <p>{product.fullDescription}</p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Key Information */}
          <div className="space-y-3 mb-8 border-y border-slate-100 py-6">
            <h3 className="font-bold text-slate-900 mb-4">Key Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Package className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Availability</p>
                  <p className="text-slate-500">
                    {product.stockQuantity > 0
                      ? `In Stock (${product.stockQuantity} units)`
                      : "Out of Stock"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Shipping</p>
                  <p className="text-slate-500">
                    {product.shippingInfo || "Free Standard Shipping"}
                  </p>
                </div>
              </div>

              {product.warranty && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Warranty</p>
                    <p className="text-slate-500">{product.warranty}</p>
                  </div>
                </div>
              )}

              {product.weight > 0 && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Weight className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Weight</p>
                    <p className="text-slate-500">{product.weight} kg</p>
                  </div>
                </div>
              )}

              {product.dimensions &&
                (product.dimensions.length > 0 ||
                  product.dimensions.width > 0 ||
                  product.dimensions.height > 0) && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Ruler className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Dimensions</p>
                      <p className="text-slate-500">
                        {product.dimensions.length} × {product.dimensions.width}{" "}
                        × {product.dimensions.height} cm
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Specifications Table */}
          {specsEntries.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-slate-900 mb-4">Specifications</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                {specsEntries.map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex justify-between px-4 py-3 text-sm ${
                      i % 2 === 0 ? "bg-slate-50" : "bg-white"
                    }`}
                  >
                    <span className="font-medium text-slate-700">{key}</span>
                    <span className="text-slate-500">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            {relatedItems.map((item: any) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
