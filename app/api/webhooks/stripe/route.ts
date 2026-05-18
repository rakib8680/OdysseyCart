import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Coupon from "@/lib/models/Coupon";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  let event;

  // 1. Cryptographically verify the webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  // 2. Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.error("Webhook: No orderId found in PaymentIntent metadata.");
      return NextResponse.json(
        { error: "No orderId in metadata." },
        { status: 400 },
      );
    }

    try {
      await connectDB();

      // ATOMIC IDEMPOTENCY GUARD
      // Replace the old 3-step (findById → check → save) with a single atomic
      // findOneAndUpdate. The filter { status: "pending" } means only ONE
      // concurrent webhook delivery can ever "claim" the order — the second
      // request will get null back and exit safely. This eliminates the
      // check-then-act race condition.
      const order = await Order.findOneAndUpdate(
        { _id: orderId, status: "pending" },
        { $set: { status: "paid", stripePaymentId: paymentIntent.id } },
        { new: true },
      );

      if (!order) {
        console.log(
          `Webhook: Order ${orderId} not found or already fulfilled. Skipping.`,
        );
        return NextResponse.json({ received: true });
      }

      //SAFE STOCK DECREMENT (FLOOR AT ZERO)
      // Added stockQuantity: { $gte: item.quantity } to the filter.
      // This makes the decrement conditional — if stock is somehow already 0
      // (e.g. from a duplicate event), the updateOne simply matches nothing
      // instead of pushing stockQuantity into negative territory.
      const bulkOps = order.items.map((item: any) => ({
        updateOne: {
          filter: {
            _id: item.productId,
            stockQuantity: { $gte: item.quantity },
          },
          update: { $inc: { stockQuantity: -item.quantity } },
        },
      }));

      if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps);
      }

      // 5. Update Coupon usage count if a coupon was used
      if (order.couponCode) {
        await Coupon.updateOne(
          { code: order.couponCode },
          { $inc: { usedCount: 1 } },
        );
      }

      console.log(`Webhook: Order ${orderId} fulfilled successfully.`);
    } catch (error: any) {
      console.error("Webhook fulfillment error:", error);
      return NextResponse.json(
        { error: "Fulfillment failed." },
        { status: 500 },
      );
    }
  }

  // Always return 200 to Stripe to acknowledge receipt
  return NextResponse.json({ received: true });
}
