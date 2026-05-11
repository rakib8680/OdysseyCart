"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct, updateProduct } from "@/app/actions/products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Define form field types
interface ProductFormData {
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
const inputStyles =
  "w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow";

const labelStyles = "block text-sm font-medium text-slate-700 mb-1";

interface ProductFormProps {
  initialData?: any;
}

// Helper to convert specs object to editable string: "Key: Value\nKey: Value"
function specsToString(specs: any): string {
  if (!specs || typeof specs !== "object") return "";
  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

// Helper to convert string back to specs object
function stringToSpecs(str: string): Record<string, string> {
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

export default function AddProductForm({ initialData }: ProductFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          shortDescription: initialData.shortDescription,
          fullDescription: initialData.fullDescription,
          price: initialData.price,
          category: initialData.category,
          stockQuantity: initialData.stockQuantity,
          images: initialData.images?.join(", "),
          brand: initialData.brand || "",
          tags: initialData.tags?.join(", ") || "",
          specs: specsToString(initialData.specs),
          discount: initialData.discount || 0,
          isFeatured: initialData.isFeatured || false,
          warranty: initialData.warranty || "",
          shippingInfo: initialData.shippingInfo || "Free Standard Shipping",
          weight: initialData.weight || 0,
          dimensionLength: initialData.dimensions?.length || 0,
          dimensionWidth: initialData.dimensions?.width || 0,
          dimensionHeight: initialData.dimensions?.height || 0,
        }
      : {
          shippingInfo: "Free Standard Shipping",
          discount: 0,
          weight: 0,
          dimensionLength: 0,
          dimensionWidth: 0,
          dimensionHeight: 0,
        },
  });

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      toast.error("You must be logged in to add a product.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform form data into the shape our schema expects
      const productData = {
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        price: Number(data.price),
        category: data.category,
        stockQuantity: Number(data.stockQuantity),
        images: data.images
          ? data.images
              .split(",")
              .map((url: string) => url.trim())
              .filter(Boolean)
          : [],
        createdBy: user.uid,

        // New fields
        brand: data.brand || "",
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],
        specs: stringToSpecs(data.specs || ""),
        discount: Number(data.discount) || 0,
        isFeatured: data.isFeatured || false,
        warranty: data.warranty || "",
        shippingInfo: data.shippingInfo || "Free Standard Shipping",
        weight: Number(data.weight) || 0,
        dimensions: {
          length: Number(data.dimensionLength) || 0,
          width: Number(data.dimensionWidth) || 0,
          height: Number(data.dimensionHeight) || 0,
        },
      };

      const result = isEditing
        ? await updateProduct(initialData._id, productData)
        : await createProduct(productData);

