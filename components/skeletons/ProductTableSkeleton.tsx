import { ManageTableSkeleton } from "./ManageTableSkeleton";

/**
 * Full page table skeleton for streaming routes (/admin/products/loading.tsx).
 * Delegates to unified ManageTableSkeleton with showHeader=true for zero CLS.
 */
export function ProductTableSkeleton() {
  return <ManageTableSkeleton showHeader={true} />;
}
