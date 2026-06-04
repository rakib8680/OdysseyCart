"use client";

import { AdminRoute } from "@/components/AdminRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ADMIN_MENU } from "@/lib/config/dashboard";
import { useLogout } from "@/hooks/auth/useLogout";
import { ArrowLeft, User, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <AdminShell>{children}</AdminShell>
    </AdminRoute>
  );
}

/** Inner shell — only renders after auth is confirmed */
function AdminShell({ children }: { children: React.ReactNode }) {
  const handleLogout = useLogout();

  return (
    <DashboardLayout
      menuItems={ADMIN_MENU}
      title="Admin Dashboard"
      secondaryLinks={[
        { label: "My Account", href: "/account", icon: User },
        { label: "Back to Store", href: "/", icon: ArrowLeft },
      ]}
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
