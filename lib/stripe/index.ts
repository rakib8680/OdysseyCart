import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is missing. Please set the environment variable.",
  );
}

// We use a singleton pattern so we don't accidentally create multiple Stripe instances
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
});
