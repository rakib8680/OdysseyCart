import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing. Please set the environment variable.",
      );
    }
    // We use loadStripe here to initialize the client-side Stripe SDK
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};
