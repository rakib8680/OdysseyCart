"use server";

import { resend, FROM_EMAIL, getRecipient } from "@/lib/email/resend";
import { OrderConfirmationEmail } from "@/components/emails/OrderConfirmationEmail";
import { OrderStatusUpdateEmail } from "@/components/emails/OrderStatusUpdateEmail";
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";
import type { SerializedOrder } from "@/lib/types/order";
import type { OrderStatus } from "@/lib/models/Order";

// ==========================================
// EMAIL SERVICE LAYER
// ==========================================
// Centralized, non-blocking email dispatch functions.
// Every function is wrapped in try/catch and returns a result
// object — callers should fire-and-forget (.catch()) to ensure
// email failures never block primary business logic.

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/** Guard: returns early with a clean warning if Resend client is unavailable */
function getClient() {
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY not configured — skipping email send.");
    return null;
  }
  return resend;
}

// ==========================================
// ORDER CONFIRMATION
// ==========================================
/**
 * Sends an order confirmation email after successful payment.
 * Called from Stripe webhook handler (fire-and-forget).
 */
export async function sendOrderConfirmationEmail(
  order: SerializedOrder,
): Promise<EmailResult> {
  try {
    const client = getClient();
    if (!client) return { success: false, error: "NO_API_KEY" };

    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: getRecipient(order.shippingInfo.email),
      subject: `Order Confirmed — #OD-${order._id.slice(-6).toUpperCase()}`,
      react: OrderConfirmationEmail({ order }),
    });

    if (error) {
      console.error("[Email] Order confirmation failed:", error);
      return { success: false, error: error.message };
    }

    console.log(
      `[Email] Order confirmation sent to ${order.shippingInfo.email} (id: ${data?.id})`,
    );
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("[Email] Order confirmation error:", err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// ORDER STATUS UPDATE
// ==========================================
/**
 * Sends a status update email when an admin changes order status.
 * Called from updateOrderStatus server action (fire-and-forget).
 */
export async function sendOrderStatusUpdateEmail(
  order: SerializedOrder,
  newStatus: OrderStatus,
): Promise<EmailResult> {
  try {
    const client = getClient();
    if (!client) return { success: false, error: "NO_API_KEY" };

    const statusLabel = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: getRecipient(order.shippingInfo.email),
      subject: `Order ${statusLabel} — #OD-${order._id.slice(-6).toUpperCase()}`,
      react: OrderStatusUpdateEmail({
        orderId: order._id,
        customerName: order.shippingInfo.fullName,
        newStatus,
        email: order.shippingInfo.email,
      }),
    });

    if (error) {
      console.error("[Email] Status update failed:", error);
      return { success: false, error: error.message };
    }

    console.log(
      `[Email] Status update (${newStatus}) sent to ${order.shippingInfo.email} (id: ${data?.id})`,
    );
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("[Email] Status update error:", err);
    return { success: false, error: err.message };
  }
}

// ==========================================
// WELCOME EMAIL
// ==========================================
/**
 * Sends a welcome email upon new user registration.
 * Called from auth sync flow (fire-and-forget).
 */
export async function sendWelcomeEmail(user: {
  email: string;
  name: string;
}): Promise<EmailResult> {
  try {
    const client = getClient();
    if (!client) return { success: false, error: "NO_API_KEY" };

    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: getRecipient(user.email),
      subject: "Welcome to OdysseyCart! 🎉",
      react: WelcomeEmail({ name: user.name }),
    });

    if (error) {
      console.error("[Email] Welcome email failed:", error);
      return { success: false, error: error.message };
    }

    console.log(
      `[Email] Welcome email sent to ${user.email} (id: ${data?.id})`,
    );
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("[Email] Welcome email error:", err);
    return { success: false, error: err.message };
  }
}
