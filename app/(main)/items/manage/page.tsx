import Link from "next/link";
import { AdminRoute } from "@/components/AdminRoute";
import { getProducts } from "@/app/actions/products";
import ManageTable from "@/components/ManageTable";

export const metadata = { title: "Manage Items | OdysseyCart" };

export default async function ManageItemsPage() {
  const products = await getProducts();

  return (
    <AdminRoute>
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Manage Inventory
            </h1>
            <p className="text-slate-500 mt-1">
              View, edit, and delete your products.
            </p>
          </div>
          <Link
            href="/items/add"
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-600/20 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add Product
          </Link>
        </div>

        <ManageTable products={products} />
      </div>
    </AdminRoute>
  );
}
