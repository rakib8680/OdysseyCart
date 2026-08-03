import { Resend } from "resend";

// ==========================================
// RESEND CLIENT
// ==========================================
// Conditionally initialized — gracefully returns null if
// RESEND_API_KEY is not set (e.g. local dev, CI pipelines).
// All service-layer callers guard against a null client.

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Default sender identity — use Resend sandbox for dev, custom domain for prod
export const FROM_EMAIL =
  process.env.EMAIL_FROM || "OdysseyCart <onboarding@resend.dev>";

// ==========================================
// SANDBOX RECIPIENT OVERRIDE
// ==========================================
// Resend's free sandbox domain (@resend.dev) only delivers to the
// account owner's email. This helper transparently redirects ALL
// outgoing emails to the owner when running in sandbox mode.
// Once a custom domain is verified and EMAIL_FROM is updated,
// emails will flow to actual customer addresses automatically.

const isSandboxMode = FROM_EMAIL.includes("@resend.dev");

/**
 * Returns the correct recipient for the current environment.
 * - Sandbox mode (@resend.dev): redirects to RESEND_SANDBOX_EMAIL or account owner
 * - Production (custom domain): returns the original customer email
 */
export function getRecipient(customerEmail: string): string {
  if (!isSandboxMode) return customerEmail;

  const override =
    process.env.RESEND_SANDBOX_EMAIL || "rakib.cst.1st@gmail.com";
  console.log(
    `[Email] Sandbox mode — redirecting "${customerEmail}" → "${override}"`,
  );
  return override;
}
