import type { Metadata } from "next";
import Link from "next/link";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProductById,
  getRelatedProducts,
} from "@/app/actions/products";
import ProductGallery from "@/components/product-details/ProductGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import KeyInformation from "@/components/product-details/KeyInformation";
import ProductSpecs from "@/components/product-details/ProductSpecs";
import RelatedProducts from "@/components/product-details/RelatedProducts";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { HeartButton } from "@/components/wishlist/HeartButton";

type PageProps = { params: Promise<{ slug: string }> };

// ==========================================
// DYNAMIC SEO METADATA
// ==========================================
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | OdysseyCart" };
  }

  return {
    title: `${product.title} | OdysseyCart`,
    description: product.shortDescription,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      url: `/items/${product.slug}`,
    },
    alternates: {
      canonical: `/items/${product.slug}`,
    },
  };
}

// ==========================================
// PRODUCT DETAIL PAGE
// ==========================================
export default async function ItemDetailsPage({ params }: PageProps) {
  const { slug: slugOrId } = await params;

  // 1. Primary lookup: try fetching by slug
  let product = await getProductBySlug(slugOrId);

  // 2. Legacy redirect guard: if not found by slug, check if param is a valid ObjectId
  if (!product && mongoose.Types.ObjectId.isValid(slugOrId)) {
    const productById = await getProductById(slugOrId);
    if (productById?.slug) {
      redirect(`/items/${productById.slug}`);
    }
  }

  // 3. Fallback to 404
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

          <div className="flex items-center gap-3 mt-8">
            <AddToCartButton
              product={product}
              className="flex-1 rounded-xl text-md h-14 shadow-lg hover:shadow-emerald-600/20"
            />
            <HeartButton
              productId={product._id}
              initialWishlisted={false}
              size="md"
            />
          </div>
        </div>
      </div>

      <ReviewSection product={product} />

      <RelatedProducts items={relatedItems} />
    </div>
  );
}
