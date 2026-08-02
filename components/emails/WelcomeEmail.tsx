import { Section, Text, Button } from "react-email";
import * as React from "react";
import { BaseEmailLayout, styles, colors } from "./BaseEmailLayout";
import { getBaseUrl } from "@/lib/utils";

// ==========================================
// WELCOME EMAIL
// ==========================================
// Sent upon new user registration.
// Provides a warm welcome with store highlights and CTA.

interface WelcomeEmailProps {
  name: string;
}

const HIGHLIGHTS = [
  { emoji: "🎯", title: "Curated Selection", description: "Premium products handpicked for quality" },
  { emoji: "🚀", title: "Fast Shipping", description: "Quick and reliable delivery to your door" },
  { emoji: "🛡️", title: "Secure Checkout", description: "Your payment info is always protected" },
];

const BASE_URL = getBaseUrl();

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <BaseEmailLayout previewText={`Welcome to OdysseyCart, ${name}!`}>
      {/* ── Greeting ── */}
      <Text style={styles.heading}>Welcome to OdysseyCart! 👋</Text>
      <Text style={styles.paragraph}>
        Hi {name}, thanks for creating your account. We're excited to have you
        on board. Explore our curated collection of premium products and enjoy a
        seamless shopping experience.
      </Text>

      {/* ── Feature Highlights ── */}
      <Section style={{ margin: "24px 0" }}>
        {HIGHLIGHTS.map((item, index) => (
          <Section
            key={index}
            style={{
              padding: "12px 16px",
              backgroundColor: index % 2 === 0 ? colors.slate50 : colors.white,
              borderRadius: "8px",
              marginBottom: "4px",
            }}
          >
            <Text style={{ margin: 0, fontSize: "14px", color: colors.slate900 }}>
              <span style={{ marginRight: "8px" }}>{item.emoji}</span>
              <strong>{item.title}</strong>
              <span style={{ color: colors.slate500 }}>
                {" — "}
                {item.description}
              </span>
            </Text>
          </Section>
        ))}
      </Section>

      {/* ── CTA Button ── */}
      <Section style={{ textAlign: "center" as const, margin: "28px 0 8px" }}>
        <Button href={`${BASE_URL}/items`} style={styles.ctaButton}>
          Explore Collection
        </Button>
      </Section>
    </BaseEmailLayout>
  );
}
