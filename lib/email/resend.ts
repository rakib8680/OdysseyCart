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
