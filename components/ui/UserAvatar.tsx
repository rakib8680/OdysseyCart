"use client";

import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/user";

interface UserAvatarProps {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Reusable user avatar — shows profile photo or initials fallback.
 * Used in Navbar, DashboardSidebar, and Account Overview.
 */
export function UserAvatar({
  photoURL,
  displayName,
  email,
  size = "md",
  className,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-xs",
  };

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt="avatar"
        className={cn(
          "rounded-full border-2 border-white shadow-sm",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm",
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(displayName, email)}
    </div>
  );
}
