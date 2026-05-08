import { Suspense } from "react";
import { getProducts } from "@/app/actions/products";
import { ItemsFilter } from "@/components/items/ItemsFilter";

export const metadata = { title: "Collection | OdysseyCart" };

export default async function ItemsPage() {
  const products = await getProducts();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          Loading collection...
        </div>
      }
    >
      <ItemsFilter products={products} />
    </Suspense>
  );
}
