"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster position="top-center" duration={3000} richColors />
      </CartProvider>
    </AuthProvider>
  );
}
