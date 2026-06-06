import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/app/actions/products";
import ProductGallery from "@/components/product-details/ProductGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import KeyInformation from "@/components/product-details/KeyInformation";
import ProductSpecs from "@/components/product-details/ProductSpecs";
import RelatedProducts from "@/components/product-details/RelatedProducts";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

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

  // Fetch related items — filtered and limited at the DB level
  const relatedItems = await getRelatedProducts(product.category, product._id);

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

          <AddToCartButton
            product={product}
            className="w-full rounded-xl text-md h-14 mt-8 shadow-lg hover:shadow-emerald-600/20"
          />
        </div>
      </div>

      <RelatedProducts items={relatedItems} />
    </div>
  );
}
