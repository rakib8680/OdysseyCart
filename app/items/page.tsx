"use client";

import { useState } from "react";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_PRODUCTS } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function ItemsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          product.shortDesc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Collection</h1>
          <p className="text-slate-500">Explore our premium selection of gear and accessories.</p>
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
            className="h-10 px-3 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 text-slate-500">
           No products found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/items/${product.id}`} className="group h-full">
              <Card className="h-full border-border/50 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col bg-card">
                <div className="w-full aspect-[4/3] bg-slate-50 overflow-hidden relative border-b border-border/50">
                   <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
                   />
                </div>
                <CardHeader className="p-5 pb-3">
                  <div className="flex justify-between items-start mb-2">
                     <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100">{product.category}</Badge>
                     <span className="font-semibold text-lg text-slate-900">${product.price.toFixed(2)}</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-emerald-700 transition-colors">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 flex-grow">
                  <p className="text-sm text-slate-500 line-clamp-2">{product.shortDesc}</p>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  <Button className="w-full bg-slate-900 hover:bg-emerald-600 transition-colors">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
