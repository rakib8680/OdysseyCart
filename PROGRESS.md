# OdysseyCart — Session Progress

## 📦 Archived Progress (May - June)

* **Dual Dashboards:** Built the Admin and User dashboards with a shared shell, dynamic breadcrumbs, and role-based themes.
* **Order Management:** Implemented optimistic UI mutations, regex search, and the `TIMELINE_STEPS` data structure for tracking orders.
* **Analytics:** Created a highly performant `useAnalytics` caching hook, parallelized MongoDB aggregation pipelines, and responsive Recharts widgets.
* **Architecture & Polish:** Standardized `useAuthRedirect`, extracted shared components (e.g., `EmptyState`), and fixed UI race conditions.

---

## 🎯 July 21: User Profile Management & Settings

We implemented Phase 19: User Profile Management, focusing on a robust Settings dashboard, Uploadthing integration, and account deletion functionality.

### 1. Uploadthing Integration & Avatar Upload
- **Infrastructure**: Set up `@uploadthing/react`, created the Next.js API route (`app/api/uploadthing/core.ts`), and configured the `avatarUploader` endpoint (max 4MB, single image).
- **Custom Hooks**: Generated and extracted a strongly-typed `useUploadThing` hook into `hooks/useUploadThing.ts`.
- **Profile Section UI**: Built a clean, custom avatar upload experience using a hidden native file input instead of forcing the pre-built `UploadButton`, improving accessibility and control.

### 2. Dual-Sync Profile Updates
- **Validation**: Added Zod schemas (`DisplayNameSchema`, `AvatarUrlSchema`) in `lib/validations/profile.ts`.
- **AuthContext Methods**: Introduced `updateName` and `updateAvatar` to `AuthContext`, handling dual-syncing to both Firebase Auth (`updateProfile`) and MongoDB (`updateUserName` / `updateUserAvatar` server actions).

### 3. Account Security & Danger Zone
- **Provider-Aware Security**: Created `SecuritySection` that intelligently detects if a user authenticated via Google OAuth or Email/Password, hiding password reset logic for OAuth users and utilizing Firebase's `sendPasswordResetEmail` for native users.
- **Soft Deletion Flow**: Implemented `DangerZone` with an `AlertDialog` requiring users to type a shared constant `"DELETE"` to confirm. 
- **Anonymization**: The `deleteAccount` server action soft-deletes the user document, clears all PII (name, email, avatar), anonymizes author names on product reviews, and purges non-essential data (cart/wishlist), while preserving strict legal records (Orders).

### 4. Settings Dashboard Integration
- **Layout Construction**: Composed the `/account/settings` page shell incorporating `ProfileSection`, `SecuritySection`, and `DangerZone` with a cohesive, three-section design language.
- **Navigation & Loading**: Added the Settings page to `ACCOUNT_MENU` in the dashboard configuration and implemented a centralized `ProfileSettingsSkeleton` for initial loading states.
