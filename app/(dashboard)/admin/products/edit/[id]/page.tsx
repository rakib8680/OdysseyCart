import AddProductForm from "@/components/AddProductForm";
import { getProductById } from "@/app/actions/products";
import { redirect } from "next/navigation";

export default async function AdminEditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Edit: {product.title}
        </h1>
        <p className="text-sm text-slate-500">
          Update the product details below.
        </p>
      </div>

      <AddProductForm initialData={product} />
    </div>
  );
}
