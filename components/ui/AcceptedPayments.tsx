export function AcceptedPayments() {
  return (
    <div className="px-6 py-4 border-t border-slate-100">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
        We Accept
      </p>
      <div className="flex items-center gap-2">
        {/* Visa */}
        <div className="h-7 w-11 rounded border border-slate-200 bg-white flex items-center justify-center">
          <span className="text-[10px] font-bold text-blue-700 italic">
            VISA
          </span>
        </div>
        {/* Mastercard */}
        <div className="h-7 w-11 rounded border border-slate-200 bg-white flex items-center justify-center">
          <div className="flex -space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
            <div className="w-3 h-3 rounded-full bg-amber-400 opacity-80" />
          </div>
        </div>
        {/* Amex */}
        <div className="h-7 w-11 rounded border border-slate-200 bg-blue-600 flex items-center justify-center">
          <span className="text-[8px] font-bold text-white tracking-tight">
            AMEX
          </span>
        </div>
        {/* PayPal */}
        <div className="h-7 w-11 rounded border border-slate-200 bg-white flex items-center justify-center">
          <span className="text-[9px] font-bold text-blue-800">
            Pay<span className="text-sky-500">Pal</span>
          </span>
        </div>
        {/* Stripe */}
        <div className="h-7 w-11 rounded border border-slate-200 bg-white flex items-center justify-center">
          <span className="text-[9px] font-bold text-violet-600">stripe</span>
        </div>
      </div>
    </div>
  );
}
