// ============================================================================
// URL & ENVIRONMENT UTILITIES (SSOT)
// ============================================================================

/**
 * Resolves the application base URL for transactional emails, SEO canonical links,
 * and external webhook/Stripe callbacks.
 *
 * Precedence:
 * 1. NEXT_PUBLIC_APP_URL
 * 2. VERCEL_PROJECT_PRODUCTION_URL
 * 3. VERCEL_URL
 * 4. http://localhost:3000 (local development fallback)
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
