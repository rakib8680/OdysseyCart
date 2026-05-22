"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { AccountInfoCard } from "@/components/account/AccountInfoCard";
import { AccountQuickLinks } from "@/components/account/AccountQuickLinks";

export default function AccountPage() {
  const { user, dbUser } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center gap-4">
        <UserAvatar
          photoURL={user?.photoURL}
          displayName={user?.displayName}
          email={user?.email}
          size="md"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.displayName || "there"}!
          </h1>
          <p className="text-sm text-slate-500">
            Manage your account, orders, and addresses
          </p>
        </div>
      </div>

      {/* Info Card */}
      <AccountInfoCard user={user} dbUser={dbUser} />

      {/* Quick Links */}
      <AccountQuickLinks />
    </div>
  );
}
