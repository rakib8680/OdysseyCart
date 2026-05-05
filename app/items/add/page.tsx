import { AdminRoute } from "@/components/AdminRoute";
import AddProductForm from "@/components/AddProductForm";

export const metadata = { title: "Add Item | OdysseyCart" };

export default function AddItemPage() {
  return (
    <AdminRoute>
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 min-h-screen">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">
          Add New Product
        </h1>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <AddProductForm />
        </div>
      </div>
    </AdminRoute>
  );
}
