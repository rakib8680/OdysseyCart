/**
 * Structured token representing an element in the pagination sequence.
 * Can be a numeric page number or a directional ellipsis.
 */
export type PaginationItem = number | "ellipsis-left" | "ellipsis-right";

export interface PaginationRangeOptions {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

/**
 * Pure helper to generate an array of numbers in the range [start, end].
 */
function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
}

/**
 * Deterministic sliding window pagination range generator.
 * Strictly guarantees at most (siblingCount * 2 + 5) items (7 items by default)
 * for any totalPages count from 1 to infinity.
 *
 * Matrix:
 * - totalPages <= 7: Returns [1, 2, ..., totalPages]
 * - Near start (page <= 4): [1, 2, 3, 4, 5, "ellipsis-right", totalPages]
 * - Near end (page >= totalPages - 3): [1, "ellipsis-left", totalPages - 4, ..., totalPages]
 * - Middle: [1, "ellipsis-left", page - 1, page, page + 1, "ellipsis-right", totalPages]
 */
export function getPaginationRange({
  currentPage,
  totalPages,
  siblingCount = 1,
}: PaginationRangeOptions): PaginationItem[] {
  // Boundary safety guard
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [1];

  const safeCurrent = Math.max(1, Math.min(currentPage, totalPages));

  // Total visible slots = 1 (first) + 1 (last) + 1 (current) + 2*siblingCount + 2 (two ellipses)
  // For siblingCount = 1: 1 + 1 + 1 + 2 + 2 = 7 slots
  const totalSlots = siblingCount * 2 + 5;

  // Case 1: If total pages is less than or equal to total slots, show all pages
  if (totalPages <= totalSlots) {
    return range(1, totalPages);
  }

  // Calculate left and right sibling boundaries
  const leftSiblingIndex = Math.max(safeCurrent - siblingCount, 1);
  const rightSiblingIndex = Math.min(safeCurrent + siblingCount, totalPages);

  // We show ellipsis if there are more than 1 page between boundary and sibling
  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  // Case 2: No left ellipsis, but right ellipsis (near start)
  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount; // 5 items when siblingCount = 1
    const leftRange = range(1, leftItemCount);
    return [...leftRange, "ellipsis-right", totalPages];
  }

  // Case 3: Left ellipsis, but no right ellipsis (near end)
  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount; // 5 items when siblingCount = 1
    const rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [1, "ellipsis-left", ...rightRange];
  }

  // Case 4: Both left and right ellipses (middle)
  const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  return [1, "ellipsis-left", ...middleRange, "ellipsis-right", totalPages];
}
