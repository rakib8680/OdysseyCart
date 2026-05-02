import { getProducts } from "@/app/actions/products";
import ItemsContent from "@/components/ItemsContent";

export const metadata = { title: "Collection | OdysseyCart" };

export default async function ItemsPage() {
  const products = await getProducts();

  return <ItemsContent products={products} />;
}
