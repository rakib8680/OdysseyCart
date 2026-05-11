import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductFormData } from "./types";

interface BasicInfoSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  inputStyles: string;
  labelStyles: string;
}

export default function BasicInfoSection({
  register,
  errors,
  inputStyles,
  labelStyles,
}: BasicInfoSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
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
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Brand */}
        <div>
          <label className={labelStyles}>Brand</label>
          <input
            type="text"
            className={`${inputStyles} bg-white h-[52px]`}
            placeholder="e.g., Apple, Sony, Nike"
            {...register("brand")}
          />
        </div>

        {/* Category */}
        <div>
          <label className={labelStyles}>Category</label>
          <select
            className={`${inputStyles} bg-white h-[52px]`}
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
  );
}
