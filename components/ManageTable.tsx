"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/products";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
interface ManageTableProps {
  products: any[];
  onRefresh?: () => void;
}

export default function ManageTable({ products, onRefresh }: ManageTableProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setDeletingId(productToDelete.id);
    const id = productToDelete.id;
    const title = productToDelete.title;

    try {
      if (!user) {
        toast.error("You must be logged in.");
        return;
      }

      const result = await deleteProduct(id, user.uid);

      if (result.success) {
        toast.success(`"${title}" deleted successfully.`);
        if (onRefresh) {
          onRefresh();
        } else {
          router.refresh(); // Fallback for any legacy usages
        }
      } else {
        toast.error(result.error || "Failed to delete product.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-24 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-lg font-medium mb-2">No products yet</p>
        <p className="text-sm">
          Start by{" "}
          <Link
            href="/admin/products/add"
            className="text-emerald-600 underline"
          >
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
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11 font-semibold text-slate-500 pl-8"></TableHead>
              <TableHead className="h-11 font-semibold text-slate-500 pl-8">
                Product
              </TableHead>
              <TableHead className="h-11 font-semibold text-slate-500">
                Category
              </TableHead>
              <TableHead className="h-11 font-semibold text-slate-500">
                Price
              </TableHead>
              <TableHead className="h-11 font-semibold text-slate-500">
                Status
              </TableHead>
              <TableHead className="h-11 font-semibold text-slate-500 text-right pr-8">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product._id}>
                <TableCell className="pl-8">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-xl"
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
                      alt={product.title}
                      className="w-16 h-16 rounded-md"
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium text-slate-900 py-4 pl-8">
                  {product.title}
                </TableCell>
                <TableCell className="text-slate-500 py-4">
                  {product.category}
                </TableCell>
                <TableCell className="text-slate-600 font-medium py-4">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className="py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${
                      product.stockQuantity > 0
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stockQuantity > 0
                      ? `${product.stockQuantity} in stock`
                      : "Out of stock"}
                  </span>
                </TableCell>
                <TableCell className="text-right py-4 pr-8">
                  <div className="flex justify-end gap-3 transition-opacity">
                    <Link
                      href={`/items/${product._id}`}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                      title="View Product"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="sr-only">View</span>
                    </Link>
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit Product"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                    <button
                      onClick={() =>
                        setProductToDelete({
                          id: product._id,
                          title: product.title,
                        })
                      }
                      disabled={deletingId === product._id}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Delete Product"
                    >
                      {deletingId === product._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 text-slate-500 text-xs flex justify-between items-center">
        <span>Showing {products.length} products</span>
      </div>

      <DeleteConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={!!deletingId}
        itemName={productToDelete?.title}
        confirmLabel="Delete Product"
      />
    </div>
  );
}
