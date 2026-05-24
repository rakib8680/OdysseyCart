"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DollarSign, Package, ShoppingBag } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { DashboardQuickLinks } from "@/components/dashboard/DashboardQuickLinks";
import { ADMIN_MENU } from "@/lib/config/dashboard";
import { getAdminStats, type AdminStats } from "@/app/actions/admin";
import { Skeleton } from "@/components/ui/skeleton";

const ADMIN_DESCRIPTIONS: Record<string, string> = {
  "/admin/orders": "View and manage all customer orders",
  "/admin/products": "Add, edit, and manage your product catalog",
};

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      const result = await getAdminStats(user.uid);
      if (result.success) {
        setStats(result.stats);
      }
      setLoading(false);
    }
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {loading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total Revenue"
              value={`$${(stats?.totalRevenue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              icon={DollarSign}
              accentColor="emerald"
            />
            <StatCard
              label="Total Orders"
              value={String(stats?.totalOrders ?? 0)}
              icon={Package}
              accentColor="blue"
            />
            <StatCard
              label="Total Products"
              value={String(stats?.totalProducts ?? 0)}
              icon={ShoppingBag}
              accentColor="amber"
            />
          </>
        )}
      </div>

      {/* Quick Links */}
      <DashboardQuickLinks
        menuItems={ADMIN_MENU}
        excludeHref="/admin"
        descriptions={ADMIN_DESCRIPTIONS}
      />
    </div>
  );
}

/** Loading skeleton for stat cards — matches StatCard dimensions */
function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}
