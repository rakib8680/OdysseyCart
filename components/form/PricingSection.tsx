import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductFormData } from "./types";

interface PricingSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  inputStyles: string;
  labelStyles: string;
}

export default function PricingSection({
  register,
  errors,
  inputStyles,
  labelStyles,
}: PricingSectionProps) {
  return (
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
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
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
            <span className="font-medium">Featured Product</span> — Display this
            product on the landing page
          </label>
        </div>
      </div>
    </div>
  );
}
