"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProfileSection } from "@/components/account/ProfileSection";
import { SecuritySection } from "@/components/account/SecuritySection";
import { DangerZone } from "@/components/account/DangerZone";
import { ProfileSettingsSkeleton } from "@/components/skeletons";

export default function AccountSettingsPage() {
  const { user, loading } = useAuth();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your profile, security, and account preferences
        </p>
      </div>

      {loading || !user ? (
        <ProfileSettingsSkeleton />
      ) : (
        <div className="space-y-6">
          <ProfileSection />
          <SecuritySection />
          <DangerZone />
        </div>
      )}
    </div>
  );
}
