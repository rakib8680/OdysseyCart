"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { Product } from "@/lib/types/product";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const defaultImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";

  const [selectedImage, setSelectedImage] = useState(defaultImage);

  const hasDiscount = product.discount > 0;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="w-full aspect-square bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden mix-blend-multiply flex items-center justify-center p-8 relative">
        {/* Discount Badge */}
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
          src={selectedImage}
          alt={product.title}
          className="w-full h-full object-contain rounded-xl mix-blend-multiply max-h-[500px] transition-opacity duration-300"
        />
      </div>

      {/* Additional Images */}
      {product.images && product.images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {product.images.slice(0, 4).map((img: string, i: number) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`aspect-square bg-slate-50 rounded-xl border overflow-hidden p-2 transition-all cursor-pointer ${
                selectedImage === img
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <img
                src={img}
                alt={`${product.title} - ${i + 1}`}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
