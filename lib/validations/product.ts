import { z } from "zod";

export const ProductValidationSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(200, "Short description is too long"),
  fullDescription: z.string().min(1, "Full description is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string()).default([]),
  stockQuantity: z.coerce
    .number()
    .min(0, "Stock quantity cannot be negative")
    .default(0),
  createdBy: z.string().min(1, "Creator ID is required"),
  brand: z.string().default(""),
  tags: z.array(z.string()).default([]),
  specs: z.record(z.string(), z.string()).default({}),
  discount: z.coerce.number().min(0).max(100).default(0),
  isFeatured: z.coerce.boolean().default(false),
  warranty: z.string().default(""),
  shippingInfo: z.string().default("Free Standard Shipping"),
  weight: z.coerce.number().min(0).default(0),
  dimensions: z
    .object({
      length: z.coerce.number().min(0).default(0),
      width: z.coerce.number().min(0).default(0),
      height: z.coerce.number().min(0).default(0),
    })
    .default({ length: 0, width: 0, height: 0 }),
});

export type ProductInput = z.infer<typeof ProductValidationSchema>;
