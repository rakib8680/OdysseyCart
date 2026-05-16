"use client";

import { useState } from "react";
import { CartItem } from "@/lib/types/cart";
import { calculateOrderTotals } from "@/lib/utils/pricing";
import { TShippingForm } from "@/lib/validations/checkout";
import { OrderSummary } from "./OrderSummary";
import { ShippingForm } from "./ShippingForm";
import { StepIndicator } from "./StepIndicator";
import { AccordionStep } from "./AccordionStep";

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
  const [activeStep, setActiveStep] = useState(1);
  const [shippingData, setShippingData] = useState<TShippingForm | null>(null);

  const totals = calculateOrderTotals(cartItems);

  // Handler: Shipping form completed
  const handleShippingComplete = (data: TShippingForm) => {
    setShippingData(data);
    setActiveStep(2);
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
          <ShippingForm
            defaultValues={shippingData || undefined}
            onComplete={handleShippingComplete}
          />
        </AccordionStep>

        {/* Step 2 — Payment (Placeholder for now) */}
        <AccordionStep
          stepNumber={2}
          title="Payment Method"
          isActive={activeStep === 2}
          isCompleted={activeStep > 2}
          onEdit={() => activeStep > 2 && setActiveStep(2)}
        >
          <div className="py-8 text-center text-slate-500">
            <p className="font-medium">Stripe Payment Element will go here.</p>
            <p className="text-sm mt-1">This will be wired up in Step 5.</p>
            <button
              onClick={() => setActiveStep(3)}
              className="mt-4 px-6 h-12 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              Continue to Review →
            </button>
          </div>
        </AccordionStep>

        {/* Step 3 — Review (Placeholder for now) */}
        <AccordionStep
          stepNumber={3}
          title="Review & Place Order"
          isActive={activeStep === 3}
          isCompleted={false}
          onEdit={() => {}}
        >
          <div className="py-8 text-center text-slate-500">
            <p className="font-medium">
              Order review and Place Order button will go here.
            </p>
            <p className="text-sm mt-1">This will be wired up in Step 5.</p>
          </div>
        </AccordionStep>
      </div>

      {/* Right Column — Order Summary */}
      <div className="lg:col-span-5 xl:col-span-4">
        <OrderSummary items={cartItems} totals={totals} />
      </div>
    </div>
  );
}
