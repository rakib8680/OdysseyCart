import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

/**
 * Type-safe Uploadthing hooks.
 * Re-exported with OurFileRouter type so endpoints are autocompleted.
 */
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
