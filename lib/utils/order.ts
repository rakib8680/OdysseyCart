// ============================================================================
// ORDER FORMATTING UTILITIES (SSOT)
// ============================================================================

/**
 * Formats a raw MongoDB order ObjectId or string ID into a customer-friendly
 * short display code.
 *
 * @example
 * formatOrderId("65f123456789abcdef123456") // "#OD-123456"
 */
export function formatOrderId(id: string): string {
  if (!id) return "#OD-UNKNOWN";
  return `#OD-${id.slice(-6).toUpperCase()}`;
}
