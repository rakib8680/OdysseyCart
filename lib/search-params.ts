import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

/**
 * Centralized search param parsers for the product listing page.
 * Defined ONCE here, reused by:
 *   - Server: `productFilterCache` in page.tsx
 *   - Client: `useQueryStates(productFilterParsers)` in ItemsFilter
 *
 * Adding a new filter = add one parser here + one Zod field + one UI control.
 */
export const productFilterParsers = {
  search: parseAsString.withDefault(""),
  category: parseAsString.withDefault(""),
  minPrice: parseAsString.withDefault(""),
  maxPrice: parseAsString.withDefault(""),
  sort: parseAsString.withDefault("newest"),
  page: parseAsInteger.withDefault(1),
};

/**
 * Server-side cache for reading search params in Server Components.
 * Usage in page.tsx:
 *   const params = productFilterCache.parse(await searchParams);
 */
export const productFilterCache = createSearchParamsCache(productFilterParsers);
