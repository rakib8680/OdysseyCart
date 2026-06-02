"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ACCOUNT_MENU } from "@/lib/config/dashboard";
import { LogOut } from "lucide-react";

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
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  return (
    <DashboardLayout
      menuItems={ACCOUNT_MENU}
      title="My Account"
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
