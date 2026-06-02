import Link from "next/link";
import ManageTable from "@/components/ManageTable";
import { getProducts } from "@/app/actions/products";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">
            View, edit, and delete your product catalog.
          </p>
        </div>
        <Link
          href="/admin/products/add"
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Product Table — reusing existing ManageTable component */}
      <ManageTable products={products} />
    </div>
  );
}
