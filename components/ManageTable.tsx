"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/products";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ManageTableProps {
  products: any[];
}

export default function ManageTable({ products }: ManageTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmed) return;

    setDeletingId(id);

    try {
      const result = await deleteProduct(id);

      if (result.success) {
        toast.success(`"${title}" deleted successfully.`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete product.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-24 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-lg font-medium mb-2">No products yet</p>
        <p className="text-sm">
          Start by{" "}
          <Link href="/items/add" className="text-emerald-600 underline">
            adding your first product
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium tracking-wider uppercase text-xs">
            <tr>
              <th className="p-5">Product Name</th>
              <th className="p-5">Category</th>
              <th className="p-5">Price</th>
              <th className="p-5">Stock</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {products.map((product: any) => (
              <tr
                key={product._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="p-5 font-medium text-slate-900 border-l-4 border-transparent hover:border-emerald-500">
                  {product.title}
                </td>
                <td className="p-5 text-slate-500">{product.category}</td>
                <td className="p-5">${product.price.toFixed(2)}</td>
                <td className="p-5">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      product.stockQuantity > 0
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {product.stockQuantity > 0
                      ? `${product.stockQuantity} in stock`
                      : "Out of stock"}
                  </span>
                </td>
                <td className="p-5 text-right space-x-3">
                  <Link
                    href={`/items/${product._id}`}
                    className="font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id, product.title)}
                    disabled={deletingId === product._id}
                    className="font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                  >
                    {deletingId === product._id ? (
                      <Loader2 className="w-4 h-4 animate-spin inline" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-slate-500 text-xs flex justify-between items-center">
        <span>Showing {products.length} products</span>
      </div>
    </div>
  );
}
