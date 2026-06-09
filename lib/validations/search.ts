import { z } from "zod";

/**
 * Server-side validation schema for product search/filter params.
 * Ensures all filter values are sanitized before hitting MongoDB.
 */
export const SearchFiltersSchema = z.object({
  search: z.string().max(100).default(""),
  category: z.string().max(50).default(""),
  minPrice: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional(),
  ),
  maxPrice: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional(),
  ),
  sort: z
    .enum(["newest", "oldest", "price-low", "price-high", "name-az", "name-za"])
    .default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
