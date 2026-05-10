import { AdminRoute } from "@/components/AdminRoute";
import AddProductForm from "@/components/AddProductForm";
import { getProductById } from "@/app/actions/products";
import { redirect } from "next/navigation";

export const metadata = { title: "Edit Item | OdysseyCart" };

export default async function EditItemPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    redirect("/items/manage");
  }

  return (
    <AdminRoute>
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 min-h-screen">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">
          Edit Product: {product.title}
        </h1>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <AddProductForm initialData={product} />
        </div>
      </div>
    </AdminRoute>
  );
}
