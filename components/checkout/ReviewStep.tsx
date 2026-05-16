import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  MapPin,
  Package,
  Tag,
  Truck,
} from "lucide-react";
import { CartItem } from "@/lib/types/cart";
import { OrderTotals } from "@/lib/utils/pricing";
import { TShippingForm } from "@/lib/validations/checkout";
import { SummaryItem, PriceLine } from "./OrderSummary";

interface ReviewStepProps {
  shippingData: TShippingForm;
  cartItems: CartItem[];
  totals: OrderTotals;
}

export function ReviewStep({
  shippingData,
  cartItems,
  totals,
}: ReviewStepProps) {
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
    <div className="space-y-5">
      {/* Shipping Address Summary */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-slate-600" />
          <h4 className="text-sm font-bold text-slate-900">Shipping To</h4>
        </div>
        <div className="text-sm text-slate-600 space-y-0.5 pl-6">
          <p className="font-medium text-slate-800">{shippingData.fullName}</p>
          <p>{shippingData.address}</p>
          <p>
            {shippingData.city}, {shippingData.state} {shippingData.zipCode}
          </p>
          <p>{shippingData.phone}</p>
          <p className="text-slate-500">{shippingData.email}</p>
        </div>
      </div>

      {/* Order Items Summary — Reuses SummaryItem from OrderSummary */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-slate-600" />
          <h4 className="text-sm font-bold text-slate-900">
            Order Items ({cartItems.length})
          </h4>
        </div>
        <div className="divide-y divide-slate-100 pl-2">
          {cartItems.map((item) => (
            <SummaryItem key={item.productId} item={item} />
          ))}
        </div>
      </div>

      {/* Price Breakdown — Reuses PriceLine from OrderSummary */}
      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
        <PriceLine label="Subtotal" value={totals.subtotal} />

        {totals.discount > 0 && (
          <PriceLine
            label="Discount"
            value={-totals.discount}
            className="text-emerald-600"
            icon={<Tag className="w-3.5 h-3.5" />}
          />
        )}

        <PriceLine
          label="Shipping"
          value={totals.shippingCost}
          isFree={totals.shippingCost === 0}
          icon={<Truck className="w-3.5 h-3.5" />}
        />

        <PriceLine label="Tax (5%)" value={totals.tax} />

        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-base font-bold text-slate-900">Total</span>
          <span className="text-xl font-bold text-slate-900">
            ${totals.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm">
          Your payment is securely processed by Stripe. We never store your
          credit card details.
        </p>
      </div>

      {/* Place Order Button */}
      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={isProcessing || !stripe || !elements}
        className="w-full h-14 bg-emerald-600 text-white rounded-xl text-base font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Place Order — $${totals.total.toFixed(2)}`
        )}
      </button>
    </div>
  );
}
