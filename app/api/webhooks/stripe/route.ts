import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";

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

      const order = await Order.findById(orderId);

      if (!order) {
        console.error(`Webhook: Order ${orderId} not found.`);
        return NextResponse.json(
          { error: "Order not found." },
          { status: 404 },
        );
      }

      // IDEMPOTENCY GUARD: If already paid, skip to prevent double stock decrement
      if (order.status === "paid") {
        console.log(`Webhook: Order ${orderId} already fulfilled. Skipping.`);
        return NextResponse.json({ received: true });
      }

      // 3. Mark the order as paid
      order.status = "paid";
      order.stripePaymentId = paymentIntent.id;
      await order.save();

      // 4. Decrement stock for each purchased item
      const bulkOps = order.items.map((item: any) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: { $inc: { stockQuantity: -item.quantity } },
        },
      }));

      if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps);
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
