"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/PageLoader";

/**
 * Layout-level guard for guest-only routes (login, register).
 * Prevents authenticated users from accessing auth pages
 * using a clean 3-state pattern:
 *   1. loading  → neutral loader (Firebase initializing)
 *   2. user     → "Redirecting..." + router.replace
 *   3. no user  → render children (the auth form)
 */
export default function AuthGuardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const params = new URLSearchParams(window.location.search);
      const destination = params.get("redirect") || "/";
      router.replace(destination);
    }
  }, [user, loading, router]);

  // State 1: Auth initializing — show neutral loader
  if (loading) return <PageLoader />;

  // State 2: Authenticated — show redirect loader (useEffect handles navigation)
  if (user) return <PageLoader message="Redirecting..." />;

  // State 3: Guest — render the auth form
  return <>{children}</>;
}
