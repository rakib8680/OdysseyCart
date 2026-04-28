"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
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

  // Firebase auth check takes a fraction of a second. Show a nice loader instead of blank screen.
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 w-full">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
          Authenticating...
        </p>
      </div>
    );
  }

  // Prevent layout shifts/flashes of private content right before the router pushes to /login
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
