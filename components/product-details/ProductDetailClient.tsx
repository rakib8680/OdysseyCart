"use client";

import { useState } from "react";
import { Product, Variant } from "@/lib/types/product";
import ProductGallery from "@/components/product-details/ProductGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import VariantPicker from "@/components/product-details/VariantPicker";
import KeyInformation from "@/components/product-details/KeyInformation";
import ProductSpecs from "@/components/product-details/ProductSpecs";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { HeartButton } from "@/components/wishlist/HeartButton";

// ==========================================
// PROPS
// ==========================================
interface ProductDetailClientProps {
  product: Product;
}

// ==========================================
// CLIENT WRAPPER — Manages variant state
// between Gallery, VariantPicker, and AddToCart
// ==========================================
export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const hasVariants = product.variants && product.variants.length > 0;
  const activeImageIndex = selectedVariant?.imageIndex;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      <ProductGallery product={product} activeImageIndex={activeImageIndex} />

      <div className="flex flex-col justify-start">
        <ProductInfo product={product} selectedVariant={selectedVariant} />

        {/* Variant Picker — only rendered for products with variants */}
        {hasVariants && (
          <VariantPicker
            options={product.options}
            variants={product.variants}
            basePrice={product.price}
            onVariantChange={setSelectedVariant}
          />
        )}

        <KeyInformation product={product} />
        <ProductSpecs specs={product.specs || {}} />

        <div className="flex items-center gap-3 mt-8">
          <AddToCartButton
            product={product}
            selectedVariant={selectedVariant}
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
  );
}
