import { CategoriesDirectorySkeleton } from "@/components/skeletons";

/**
 * Categories Loading Shell
 *
 * Dedicated App Router loading boundary for the `/categories` directory.
 * Renders instant 0ms skeleton to eliminate Cumulative Layout Shift (CLS).
 */
export default function CategoriesLoading() {
  return <CategoriesDirectorySkeleton />;
}
