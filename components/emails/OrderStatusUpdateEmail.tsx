import { Section, Text, Button } from "react-email";
import * as React from "react";
import { BaseEmailLayout, styles, colors } from "./BaseEmailLayout";
import { getBaseUrl } from "@/lib/utils";
import type { OrderStatus } from "@/lib/models/Order";

// ==========================================
// ORDER STATUS UPDATE EMAIL
// ==========================================
// Sent when an admin updates order status (e.g. paid → shipped → delivered).
// Displays a visual status badge and contextual message.

interface OrderStatusUpdateEmailProps {
  orderId: string;
  customerName: string;
  newStatus: OrderStatus;
  email: string;
}

/** Maps order statuses to human-readable labels and colors */
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; emoji: string; message: string }
> = {
  shipped: {
    label: "Shipped",
    color: "#1d4ed8",
    bgColor: "#dbeafe",
    emoji: "📦",
    message:
      "Great news! Your order has been shipped and is on its way to you. You can track your delivery status from your account.",
  },
  delivered: {
    label: "Delivered",
    color: colors.emerald700,
    bgColor: "#d1fae5",
    emoji: "✅",
    message:
      "Your order has been delivered! We hope you love your new items. If you have any questions, don't hesitate to reach out.",
  },
};

/** Formats an order ID as the short display hash (e.g. #OD-1CE88C) */
function formatOrderId(id: string): string {
  return `#OD-${id.slice(-6).toUpperCase()}`;
}

const BASE_URL = getBaseUrl();

export function OrderStatusUpdateEmail({
  orderId,
  customerName,
  newStatus,
}: OrderStatusUpdateEmailProps) {
  const config = STATUS_CONFIG[newStatus] || {
    label: newStatus,
    color: colors.slate700,
    bgColor: colors.slate100,
    emoji: "📋",
    message: "Your order status has been updated.",
  };

  return (
    <BaseEmailLayout
      previewText={`Order ${formatOrderId(orderId)} — ${config.label}`}
    >
      {/* ── Status Badge ── */}
      <Section style={{ textAlign: "center" as const, margin: "0 0 24px" }}>
        <Text style={{ fontSize: "40px", margin: "0 0 8px" }}>
          {config.emoji}
        </Text>
        <Text
          style={{
            ...styles.badge,
            color: config.color,
            backgroundColor: config.bgColor,
          }}
        >
          {config.label}
        </Text>
      </Section>

      {/* ── Greeting & Message ── */}
      <Text style={styles.heading}>
        Hi {customerName}, your order is {config.label.toLowerCase()}!
      </Text>
      <Text style={styles.paragraph}>{config.message}</Text>

      {/* ── Order Reference ── */}
      <Section
        style={{
          backgroundColor: colors.slate50,
          borderRadius: "8px",
          padding: "16px 20px",
          margin: "16px 0",
        }}
      >
        <Text
          style={{
            fontSize: "13px",
            color: colors.slate500,
            margin: "0 0 4px",
          }}
        >
          Order ID
        </Text>
        <Text
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: colors.slate900,
            margin: 0,
          }}
        >
          {formatOrderId(orderId)}
        </Text>
      </Section>

      {/* ── CTA Button ── */}
      <Section style={{ textAlign: "center" as const, margin: "28px 0 8px" }}>
        <Button href={`${BASE_URL}/account/orders`} style={styles.ctaButton}>
          View Order Details
        </Button>
      </Section>
    </BaseEmailLayout>
  );
}
