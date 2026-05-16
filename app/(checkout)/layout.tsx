import Link from "next/link";
import { Lock } from "lucide-react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 shrink-0 transition-opacity hover:opacity-80"
          >
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
              O
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              ODYSSEY CART
            </span>
          </Link>
          <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
