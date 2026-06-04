"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/**
 * Reusable logout handler — returns a stable callback
 * that logs the user out, shows a toast, and redirects to home.
 *
 * Used by both /account and /admin dashboard layouts.
 */
export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  return handleLogout;
}
