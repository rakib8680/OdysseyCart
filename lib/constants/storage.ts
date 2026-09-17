// ============================================================================
// STORAGE & COOKIE KEYS SINGLE SOURCE OF TRUTH (SSOT)
// ============================================================================

export const STORAGE_KEYS = {
  /** LocalStorage key for guest cart persistence */
  CART: "odyssey_cart",
  /** LocalStorage & Cookie key for catalog layout view mode ('grid' | 'list') */
  CATALOG_VIEW_MODE: "odyssey_catalog_view_mode",
  /** LocalStorage key for password reset rate limit countdown */
  PASSWORD_RESET_TIMER: "password_reset_timer",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
