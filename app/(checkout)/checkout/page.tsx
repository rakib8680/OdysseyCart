"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageLoader } from "@/components/ui/PageLoader";
import { CheckoutPage } from "@/components/checkout/CheckoutPage";
import { getCheckoutCart } from "@/app/actions/checkout";
import { CartItem } from "@/lib/types/cart";

export default function CheckoutRoute() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

/** Inner component — only renders after auth is confirmed by ProtectedRoute */
function CheckoutContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [serverItems, setServerItems] = useState<CartItem[] | null>(null);
  const [fetchingCart, setFetchingCart] = useState(true);

  // Fetch server-verified cart data once authenticated
  useEffect(() => {
    async function fetchCart() {
      if (!user) return;

      setFetchingCart(true);
      const result = await getCheckoutCart(user.uid);

      if (result.success && result.items.length > 0) {
        setServerItems(result.items);
      } else if (result.success && result.items.length === 0) {
        toast.error("Your cart is empty. Add some items first!");
        router.push("/items");
      }
      setFetchingCart(false);
    }

    fetchCart();
  }, [user, router]);

  if (fetchingCart) {
    return <PageLoader message="Preparing checkout..." />;
  }

  if (!serverItems) {
    return null;
  }

  return <CheckoutPage cartItems={serverItems} />;
}
