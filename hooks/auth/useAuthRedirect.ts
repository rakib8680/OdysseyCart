"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * A DRY hook that automatically redirects authenticated users
 * to their intended destination (via `?redirect=...`) or home.
 * 
 * It also returns a `redirect` function to manually trigger it
 * (e.g., after a successful form submission before state updates).
 */
export function useAuthRedirect() {
  const { user } = useAuth();
  const router = useRouter();

  const redirect = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirect") || "/";
    router.push(redirectUrl);
  };

  useEffect(() => {
    if (user) {
      redirect();
    }
  }, [user, router]);

  return { redirect };
}
