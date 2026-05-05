"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, dbUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until both Firebase auth state and our MongoDB sync are finished
    if (!loading) {
      if (!user) {
        toast.error("Unauthorized Access. Please Login to continue.");
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (dbUser && dbUser.role !== "admin") {
        toast.error("Access Denied: Admins Only");
        router.push("/");
      }
    }
  }, [user, dbUser, loading, router, pathname]);

  // Loading state covering both Firebase SDK and MongoDB fetch
  if (loading || (user && !dbUser)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 w-full">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">
          Verifying Permissions...
        </p>
      </div>
    );
  }

  // Double check before rendering
  if (!user || dbUser?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
