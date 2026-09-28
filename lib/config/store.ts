import {
  Truck,
  ShieldCheck,
  Lock,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

export interface TrustPillar {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Single Source of Truth (SSOT) for store guarantees, customer trust signals,
 * and service promises across OdysseyCart.
 */
export const TRUST_PILLARS: TrustPillar[] = [
  {
    id: "shipping",
    icon: Truck,
    title: "Worldwide Express",
    description: "Free delivery on orders over $100",
  },
  {
    id: "warranty",
    icon: ShieldCheck,
    title: "Lifetime Guarantee",
    description: "Heirloom-grade craftsmanship",
  },
  {
    id: "security",
    icon: Lock,
    title: "Secure Checkout",
    description: "256-bit encrypted transactions",
  },
  {
    id: "returns",
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Hassle-free risk-free trial",
  },
];
