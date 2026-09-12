import { createUploadthing, type FileRouter } from "uploadthing/next";
import {
  authenticateUploadUser,
  requireAdminUploadUser,
} from "@/lib/auth/uploadthing";

const f = createUploadthing();

// ==========================================
// FILE ROUTER — defines upload endpoints
// ==========================================
export const ourFileRouter = {
  /** Avatar uploader — single image, max 4MB, authenticated users only */
  avatarUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = await authenticateUploadUser(req);
      return {
        userId: user._id.toString(),
        firebaseUid: user.firebaseUid,
        userEmail: user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Return the URL to the client — ProfileSection will
      // persist it to Firebase + MongoDB via AuthContext.updateAvatar()
      return { url: file.ufsUrl, uploadedBy: metadata.userId };
    }),

  /** Product image uploader — multi-image for catalog creation/editing, max 8MB, up to 6 files, store admin only */
  productImageUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 6 },
  })
    .middleware(async ({ req }) => {
      const admin = await requireAdminUploadUser(req);
      return {
        userId: admin._id.toString(),
        firebaseUid: admin.firebaseUid,
        userEmail: admin.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl, uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
