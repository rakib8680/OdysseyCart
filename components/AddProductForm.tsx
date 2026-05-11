"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct, updateProduct } from "@/app/actions/products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import BasicInfoSection from "@/components/form/BasicInfoSection";
import PricingSection from "@/components/form/PricingSection";
import SpecsSection from "@/components/form/SpecsSection";
import {
  ProductFormData,
  inputStyles,
  labelStyles,
  specsToString,
  stringToSpecs,
} from "@/components/form/types";

interface ProductFormProps {
  initialData?: any;
}

export default function AddProductForm({ initialData }: ProductFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialData;

  //form state
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

  //submit handler
  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      toast.error("You must be logged in to add a product.");
      return;
    }

    setIsSubmitting(true);

    try {
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
      <BasicInfoSection
        register={register}
        errors={errors}
        inputStyles={inputStyles}
        labelStyles={labelStyles}
      />

      <PricingSection
        register={register}
        errors={errors}
        inputStyles={inputStyles}
        labelStyles={labelStyles}
      />

      <SpecsSection
        register={register}
        inputStyles={inputStyles}
        labelStyles={labelStyles}
      />

      {/* Media Section */}
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
