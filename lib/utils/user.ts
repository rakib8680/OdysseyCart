/**
 * Get user initials from display name or email.
 * Returns up to 2 uppercase characters for avatar fallbacks.
 */
export function getInitials(
  displayName?: string | null,
  email?: string | null,
): string {
  if (displayName) {
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email?.charAt(0).toUpperCase() || "U";
}
