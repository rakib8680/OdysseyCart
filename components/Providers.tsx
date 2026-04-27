"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <Toaster position="top-center" duration={3000} richColors />
    </AuthProvider>
  );
}
