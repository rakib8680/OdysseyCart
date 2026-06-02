import AddProductForm from "@/components/AddProductForm";

export default function AdminAddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
        <p className="text-sm text-slate-500">
          Fill in the details below to list a new product in the store.
        </p>
      </div>

      <AddProductForm />
    </div>
  );
}
