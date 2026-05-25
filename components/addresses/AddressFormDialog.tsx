"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TAddressForm, AddressSchema } from "@/lib/validations/checkout";
import { FormInput } from "@/components/form/FormInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { z } from "zod";

// ==========================================
// TYPES
// ==========================================

/** Extended schema that includes the label field */
const FormSchema = AddressSchema.extend({
  label: z.string().min(1, { message: "Label is required." }),
});

type TFormData = z.infer<typeof FormSchema>;

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TAddressForm, label: string) => void;
  /** Pass existing address data for edit mode */
  defaultValues?: TAddressForm & { label: string };
  isSaving: boolean;
}

// ==========================================
// COMPONENT
// ==========================================

/**
 * Centered dialog with address form fields.
 * Supports "Add" and "Edit" modes via defaultValues prop.
 * Reuses FormInput + AddressSchema for consistent validation.
 */
export function AddressFormDialog({
  open,
  onOpenChange,
  onSave,
  defaultValues,
  isSaving,
}: AddressFormDialogProps) {
  const isEditing = !!defaultValues;
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormData>({
    defaultValues: defaultValues || { label: "Home" },
  });

  // Reset form when dialog opens/closes or defaultValues change
  useEffect(() => {
    if (open) {
      reset(defaultValues || { label: "Home" });
      setValidationErrors({});
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: TFormData) => {
    // Validate with Zod before passing up (consistent with ShippingForm pattern)
    const result = FormSchema.safeParse(data);

    if (result.success) {
      const { label, ...addressData } = result.data;
      setValidationErrors({});
      onSave(addressData, label);
    } else {
      // Map Zod errors to field-level messages
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setValidationErrors(fieldErrors);
    }
  };

  // Helper: get error message for a field (react-hook-form OR zod)
  const getError = (field: keyof TFormData) =>
    errors[field]?.message || validationErrors[field];

  return (
    <Dialog open={open} onOpenChange={(v) => !isSaving && onOpenChange(v)}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            {isEditing ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {isEditing
              ? "Update the details for this saved address."
              : "Add a new shipping address to your account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Label */}
          <FormInput
            label="Address Label"
            id="addr-label"
            placeholder="e.g. Home, Office, Mom's House"
            error={getError("label")}
            {...register("label")}
          />

          {/* Full Name */}
          <FormInput
            label="Full Name"
            id="addr-fullName"
            placeholder="John Doe"
            error={getError("fullName")}
            {...register("fullName")}
          />

          {/* Street Address */}
          <FormInput
            label="Street Address"
            id="addr-address"
            placeholder="123 Main Street, Apt 4B"
            error={getError("address")}
            {...register("address")}
          />

          {/* City + State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="City"
              id="addr-city"
              placeholder="New York"
              error={getError("city")}
              {...register("city")}
            />
            <FormInput
              label="State / Province"
              id="addr-state"
              placeholder="NY"
              error={getError("state")}
              {...register("state")}
            />
          </div>

          {/* ZIP + Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="ZIP / Postal Code"
              id="addr-zipCode"
              placeholder="10001"
              error={getError("zipCode")}
              {...register("zipCode")}
            />
            <FormInput
              label="Country"
              id="addr-country"
              placeholder="United States"
              error={getError("country")}
              {...register("country")}
            />
          </div>

          {/* Phone */}
          <FormInput
            label="Phone Number"
            id="addr-phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            error={getError("phone")}
            {...register("phone")}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Address"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
