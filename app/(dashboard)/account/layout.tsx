"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ACCOUNT_MENU } from "@/lib/config/dashboard";
import { type SecondaryLink } from "@/components/dashboard/DashboardSidebar";
import { LogOut, ArrowLeft, Shield } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AccountShell>{children}</AccountShell>
    </ProtectedRoute>
  );
}

/** Inner shell — only renders after auth is confirmed */
function AccountShell({ children }: { children: React.ReactNode }) {
  const { logout, dbUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  // Build secondary links — admin link only visible to admins
  const secondaryLinks: SecondaryLink[] = [
    { label: "Back to Store", href: "/", icon: ArrowLeft },
    ...(dbUser?.role === "admin"
      ? [{ label: "Admin Dashboard", href: "/admin", icon: Shield }]
      : []),
  ];

  return (
    <DashboardLayout
      menuItems={ACCOUNT_MENU}
      title="My Account"
      secondaryLinks={secondaryLinks}
      bottomAction={{
        label: "Logout",
        icon: LogOut,
        onClick: handleLogout,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
