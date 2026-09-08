"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sliders,
  FileText,
  Truck,
  Tag,
  ShieldCheck,
  RotateCcw,
  Package,
} from "lucide-react";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";

interface ProductAccordionsProps {
  product: Product;
  className?: string;
}

/**
 * ProductAccordions Component.
 * Progressive disclosure drawers for Technical Specifications, Product Story & Highlights,
 * and Shipping & Returns policies. Keeps the Buy Box compact and above the fold while
 * providing smooth, 60fps accessible disclosure.
 */
export function ProductAccordions({
  product,
  className,
}: ProductAccordionsProps) {
  // Multi-expand state: defaults to having "specs" open on mount
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["specs"]),
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Compile specifications
  const specsEntries = Object.entries(product.specs || {});
  const hasDimensions =
    product.dimensions &&
    (product.dimensions.length > 0 ||
      product.dimensions.width > 0 ||
      product.dimensions.height > 0);
  const hasWeight = product.weight && product.weight > 0;

  const sections = [
    {
      id: "specs",
      title: "Specifications & Dimensions",
      icon: Sliders,
      content: (
        <div className="space-y-3 pt-1 pb-4">
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/50 px-4">
            {/* Category */}
            <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
              <span className="font-medium text-slate-500">Category</span>
              <span className="font-semibold text-slate-900 capitalize">
                {product.category}
              </span>
            </div>

            {/* Brand */}
            {product.brand && (
              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="font-medium text-slate-500">Brand</span>
                <span className="font-semibold text-slate-900">
                  {product.brand}
                </span>
              </div>
            )}

            {/* Dimensions */}
            {hasDimensions && (
              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="font-medium text-slate-500">Dimensions</span>
                <span className="font-semibold text-slate-900">
                  {product.dimensions.length} × {product.dimensions.width} ×{" "}
                  {product.dimensions.height} cm
                </span>
              </div>
            )}

            {/* Weight */}
            {hasWeight && (
              <div className="flex items-center justify-between py-2.5 text-xs sm:text-sm">
                <span className="font-medium text-slate-500">Weight</span>
                <span className="font-semibold text-slate-900">
                  {product.weight} kg
                </span>
              </div>
            )}

            {/* Custom Specs from Product Model */}
            {specsEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2.5 text-xs sm:text-sm"
              >
                <span className="font-medium text-slate-500">{key}</span>
                <span className="font-semibold text-slate-900 text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "story",
      title: "Product Story & Highlights",
      icon: FileText,
      content: (
        <div className="space-y-4 pt-1 pb-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.fullDescription}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-700 mb-2">
                Related Topics & Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping, Returns & Warranty",
      icon: Truck,
      content: (
        <div className="space-y-3 pt-1 pb-4">
          <div className="grid grid-cols-1 gap-2.5">
            {/* Delivery Info */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <Package className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-semibold text-slate-900">
                  {product.shippingInfo || "Fast & Tracked Delivery"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Orders placed before 2 PM EST dispatch same business day.
                  Real-time tracking number provided upon fulfillment.
                </p>
              </div>
            </div>

            {/* Returns Policy */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <RotateCcw className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-semibold text-slate-900">
                  30-Day Hassle-Free Returns
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Return in original condition within 30 days for a full refund
                  or easy exchange. Return shipping label included.
                </p>
              </div>
            </div>

            {/* Warranty Coverage */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-semibold text-slate-900">
                  {product.warranty
                    ? `Official ${product.warranty}`
                    : "2-Year Quality Protection"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Guaranteed against manufacturer defects with access to 24/7
                  priority support.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      role="region"
      aria-label="Detailed product specifications and policies"
      className={cn(
        "divide-y divide-slate-200/80 border-y border-slate-200/80",
        className,
      )}
    >
      {sections.map((section) => {
        const isOpen = openSections.has(section.id);
        const Icon = section.icon;

        return (
          <div key={section.id} className="group">
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${section.id}`}
              id={`accordion-header-${section.id}`}
              className="w-full flex items-center justify-between py-4 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {section.title}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 group-hover:text-slate-700",
                  isOpen && "rotate-180 text-emerald-600",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${section.id}`}
                  role="region"
                  aria-labelledby={`accordion-header-${section.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  {section.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
