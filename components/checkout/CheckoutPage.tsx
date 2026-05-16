"use client";

import { useState } from "react";
import { CartItem } from "@/lib/types/cart";
import { calculateOrderTotals } from "@/lib/utils/pricing";
import { TShippingForm } from "@/lib/validations/checkout";
import { OrderSummary } from "./OrderSummary";
import { ShippingForm } from "./ShippingForm";
import { StepIndicator } from "./StepIndicator";
import { AccordionStep } from "./AccordionStep";
import { useAuth } from "@/contexts/AuthContext";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe/client";
import { createOrUpdatePaymentIntent } from "@/app/actions/payment";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PaymentForm } from "./PaymentForm";
import { ReviewStep } from "./ReviewStep";

// ==========================================
// TYPES
// ==========================================
interface CheckoutPageProps {
  cartItems: CartItem[];
}

// Steps configuration — easy to extend
const STEPS = [
  { id: 1, label: "Shipping" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Review" },
] as const;

// ==========================================
// CHECKOUT PAGE ORCHESTRATOR
// ==========================================
export function CheckoutPage({ cartItems }: CheckoutPageProps) {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(1);
  const [shippingData, setShippingData] = useState<TShippingForm | null>(null);

  // Stripe State
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  const totals = calculateOrderTotals(cartItems);

  // Handler: Shipping form completed
  const handleShippingComplete = async (data: TShippingForm) => {
    if (!user) {
      toast.error("You must be logged in to checkout.");
      return;
    }

    setShippingData(data);
    setIsInitializingPayment(true);

    try {
      const response = await createOrUpdatePaymentIntent(
        user.uid,
        data,
        orderId,
      );

      if (response.success && response.clientSecret) {
        setClientSecret(response.clientSecret);
        setOrderId(response.orderId || null);
        setActiveStep(2);
      } else {
        toast.error(response.error || "Failed to initialize payment.");
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column — Accordion Steps */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        {/* Step Indicators */}
        <div className="flex items-center gap-3 mb-6">
          {STEPS.map((step, index) => (
            <StepIndicator
              key={step.id}
              number={step.id}
              label={step.label}
              isActive={activeStep === step.id}
              isCompleted={activeStep > step.id}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </div>

        {/* Step 1 — Shipping */}
        <AccordionStep
          stepNumber={1}
          title="Shipping Information"
          isActive={activeStep === 1}
          isCompleted={activeStep > 1}
          onEdit={() => setActiveStep(1)}
          summary={
            shippingData
              ? `${shippingData.fullName} — ${shippingData.address}, ${shippingData.city}`
              : undefined
          }
        >
          {isInitializingPayment ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
              <p>Initializing secure payment...</p>
            </div>
          ) : (
            <ShippingForm
              defaultValues={shippingData || undefined}
              onComplete={handleShippingComplete}
            />
          )}
        </AccordionStep>

        {/* The Secret Stripe Wrapper */}
        {clientSecret ? (
          <Elements stripe={getStripe()} options={{ clientSecret }}>
            {/* Step 2 — Payment */}
            <AccordionStep
              stepNumber={2}
              title="Payment Method"
              isActive={activeStep === 2}
              isCompleted={activeStep > 2}
              onEdit={() => activeStep > 2 && setActiveStep(2)}
            >
              <PaymentForm onContinue={() => setActiveStep(3)} />
            </AccordionStep>

            {/* Step 3 — Review */}
            <AccordionStep
              stepNumber={3}
              title="Review & Place Order"
              isActive={activeStep === 3}
              isCompleted={false}
              onEdit={() => {}}
            >
              <ReviewStep
                shippingData={shippingData!}
                cartItems={cartItems}
                totals={totals}
              />
            </AccordionStep>
          </Elements>
        ) : (
          <>
            {/* Disabled Placeholders */}
            <AccordionStep
              stepNumber={2}
              title="Payment Method"
              isActive={false}
              isCompleted={false}
              onEdit={() => {}}
            >
              <div />
            </AccordionStep>

            <AccordionStep
              stepNumber={3}
              title="Review & Place Order"
              isActive={false}
              isCompleted={false}
              onEdit={() => {}}
            >
              <div />
            </AccordionStep>
          </>
        )}
      </div>

      {/* Right Column — Order Summary */}
      <div className="lg:col-span-5 xl:col-span-4">
        <OrderSummary items={cartItems} totals={totals} />
      </div>
    </div>
  );
}
