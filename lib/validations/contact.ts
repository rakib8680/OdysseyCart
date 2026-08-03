import { z } from "zod";

// ==========================================
// CONTACT SUPPORT VALIDATION SCHEMA
// ==========================================

export const SUPPORT_SUBJECTS = [
  "General Inquiry",
  "Order Status",
  "Returns & Exchanges",
  "Product Question",
  "Other",
] as const;

export type SupportSubject = (typeof SUPPORT_SUBJECTS)[number];

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  subject: z.enum(SUPPORT_SUBJECTS, {
    message: "Please select a valid inquiry topic",
  }),
  orderNumber: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val.length <= 30,
      "Order number cannot exceed 30 characters",
    ),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long")
    .max(1000, "Message cannot exceed 1,000 characters"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
