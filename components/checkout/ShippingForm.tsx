"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TShippingForm, ShippingSchema } from "@/lib/validations/checkout";
import { FormInput } from "@/components/form/FormInput";

// ==========================================
// TYPES
// ==========================================
interface ShippingFormProps {
  defaultValues?: Partial<TShippingForm>;
  onComplete: (
    data: TShippingForm,
    saveAddressInfo?: { label: string },
  ) => void;
  showSaveOption?: boolean;
}

// ==========================================
// SHIPPING FORM (Checkout Step 1)
// ==========================================
export function ShippingForm({
  defaultValues,
  onComplete,
  showSaveOption = true,
}: ShippingFormProps) {
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TShippingForm>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: defaultValues || {},
  });

  // Reset form when defaultValues change (e.g. user selected a saved address)
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = (data: TShippingForm) => {
    // Data is already validated by zodResolver at this point
    onComplete(
      data,
      saveAddress && showSaveOption ? { label: addressLabel } : undefined,
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <FormInput
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Full Name */}
      <FormInput
        label="Full Name"
        placeholder="John Doe"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      {/* Address */}
      <FormInput
        label="Street Address"
        placeholder="123 Main Street, Apt 4B"
        error={errors.address?.message}
        {...register("address")}
      />

      {/* City + State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="City"
          placeholder="New York"
          error={errors.city?.message}
          {...register("city")}
        />
        <FormInput
          label="State / Province"
          placeholder="NY"
          error={errors.state?.message}
          {...register("state")}
        />
      </div>

      {/* ZIP + Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="ZIP / Postal Code"
          placeholder="10001"
          error={errors.zipCode?.message}
          {...register("zipCode")}
        />
        <FormInput
          label="Country"
          placeholder="United States"
          error={errors.country?.message}
          {...register("country")}
        />
      </div>

      {/* Phone */}
      <FormInput
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
        error={errors.phone?.message}
        {...register("phone")}
      />

      {/* Save Address Toggle */}
      {showSaveOption && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveAddress"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label
              htmlFor="saveAddress"
              className="text-sm font-semibold text-slate-900 cursor-pointer"
            >
              Save this address for next time
            </label>
          </div>

          {saveAddress && (
            <div className="pl-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address Label
              </label>
              <input
                type="text"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
                placeholder="e.g. Home, Office"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          )}
        </div>
      )}

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
