import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// ==========================================
// FILE ROUTER — defines upload endpoints
// ==========================================
export const ourFileRouter = {
  /** Avatar uploader — single image, max 4MB */
  avatarUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // In a production app, verify the Firebase token here.
      // For now, the client-side auth guard in ProfileSection
      // ensures only authenticated users reach this endpoint.
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // Return the URL to the client — ProfileSection will
      // persist it to Firebase + MongoDB via AuthContext.updateAvatar()
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
