import { ShieldCheck, RotateCcw } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="px-6 py-4 border-t border-slate-100 space-y-2.5">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>Secure SSL Encrypted Checkout</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <RotateCcw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>30-Day Free Returns</span>
      </div>
    </div>
  );
}
