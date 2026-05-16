import { AdminRoute } from "@/components/AdminRoute";
import AddProductForm from "@/components/AddProductForm";

export const metadata = { title: "Add Item | OdysseyCart" };

export default function AddItemPage() {
  return (
    <AdminRoute>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 min-h-screen">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Add New Product
        </h1>
        <p className="text-slate-500 mb-10">
          Fill in the details below to list a new product in the store.
        </p>

        <AddProductForm />
      </div>
    </AdminRoute>
  );
}
