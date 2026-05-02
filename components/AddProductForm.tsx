"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct } from "@/app/actions/products";
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
}

// Reusable input styles
const inputStyles =
  "w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow";

export default function AddProductForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      toast.error("You must be logged in to add a product.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform form data into the shape our schema expects
      const productData = {
        ...data,
        price: Number(data.price),
        stockQuantity: Number(data.stockQuantity),
        images: data.images
          ? data.images
              .split(",")
              .map((url: string) => url.trim())
              .filter(Boolean)
          : [],
        createdBy: user.uid,
      };

      const result = await createProduct(productData);

      if (result.success) {
        toast.success("Product created successfully!");
        reset();
        router.push("/items/manage");
      } else {
        toast.error(result.error || "Failed to create product.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Product Title
          </label>
          <input
            type="text"
            className={inputStyles}
            placeholder="e.g., Ergonomic Chair"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Short Description (1-2 lines)
          </label>
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
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Description
          </label>
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

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Price ($)
          </label>
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
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
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

        {/* Stock Quantity */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Stock Quantity
          </label>
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

        {/* Image URLs */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Image URLs (comma separated)
          </label>
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
          {isSubmitting ? "Publishing..." : "Publish Product"}
        </button>
      </div>
    </form>
  );
}
