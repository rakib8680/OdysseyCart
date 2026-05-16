"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, id, error, ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={`appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm transition-colors ${
            error
              ? "border-red-400 focus:ring-red-500 focus:border-red-500"
              : "border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
          }`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
