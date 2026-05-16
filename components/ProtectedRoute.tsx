"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { toast } from "sonner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // If no valid session, redirect to login page.
      // We pass the current path as a URL parameter so they can be redirected back after successful login if we want.
      toast.error("Unauthorized Access. Please Login to continue.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <PageLoader message="Authenticating..." />;
  }

  // Prevent layout shifts/flashes of private content right before the router pushes to /login
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
