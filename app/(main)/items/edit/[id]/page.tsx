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
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 min-h-screen">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Edit Product: {product.title}
        </h1>
        <p className="text-slate-500 mb-10">
          Update the product details below.
        </p>

        <AddProductForm initialData={product} />
      </div>
    </AdminRoute>
  );
}
