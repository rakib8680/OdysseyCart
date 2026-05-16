"use server";

import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { stripe } from "@/lib/stripe";
import { calculateOrderTotals } from "@/lib/utils/pricing";
import { TShippingForm } from "@/lib/validations/checkout";

import { getCheckoutCart } from "@/app/actions/checkout";

export async function createOrUpdatePaymentIntent(
  userId: string,
  shippingInfo: TShippingForm,
  existingOrderId?: string | null,
) {
  try {
    await connectDB();

    if (!userId) throw new Error("User ID is required");

    // 1. Fetch secure, live-priced cart directly from the database
    const cartResponse = await getCheckoutCart(userId);

    if (
      !cartResponse.success ||
      !cartResponse.items ||
      cartResponse.items.length === 0
    ) {
      throw new Error("Cart is empty or could not be verified.");
    }

    const verifiedItems = cartResponse.items;

    // 2. Calculate the exact, secure total
    const totals = calculateOrderTotals(verifiedItems);

    // Stripe requires the amount to be an integer in the smallest currency unit (cents for USD)
    const amountInCents = Math.round(totals.total * 100);

    // 3. Upsert Logic (Fixing the Database Bloat)
    if (existingOrderId) {
      const order = await Order.findById(existingOrderId);
      if (!order) {
        throw new Error("Existing order not found.");
      }

      // If payment already went through, do not touch this order
      if (order.status !== "pending") {
        throw new Error("Cannot update an order that is already processed.");
      }

      // Update the Order with the latest shipping address and amounts
      order.shippingInfo = shippingInfo;
      order.items = verifiedItems as any;
      order.subtotal = totals.subtotal;
      order.tax = totals.tax;
      order.shippingCost = totals.shippingCost;
      order.discount = totals.discount;
      order.total = totals.total;
      await order.save();

      // Update the existing Stripe PaymentIntent
      if (order.stripePaymentId) {
        const paymentIntent = await stripe.paymentIntents.update(
          order.stripePaymentId,
          {
            amount: amountInCents,
            // Update shipping metadata on Stripe's end as well
            shipping: {
              name: shippingInfo.fullName,
              address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                postal_code: shippingInfo.zipCode,
                country: "US", // Default to US or handle dynamically
              },
            },
          },
        );

        return {
          success: true,
          clientSecret: paymentIntent.client_secret,
          orderId: order._id.toString(),
        };
      }
    }

    // 4. Create New Logic (If no existingOrderId was provided)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      shipping: {
        name: shippingInfo.fullName,
        address: {
          line1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.zipCode,
          country: "US",
        },
      },
    });

    // Create the pending Mongoose Order
    const newOrder = await Order.create({
      userId,
      items: verifiedItems as any,
      shippingInfo,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shippingCost: totals.shippingCost,
      discount: totals.discount,
      total: totals.total,
      status: "pending",
      stripePaymentId: paymentIntent.id,
    });

    if (!newOrder) {
      throw new Error("Failed to create new order.");
    }

    // Link the new Order ID back into the Stripe PaymentIntent metadata
    // This is crucial for the Webhook to know which order to fulfill
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: {
        orderId: newOrder._id.toString(),
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: newOrder._id.toString(),
    };
  } catch (error: any) {
    console.error("Payment Intent Error:", error);
    return {
      success: false,
      error: error.message || "Failed to initialize payment.",
    };
  }
}
