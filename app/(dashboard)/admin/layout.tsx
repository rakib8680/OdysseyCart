"use client";

import { AdminRoute } from "@/components/AdminRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ADMIN_MENU } from "@/lib/config/dashboard";
import { ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <DashboardLayout
        menuItems={ADMIN_MENU}
        title="Admin Dashboard"
        bottomAction={{
          label: "Back to Store",
          icon: ArrowLeft,
          href: "/",
        }}
      >
        {children}
      </DashboardLayout>
    </AdminRoute>
  );
}