      if (result.success) {
        toast.success(
          `Product ${isEditing ? "updated" : "created"} successfully!`,
        );
        reset();
        router.refresh();
        router.push("/items/manage");
      } else {
        toast.error(
          result.error ||
            `Failed to ${isEditing ? "update" : "create"} product.`,
        );
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ===== SECTION: Basic Info ===== */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
            1
          </span>
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className={labelStyles}>Product Title</label>
            <input
              type="text"
              className={inputStyles}
              placeholder="e.g., Ergonomic Chair"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className={labelStyles}>Brand</label>
            <input
              type="text"
              className={inputStyles}
              placeholder="e.g., Apple, Sony, Nike"
              {...register("brand")}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelStyles}>Category</label>
            <select
              className={inputStyles}
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select Category</option>
              <option value="Tech">Tech</option>
              <option value="Furniture">Furniture</option>
              <option value="Accessories">Accessories</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div className="md:col-span-2">
            <label className={labelStyles}>Short Description (1-2 lines)</label>
            <input
              type="text"
              className={inputStyles}
              placeholder="Brief summary for the product card"
              {...register("shortDescription", {
                required: "Short description is required",
              })}
            />
            {errors.shortDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          {/* Full Description */}
          <div className="md:col-span-2">
            <label className={labelStyles}>Full Description</label>
            <textarea
              rows={4}
              className={inputStyles}
              placeholder="Detailed product description..."
              {...register("fullDescription", {
                required: "Full description is required",
              })}
            ></textarea>
            {errors.fullDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fullDescription.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="md:col-span-2">
            <label className={labelStyles}>Tags (comma separated)</label>
            <input
              type="text"
              className={inputStyles}
              placeholder="e.g., wireless, premium, 2024, bestseller"
              {...register("tags")}
            />
            <p className="text-slate-400 text-xs mt-1">
              Helps with search and &quot;related products&quot; matching.
            </p>
          </div>
        </div>
      </div>

      {/* ===== SECTION: Pricing & Inventory ===== */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
            2
          </span>
          Pricing & Inventory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price */}
          <div>
            <label className={labelStyles}>Price ($)</label>
            <input
              type="number"
              step="0.01"
              className={inputStyles}
              placeholder="0.00"
              {...register("price", {
                required: "Price is required",
                min: { value: 0.01, message: "Price must be greater than 0" },
              })}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Discount */}
          <div>
            <label className={labelStyles}>Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className={inputStyles}
              placeholder="0"
              {...register("discount", {
                min: { value: 0, message: "Cannot be negative" },
                max: { value: 100, message: "Cannot exceed 100%" },
              })}
            />
            {errors.discount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.discount.message}
              </p>
            )}
          </div>

          {/* Stock Quantity */}
          <div>
            <label className={labelStyles}>Stock Quantity</label>
            <input
              type="number"
              className={inputStyles}
              placeholder="0"
              {...register("stockQuantity", {
                required: "Stock quantity is required",
                min: { value: 0, message: "Cannot be negative" },
              })}
            />
            {errors.stockQuantity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.stockQuantity.message}
              </p>
            )}
          </div>

          {/* Featured Toggle */}
          <div className="md:col-span-3 flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              {...register("isFeatured")}
            />
            <label htmlFor="isFeatured" className="text-sm text-slate-700">
              <span className="font-medium">Featured Product</span> — Display
              this product on the landing page
            </label>
          </div>
        </div>
      </div>

      {/* ===== SECTION: Specs & Details ===== */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
            3
          </span>
          Specifications & Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Specs */}
          <div className="md:col-span-2">
            <label className={labelStyles}>
              Specifications (one per line, Key: Value)
            </label>
            <textarea
              rows={4}
              className={inputStyles}
              placeholder={`Material: Aluminum\nBattery Life: 20 hours\nConnectivity: Bluetooth 5.3\nWater Resistance: IPX4`}
              {...register("specs")}
            ></textarea>
            <p className="text-slate-400 text-xs mt-1">
              Each line should be in &quot;Key: Value&quot; format. These will
              appear as a specifications table on the detail page.
            </p>
          </div>

          {/* Weight */}
          <div>
            <label className={labelStyles}>Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              className={inputStyles}
              placeholder="0.00"
              {...register("weight", {
                min: { value: 0, message: "Cannot be negative" },
              })}
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className={labelStyles}>Dimensions (cm)</label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                step="0.1"
                className={inputStyles}
                placeholder="L"
                {...register("dimensionLength", {
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
              <input
                type="number"
                step="0.1"
                className={inputStyles}
                placeholder="W"
                {...register("dimensionWidth", {
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
              <input
                type="number"
                step="0.1"
                className={inputStyles}
                placeholder="H"
                {...register("dimensionHeight", {
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
            </div>
          </div>

          {/* Warranty */}
          <div>
            <label className={labelStyles}>Warranty</label>
            <input
              type="text"
              className={inputStyles}
              placeholder="e.g., 2 Year Manufacturer Warranty"
              {...register("warranty")}
            />
          </div>

          {/* Shipping Info */}
          <div>
            <label className={labelStyles}>Shipping Info</label>
            <input
              type="text"
              className={inputStyles}
              placeholder="e.g., Ships in 2-3 business days"
              {...register("shippingInfo")}
            />
          </div>
        </div>
      </div>

      {/* ===== SECTION: Media ===== */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
            4
          </span>
          Media
        </h2>
        <div>
          <label className={labelStyles}>Image URLs (comma separated)</label>
          <input
            type="text"
            className={inputStyles}
            placeholder="https://example.com/img1.jpg, https://..."
            {...register("images")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Publishing..."
            : isEditing
              ? "Update Product"
              : "Publish Product"}
        </button>
      </div>
    </form>
  );
}
