import AddProductForm from "@/components/AddProductForm";

export default function AdminAddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Add New Product
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
          Fill in the details below to list a new product in the store.
        </p>
      </div>

      <AddProductForm />
    </div>
  );
}
