"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { clearCart as clearServerCart } from "@/app/actions/checkout";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { PageLoader } from "@/components/ui/PageLoader";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading..." />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const { user } = useAuth();
  const { clearCart: clearClientCart } = useCart();
  const searchParams = useSearchParams();
  const [isClearing, setIsClearing] = useState(true);
  const hasClearedRef = useRef(false);

  const paymentIntent = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");

  // Clear the cart once after a successful payment
  useEffect(() => {
    async function handleSuccess() {
      if (!user || hasClearedRef.current) return;
      hasClearedRef.current = true;

      if (redirectStatus === "succeeded") {
        await clearServerCart(user.uid); // Clear MongoDB cart
        await clearClientCart(); // Sync React state (Navbar badge)
      }
      setIsClearing(false);
    }

    handleSuccess();
  }, [user, redirectStatus]);

  if (isClearing) {
    return <PageLoader message="Finalizing your order..." />;
  }

  if (redirectStatus !== "succeeded") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <span className="text-3xl">✕</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-slate-500 max-w-md mb-8">
          Something went wrong with your payment. You have not been charged.
          Please try again.
        </p>
        <Link
          href="/checkout"
          className="px-6 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
        >
          Return to Checkout
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle className="w-10 h-10 text-emerald-600" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Thank You for Your Order!
      </h1>
      <p className="text-slate-500 max-w-lg mb-2">
        Your payment was successful and your order is being processed. You will
        receive a confirmation email shortly.
      </p>

      {/* Payment Reference */}
      {paymentIntent && (
        <p className="text-xs text-slate-400 font-mono mb-8">
          Reference: {paymentIntent}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/items"
          className="px-6 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors inline-flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="px-6 h-12 border border-slate-300 text-slate-700 rounded-xl text-sm font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors inline-flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
