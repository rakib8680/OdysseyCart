import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Font,
} from "react-email";
import * as React from "react";

// ==========================================
// BASE EMAIL LAYOUT
// ==========================================
// Master wrapper for all OdysseyCart transactional emails.
// Provides consistent brand identity: header, typography,
// container styling, and footer across every template.

interface BaseEmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

import { getBaseUrl } from "@/lib/utils";

const BASE_URL = getBaseUrl();

export function BaseEmailLayout({
  previewText,
  children,
}: BaseEmailLayoutProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
            format: "woff2",
          }}
        />
        <title>{previewText}</title>
      </Head>
      <Body style={styles.body}>
        {/* Hidden preview text for email clients */}
        <Text style={{ display: "none", maxHeight: 0, overflow: "hidden" }}>
          {previewText}
        </Text>

        <Container style={styles.container}>
          {/* ── Brand Header ── */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>OdysseyCart</Text>
          </Section>

          {/* ── Main Content ── */}
          <Section style={styles.content}>{children}</Section>

          {/* ── Footer ── */}
          <Hr style={styles.hr} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} OdysseyCart. All rights reserved.
            </Text>
            <Text style={styles.footerLink}>
              <a href={BASE_URL} style={styles.link}>
                Visit our store
              </a>
              {" · "}
              <a href={`${BASE_URL}/account/orders`} style={styles.link}>
                My Orders
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ==========================================
// SHARED STYLE TOKENS
// ==========================================
// Inline styles are required for maximum email client compatibility.
// These tokens are exported so child templates can reuse them.

export const colors = {
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate900: "#0f172a",
  emerald500: "#10b981",
  emerald600: "#059669",
  emerald700: "#047857",
  white: "#ffffff",
  red500: "#ef4444",
} as const;

export const styles = {
  body: {
    backgroundColor: colors.slate100,
    fontFamily: "'Inter', Arial, sans-serif",
    margin: 0,
    padding: "40px 0",
  } as React.CSSProperties,
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: colors.white,
    borderRadius: "12px",
    overflow: "hidden" as const,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  } as React.CSSProperties,
  header: {
    backgroundColor: colors.slate900,
    padding: "28px 40px",
    textAlign: "center" as const,
  } as React.CSSProperties,
  logoText: {
    color: colors.white,
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    margin: 0,
  } as React.CSSProperties,
  content: {
    padding: "32px 40px",
  } as React.CSSProperties,
  heading: {
    fontSize: "22px",
    fontWeight: 700,
    color: colors.slate900,
    margin: "0 0 8px",
  } as React.CSSProperties,
  paragraph: {
    fontSize: "15px",
    lineHeight: "24px",
    color: colors.slate600,
    margin: "0 0 16px",
  } as React.CSSProperties,
  hr: {
    borderColor: colors.slate200,
    margin: "0 40px",
  } as React.CSSProperties,
  footer: {
    padding: "24px 40px",
    textAlign: "center" as const,
  } as React.CSSProperties,
  footerText: {
    fontSize: "12px",
    color: colors.slate400,
    margin: "0 0 4px",
  } as React.CSSProperties,
  footerLink: {
    fontSize: "12px",
    color: colors.slate400,
    margin: 0,
  } as React.CSSProperties,
  link: {
    color: colors.emerald600,
    textDecoration: "underline",
  } as React.CSSProperties,
  ctaButton: {
    backgroundColor: colors.emerald600,
    color: colors.white,
    padding: "14px 28px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 600,
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center" as const,
  } as React.CSSProperties,
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  } as React.CSSProperties,
} as const;

export { BASE_URL };
