import type { Metadata } from "next";
import mongoose from "mongoose";
import { redirect, notFound } from "next/navigation";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import {
  getProductBySlug,
  getProductById,
  getRelatedProducts,
} from "@/app/actions/products";
import ProductDetailClient from "@/components/product-details/ProductDetailClient";
import RelatedProducts from "@/components/product-details/RelatedProducts";
import { BackButton } from "@/components/ui/BackButton";
import { constructMetadata } from "@/lib/utils/seo";

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
    return constructMetadata({ title: "Product Not Found" });
  }

  return constructMetadata({
    title: product.title,
    description: product.shortDescription,
    image: product.images?.[0],
    url: `/items/${product.slug}`,
  });
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

  // Fetch related items — filtered and limited at the DB level (4 items for full-width grid)
  const relatedItems = await getRelatedProducts(
    product.category,
    product._id,
    4,
  );

  return (
    <div className="container max-w-6xl mx-auto px-4 md:px-8 py-16">
      <BackButton label="Back to Collection" fallbackHref="/items" />

      <ProductDetailClient product={product} />

      <ReviewSection product={product} />

      <RelatedProducts items={relatedItems} />
    </div>
  );
}
