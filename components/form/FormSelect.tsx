"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: readonly string[] | string[];
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, id, error, className, options, children, ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={id}
          className={`w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 dark:focus:ring-slate-300 transition-colors ${
            className || ""
          }`}
          aria-invalid={!!error}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";
