"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { RouteScrollRestoration } from "@/components/common/RouteScrollRestoration";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <RouteScrollRestoration />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster position="top-center" duration={3000} richColors />
      </CartProvider>
    </AuthProvider>
  );
}
