"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface FormTextAreaProps extends React.ComponentProps<typeof Textarea> {
  label: string;
  error?: string;
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ label, id, error, className, ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          {label}
        </label>
        <Textarea
          ref={ref}
          id={id}
          className={className}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

FormTextArea.displayName = "FormTextArea";
