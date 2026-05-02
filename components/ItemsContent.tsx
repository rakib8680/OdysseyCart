"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";

interface ItemsContentProps {
  products: any[];
}

function ItemsFilter({ products }: ItemsContentProps) {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(urlCategory || "All");

  // Sync category with URL param
  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory);
    }
  }, [urlCategory]);

  // Build categories dynamically from real data
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            Collection
          </h1>
          <p className="text-slate-500">
            Explore our premium selection of gear and accessories.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full sm:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="h-10 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
          No products found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function ItemsContent({ products }: ItemsContentProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          Loading collection...
        </div>
      }
    >
      <ItemsFilter products={products} />
    </Suspense>
  );
}
