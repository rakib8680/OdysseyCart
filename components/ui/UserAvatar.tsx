"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/user";

interface UserAvatarProps {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Reusable user avatar — shows profile photo or initials fallback.
 * Used in Navbar, DashboardSidebar, Account Overview, and Profile Settings.
 * Automatically recovers to user initials if the image 404s or fails to load.
 */
export function UserAvatar({
  photoURL,
  displayName,
  email,
  size = "md",
  className,
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error state if photoURL changes (e.g. after uploading a new avatar)
  useEffect(() => {
    setImgError(false);
  }, [photoURL]);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-xs",
    lg: "w-16 h-16 text-lg",
  };

  const hasValidPhoto =
    Boolean(photoURL && photoURL.trim().length > 0) && !imgError;

  if (hasValidPhoto) {
    return (
      <img
        src={photoURL!}
        alt={displayName || "User avatar"}
        onError={() => setImgError(true)}
        className={cn(
          "rounded-full border-2 border-white shadow-sm object-cover",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm select-none",
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(displayName, email)}
    </div>
  );
}
