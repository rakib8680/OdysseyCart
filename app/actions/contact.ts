"use server";

import { sendContactSupportEmail } from "@/lib/email/service";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/validations/contact";

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

// ==========================================
// SERVER ACTION: SUBMIT CONTACT FORM
// ==========================================
/**
 * Server action to validate user support inquiries and send notifications via Resend.
 */
export async function submitContactForm(
  input: ContactFormInput,
): Promise<ActionResponse> {
  try {
    // 1. Validate payload against centralized Zod schema
    const validation = contactFormSchema.safeParse(input);

    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });

      return {
        success: false,
        message: "Please correct the errors in the form.",
        errors: formattedErrors,
      };
    }

    const { name, email, subject, orderNumber, message } = validation.data;

    // 2. Dispatch email via non-blocking email service layer
    const result = await sendContactSupportEmail({
      name,
      email,
      subject,
      orderNumber,
      message,
    });

    if (!result.success && result.error !== "NO_API_KEY") {
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      };
    }

    return {
      success: true,
      message:
        "Thank you! Your message has been sent. Our support team will get back to you within 24 hours.",
    };
  } catch (error) {
    console.error("[Contact Action] Error submitting support form:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
