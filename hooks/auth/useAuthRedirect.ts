"use client";

import { useRouter } from "next/navigation";

/**
 * Returns a redirect function for post-login/register navigation.
 * Reads the `?redirect=...` query param to send the user to their
 * intended destination, or falls back to home.
 *
 * NOTE: This hook does NOT guard routes. Route guarding for
 * guest-only pages is handled by the (auth) layout.
 */
export function useAuthRedirect() {
  const router = useRouter();

  const redirect = () => {
    const params = new URLSearchParams(window.location.search);
    const destination = params.get("redirect") || "/";
    router.replace(destination);
  };

  return { redirect };
}
