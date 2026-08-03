import { Section, Text, Heading, Hr } from "react-email";
import * as React from "react";
import {
  BaseEmailLayout,
  colors,
  styles as baseStyles,
} from "./BaseEmailLayout";

export interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  orderNumber?: string;
  message: string;
}

export function ContactFormEmail({
  name,
  email,
  subject,
  orderNumber,
  message,
}: ContactFormEmailProps) {
  const previewText = `Support Inquiry: [${subject}] from ${name}`;

  return (
    <BaseEmailLayout previewText={previewText}>
      <Heading style={baseStyles.heading}>New Customer Support Inquiry</Heading>
      <Text style={baseStyles.paragraph}>
        You have received a new support message from the OdysseyCart contact form.
      </Text>

      {/* Details Box */}
      <Section style={styles.detailsBox}>
        <Text style={styles.detailRow}>
          <strong>Customer Name:</strong> {name}
        </Text>
        <Text style={styles.detailRow}>
          <strong>Email Address:</strong> {email}
        </Text>
        <Text style={styles.detailRow}>
          <strong>Category/Subject:</strong> {subject}
        </Text>
        {orderNumber && (
          <Text style={styles.detailRow}>
            <strong>Order Reference:</strong> #{orderNumber.replace(/^#/, "")}
          </Text>
        )}
      </Section>

      <Hr style={{ borderColor: colors.slate200, margin: "24px 0" }} />

      {/* Message Body */}
      <Text style={styles.messageHeading}>Customer Message:</Text>
      <Section style={styles.messageBox}>
        <Text style={styles.messageText}>{message}</Text>
      </Section>

      <Text style={styles.replyNotice}>
        💡 <strong>Tip:</strong> Click "Reply" in your email client to send a response directly to <strong>{email}</strong>.
      </Text>
    </BaseEmailLayout>
  );
}

const styles = {
  detailsBox: {
    backgroundColor: colors.slate50,
    borderRadius: "8px",
    padding: "16px 20px",
    border: `1px solid ${colors.slate200}`,
  } as React.CSSProperties,
  detailRow: {
    fontSize: "14px",
    color: colors.slate700,
    margin: "4px 0",
    lineHeight: "20px",
  } as React.CSSProperties,
  messageHeading: {
    fontSize: "14px",
    fontWeight: 600,
    color: colors.slate900,
    margin: "0 0 8px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  } as React.CSSProperties,
  messageBox: {
    backgroundColor: colors.slate50,
    borderRadius: "8px",
    padding: "20px",
    borderLeft: `4px solid ${colors.emerald600}`,
    margin: "0 0 20px",
  } as React.CSSProperties,
  messageText: {
    fontSize: "15px",
    lineHeight: "24px",
    color: colors.slate900,
    margin: 0,
    whiteSpace: "pre-wrap" as const,
  } as React.CSSProperties,
  replyNotice: {
    fontSize: "13px",
    color: colors.slate500,
    backgroundColor: colors.slate100,
    padding: "12px 16px",
    borderRadius: "6px",
    margin: 0,
  } as React.CSSProperties,
};
