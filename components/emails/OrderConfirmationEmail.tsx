import { Section, Text, Row, Column, Img, Button } from "react-email";
import * as React from "react";
import {
  BaseEmailLayout,
  styles,
  colors,
  BASE_URL,
} from "./BaseEmailLayout";
import type { SerializedOrder } from "@/lib/types/order";

// ==========================================
// ORDER CONFIRMATION EMAIL
// ==========================================
// Sent automatically after Stripe webhook fulfillment (status → "paid").
// Displays itemized products, shipping address, and financial breakdown.

interface OrderConfirmationEmailProps {
  order: SerializedOrder;
}

/** Formats an order ID as the short display hash (e.g. #OD-1CE88C) */
function formatOrderId(id: string): string {
  return `#OD-${id.slice(-6).toUpperCase()}`;
}

export function OrderConfirmationEmail({
  order,
}: OrderConfirmationEmailProps) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <BaseEmailLayout previewText={`Order ${formatOrderId(order._id)} confirmed — thank you for your purchase!`}>
      {/* ── Greeting ── */}
      <Text style={styles.heading}>Order Confirmed! 🎉</Text>
      <Text style={styles.paragraph}>
        Hi {order.shippingInfo.fullName}, thank you for your order. We've
        received your payment and will begin preparing your items right away.
      </Text>

      {/* ── Order Metadata ── */}
      <Section style={metaStyles.metaRow}>
        <Row>
          <Column>
            <Text style={metaStyles.metaLabel}>Order ID</Text>
            <Text style={metaStyles.metaValue}>
              {formatOrderId(order._id)}
            </Text>
          </Column>
          <Column>
            <Text style={metaStyles.metaLabel}>Date</Text>
            <Text style={metaStyles.metaValue}>{orderDate}</Text>
          </Column>
          <Column>
            <Text style={metaStyles.metaLabel}>Total</Text>
            <Text style={metaStyles.metaValue}>
              ${order.total.toFixed(2)}
            </Text>
          </Column>
        </Row>
      </Section>

      {/* ── Itemized Product List ── */}
      <Text style={{ ...styles.heading, fontSize: "16px", margin: "24px 0 12px" }}>
        Items Ordered
      </Text>
      {order.items.map((item, index) => (
        <Section key={index} style={itemStyles.itemRow}>
          <Row>
            <Column style={{ width: "64px" }}>
              <Img
                src={item.image || `${BASE_URL}/placeholder.png`}
                alt={item.title}
                width={56}
                height={56}
                style={itemStyles.itemImage}
              />
            </Column>
            <Column style={{ paddingLeft: "12px" }}>
              <Text style={itemStyles.itemTitle}>{item.title}</Text>
              <Text style={itemStyles.itemMeta}>
                Qty: {item.quantity} × ${item.price.toFixed(2)}
              </Text>
            </Column>
            <Column style={{ textAlign: "right" as const }}>
              <Text style={itemStyles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </Column>
          </Row>
        </Section>
      ))}

      {/* ── Financial Breakdown ── */}
      <Section style={totalStyles.section}>
        <Row>
          <Column>
            <Text style={totalStyles.label}>Subtotal</Text>
          </Column>
          <Column style={{ textAlign: "right" as const }}>
            <Text style={totalStyles.value}>
              ${order.subtotal.toFixed(2)}
            </Text>
          </Column>
        </Row>
        {order.discount > 0 && (
          <Row>
            <Column>
              <Text style={totalStyles.label}>
                Discount{order.couponCode ? ` (${order.couponCode})` : ""}
              </Text>
            </Column>
            <Column style={{ textAlign: "right" as const }}>
              <Text style={{ ...totalStyles.value, color: colors.emerald600 }}>
                -${order.discount.toFixed(2)}
              </Text>
            </Column>
          </Row>
        )}
        <Row>
          <Column>
            <Text style={totalStyles.label}>Shipping</Text>
          </Column>
          <Column style={{ textAlign: "right" as const }}>
            <Text style={totalStyles.value}>
              {order.shippingCost === 0
                ? "Free"
                : `$${order.shippingCost.toFixed(2)}`}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={totalStyles.label}>Tax</Text>
          </Column>
          <Column style={{ textAlign: "right" as const }}>
            <Text style={totalStyles.value}>${order.tax.toFixed(2)}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={totalStyles.totalLabel}>Total Paid</Text>
          </Column>
          <Column style={{ textAlign: "right" as const }}>
            <Text style={totalStyles.totalValue}>
              ${order.total.toFixed(2)}
            </Text>
          </Column>
        </Row>
      </Section>

      {/* ── Shipping Address ── */}
      <Text style={{ ...styles.heading, fontSize: "16px", margin: "24px 0 8px" }}>
        Shipping To
      </Text>
      <Text style={styles.paragraph}>
        {order.shippingInfo.fullName}
        <br />
        {order.shippingInfo.address}
        <br />
        {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
        {order.shippingInfo.zipCode}
        <br />
        {order.shippingInfo.country}
      </Text>

      {/* ── CTA Button ── */}
      <Section style={{ textAlign: "center" as const, margin: "32px 0 8px" }}>
        <Button href={`${BASE_URL}/account/orders`} style={styles.ctaButton}>
          Track Your Order
        </Button>
      </Section>
    </BaseEmailLayout>
  );
}

// ==========================================
// TEMPLATE-SPECIFIC STYLES
// ==========================================

const metaStyles = {
  metaRow: {
    backgroundColor: colors.slate50,
    borderRadius: "8px",
    padding: "16px 20px",
    margin: "16px 0",
  } as React.CSSProperties,
  metaLabel: {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    color: colors.slate400,
    margin: "0 0 4px",
  } as React.CSSProperties,
  metaValue: {
    fontSize: "14px",
    fontWeight: 600,
    color: colors.slate900,
    margin: 0,
  } as React.CSSProperties,
};

const itemStyles = {
  itemRow: {
    padding: "12px 0",
    borderBottom: `1px solid ${colors.slate100}`,
  } as React.CSSProperties,
  itemImage: {
    borderRadius: "8px",
    objectFit: "cover" as const,
  } as React.CSSProperties,
  itemTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: colors.slate900,
    margin: "0 0 4px",
  } as React.CSSProperties,
  itemMeta: {
    fontSize: "13px",
    color: colors.slate500,
    margin: 0,
  } as React.CSSProperties,
  itemPrice: {
    fontSize: "14px",
    fontWeight: 600,
    color: colors.slate900,
    margin: 0,
  } as React.CSSProperties,
};

const totalStyles = {
  section: {
    backgroundColor: colors.slate50,
    borderRadius: "8px",
    padding: "16px 20px",
    margin: "16px 0",
  } as React.CSSProperties,
  label: {
    fontSize: "14px",
    color: colors.slate500,
    margin: "4px 0",
  } as React.CSSProperties,
  value: {
    fontSize: "14px",
    color: colors.slate700,
    margin: "4px 0",
  } as React.CSSProperties,
  totalLabel: {
    fontSize: "15px",
    fontWeight: 700,
    color: colors.slate900,
    margin: "8px 0 0",
    borderTop: `1px solid ${colors.slate200}`,
    paddingTop: "8px",
  } as React.CSSProperties,
  totalValue: {
    fontSize: "15px",
    fontWeight: 700,
    color: colors.emerald600,
    margin: "8px 0 0",
    borderTop: `1px solid ${colors.slate200}`,
    paddingTop: "8px",
  } as React.CSSProperties,
};
