// Shared form field types used by AddProductForm and all section components.
export interface ProductFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string;
  brand: string;
  tags: string;
  specs: string;
  discount: number;
  isFeatured: boolean;
  warranty: string;
  shippingInfo: string;
  weight: number;
  dimensionLength: number;
  dimensionWidth: number;
  dimensionHeight: number;
}

// Reusable input styles
export const inputStyles =
  "w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow";

export const labelStyles = "block text-sm font-medium text-slate-700 mb-1";

// Helper to convert specs object to editable string: "Key: Value\nKey: Value"
export function specsToString(specs: any): string {
  if (!specs || typeof specs !== "object") return "";
  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

// Helper to convert string back to specs object
export function stringToSpecs(str: string): Record<string, string> {
  if (!str.trim()) return {};
  const result: Record<string, string> = {};
  str.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      result[key.trim()] = valueParts.join(":").trim();
    }
  });
  return result;
}
