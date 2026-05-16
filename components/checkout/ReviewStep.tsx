import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

export function ReviewStep() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe is not ready yet.");
      return;
    }

    setIsProcessing(true);

    // 1. Trigger Stripe's built-in form validation (checks for empty/invalid card numbers)
    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.error(
        submitError.message ||
          "Please complete your payment details in Step 2.",
      );
      setIsProcessing(false);
      return;
    }

    // 2. Confirm the payment and redirect on success
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    // 3. Handle failure (Success won't reach here because of the redirect)
    if (error) {
      toast.error(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-start gap-3 text-left">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          Your payment is securely processed by Stripe. We never store your
          credit card details.
        </p>
      </div>

      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={isProcessing || !stripe || !elements}
        className="w-full h-14 bg-emerald-600 text-white rounded-xl text-base font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          "Place Order & Pay"
        )}
      </button>
    </div>
  );
}
