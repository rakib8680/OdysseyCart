import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  onContinue: () => void;
}

export function PaymentForm({ onContinue }: PaymentFormProps) {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="space-y-6">
      <div className={!isReady ? "hidden" : "block"}>
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{ layout: "tabs" }}
        />
      </div>

      {!isReady && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
          <p>Loading secure payment methods...</p>
        </div>
      )}

      {isReady && (
        <button
          type="button"
          onClick={onContinue}
          className="w-full h-12 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors mt-6 cursor-pointer"
        >
          Continue to Review
        </button>
      )}
    </div>
  );
}
