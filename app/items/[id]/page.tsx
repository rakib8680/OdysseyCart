import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/app/actions/products";
import ProductGallery from "@/components/product-details/ProductGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import KeyInformation from "@/components/product-details/KeyInformation";
import ProductSpecs from "@/components/product-details/ProductSpecs";
import RelatedProducts from "@/components/product-details/RelatedProducts";

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
        <ProductGallery product={product} />

        <div className="flex flex-col justify-start">
          <ProductInfo product={product} />
          <KeyInformation product={product} />
          <ProductSpecs specs={product.specs || {}} />

          <Button
            size="lg"
            className="w-full bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20 text-md h-14"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <RelatedProducts items={relatedItems} />
    </div>
  );
}
