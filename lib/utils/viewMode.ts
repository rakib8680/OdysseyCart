import { cookies } from "next/headers";
import { CATALOG_VIEW_MODE_STORAGE_KEY } from "@/lib/config/products";
import type { ViewMode } from "@/lib/types/product";

/**
 * Server-side helper to read and validate the catalog view mode preference ("grid" | "list") from HTTP cookies.
 * Guarantees type safety and provides a clean fallback to "grid" for zero-flash SSR and Suspense skeletons.
 */
export async function getViewModeServer(): Promise<ViewMode> {
  const cookieStore = await cookies();
  const val = cookieStore.get(CATALOG_VIEW_MODE_STORAGE_KEY)?.value;
  return val === "list" || val === "grid" ? val : "grid";
}
