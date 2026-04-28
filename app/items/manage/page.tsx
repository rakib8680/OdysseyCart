import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata = { title: "Manage Items | OdysseyCart" };

export default function ManageItemsPage() {
  return (
    <ProtectedRoute>
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

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium tracking-wider uppercase text-xs">
                <tr>
                  <th className="p-5">Product Name</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Placeholder rows */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-5 font-medium text-slate-900 border-l-4 border-transparent hover:border-emerald-500">
                    Odyssey Concept I
                  </td>
                  <td className="p-5 text-slate-500">Tech</td>
                  <td className="p-5">$299.00</td>
                  <td className="p-5">
                    <span className="inline-flex bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-100">
                      Active
                    </span>
                  </td>
                  <td className="p-5 text-right space-x-3">
                    <button className="font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                      View
                    </button>
                    <button className="font-semibold text-red-600 hover:text-red-800 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-5 font-medium text-slate-900 border-l-4 border-transparent hover:border-emerald-500">
                    Geometric Base
                  </td>
                  <td className="p-5 text-slate-500">Furniture</td>
                  <td className="p-5">$149.00</td>
                  <td className="p-5">
                    <span className="inline-flex bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200">
                      Draft
                    </span>
                  </td>
                  <td className="p-5 text-right space-x-3">
                    <button className="font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                      View
                    </button>
                    <button className="font-semibold text-red-600 hover:text-red-800 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-slate-500 text-xs flex justify-between items-center">
            <span>Showing 2 products</span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
