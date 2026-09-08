"use client";

import { useState, useEffect } from "react";
import { Product, Variant } from "@/lib/types/product";
import ProductGallery from "@/components/product-details/ProductGallery";
import ProductInfo from "@/components/product-details/ProductInfo";
import VariantPicker from "@/components/product-details/VariantPicker";
import KeyInformation from "@/components/product-details/KeyInformation";
import ProductSpecs from "@/components/product-details/ProductSpecs";
import { QuantitySelector } from "@/components/product-details/QuantitySelector";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { HeartButton } from "@/components/wishlist/HeartButton";
import { ProductTrustBadges } from "@/components/product-details/ProductTrustBadges";
import { useWishlistIds } from "@/hooks/useWishlistIds";
import { useProductInventory } from "@/hooks/cart/useProductInventory";

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
  const [quantity, setQuantity] = useState(1);
  const wishlistIds = useWishlistIds();
  const inventory = useProductInventory(product, selectedVariant);

  // Instant scroll-to-top guarantee on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const activeImageIndex = selectedVariant?.imageIndex;

  // Reactively clamp quantity to remaining available inventory (SSOT with cart)
  useEffect(() => {
    if (inventory.availableToAdd > 0) {
      if (quantity > inventory.availableToAdd) {
        setQuantity(inventory.availableToAdd);
      } else if (quantity < 1) {
        setQuantity(1);
      }
    } else {
      setQuantity(1);
    }
  }, [inventory.availableToAdd, quantity]);

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

        {/* Purchase Action Dock: Quantity Stepper + Add to Cart + Wishlist */}
        <div className="mt-8">
          <div className="flex items-center gap-3">
            <QuantitySelector
              quantity={inventory.availableToAdd > 0 ? quantity : 0}
              onChange={setQuantity}
              max={inventory.availableToAdd}
              disabled={
                inventory.needsVariantSelection ||
                inventory.isOutOfStock ||
                inventory.isMaxInCart
              }
              className="shrink-0"
            />
            <AddToCartButton
              product={product}
              selectedVariant={selectedVariant}
              quantity={quantity}
              className="flex-1 rounded-xl text-md h-12 shadow-lg hover:shadow-emerald-600/20"
            />
            <HeartButton
              productId={product._id}
              initialWishlisted={wishlistIds.includes(product._id)}
              size="md"
            />
          </div>

          {/* Real-time Cart Awareness Feedback */}
          {inventory.inCart > 0 && (
            <p className="text-xs text-slate-500 mt-2.5 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>
                {inventory.inCart} currently in your cart
                {inventory.availableToAdd > 0
                  ? ` (${inventory.availableToAdd} more available)`
                  : " (maximum limit reached)"}
              </span>
            </p>
          )}

          {/* 4-Pillar Trust Guarantee Ribbon */}
          <ProductTrustBadges
            warranty={product.warranty}
            shippingInfo={product.shippingInfo}
            className="mt-6"
          />
        </div>
      </div>
    </div>
  );
}
