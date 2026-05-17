"use server";

import { connectDB } from "@/lib/db/mongoose";
import Coupon from "@/lib/models/Coupon";

export interface CouponValidationResult {
  success: boolean;
  discountAmount: number;
  message?: string;
  code?: string;
}

export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<CouponValidationResult> {
  try {
    if (!code || typeof code !== "string") {
      return {
        success: false,
        discountAmount: 0,
        message: "Invalid coupon code format.",
      };
    }

    await connectDB();

    const normalizedCode = code.trim().toUpperCase();

    // 1. Find the coupon
    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (!coupon) {
      return {
        success: false,
        discountAmount: 0,
        message: "Coupon not found or invalid.",
      };
    }

    // 2. Check if active
    if (!coupon.isActive) {
      return {
        success: false,
        discountAmount: 0,
        message: "This coupon is no longer active.",
      };
    }

    // 3. Check expiry
    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return {
        success: false,
        discountAmount: 0,
        message: "This coupon has expired.",
      };
    }

    // 4. Check usage limits
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return {
        success: false,
        discountAmount: 0,
        message: "This coupon has reached its maximum usage limit.",
      };
    }

    // 5. Check minimum purchase amount
    if (
      coupon.minimumPurchaseAmount &&
      subtotal < coupon.minimumPurchaseAmount
    ) {
      return {
        success: false,
        discountAmount: 0,
        message: `A minimum purchase of $${coupon.minimumPurchaseAmount.toFixed(2)} is required for this coupon.`,
      };
    }

    // 6. Calculate raw discount amount
    let discountAmount = 0;
    if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "percentage") {
      discountAmount = subtotal * (coupon.discountValue / 100);
    }

    // 7. Apply maximum discount cap (if applicable)
    if (
      coupon.maximumDiscountAmount &&
      discountAmount > coupon.maximumDiscountAmount
    ) {
      discountAmount = coupon.maximumDiscountAmount;
    }

    // 8. Prevent discount from being greater than the subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return {
      success: true,
      discountAmount,
      code: coupon.code,
      message: "Coupon applied successfully!",
    };
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return {
      success: false,
      discountAmount: 0,
      message: "An error occurred while validating the coupon.",
    };
  }
}
