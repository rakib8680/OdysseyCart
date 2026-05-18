"use client";

import { useForm } from "react-hook-form";
import { TShippingForm, ShippingSchema } from "@/lib/validations/checkout";
import { FormInput } from "@/components/form/FormInput";

// ==========================================
// TYPES
// ==========================================
interface ShippingFormProps {
  defaultValues?: Partial<TShippingForm>;
  onComplete: (data: TShippingForm) => void;
}

// ==========================================
// SHIPPING FORM (Checkout Step 1)
// ==========================================
export function ShippingForm({ defaultValues, onComplete }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TShippingForm>({
    defaultValues: defaultValues || {},
  });

  const onSubmit = (data: TShippingForm) => {
    // Validate with Zod before passing up
    const result = ShippingSchema.safeParse(data);
    if (result.success) {
      onComplete(result.data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <FormInput
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email", { required: "Email is required" })}
      />

      {/* Full Name */}
      <FormInput
        label="Full Name"
        placeholder="John Doe"
        error={errors.fullName?.message}
        {...register("fullName", { required: "Full name is required" })}
      />

      {/* Address */}
      <FormInput
        label="Street Address"
        placeholder="123 Main Street, Apt 4B"
        error={errors.address?.message}
        {...register("address", { required: "Address is required" })}
      />

      {/* City + State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="City"
          placeholder="New York"
          error={errors.city?.message}
          {...register("city", { required: "City is required" })}
        />
        <FormInput
          label="State / Province"
          placeholder="NY"
          error={errors.state?.message}
          {...register("state", { required: "State is required" })}
        />
      </div>

      {/* ZIP + Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="ZIP / Postal Code"
          placeholder="10001"
          error={errors.zipCode?.message}
          {...register("zipCode", { required: "ZIP code is required" })}
        />
        <FormInput
          label="Country"
          placeholder="United States"
          error={errors.country?.message}
          {...register("country", { required: "Country is required" })}
        />
      </div>

      {/* Phone */}
      <FormInput
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
        error={errors.phone?.message}
        {...register("phone", { required: "Phone number is required" })}
      />

      {/* Submit */}
      <button
        type="submit"
        className="w-full h-12 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20 cursor-pointer"
      >
        Continue to Payment →
      </button>
    </form>
  );
}
