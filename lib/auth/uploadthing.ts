import { UploadThingError } from "uploadthing/server";
import { connectDB } from "@/lib/db/mongoose";
import User, { IUser } from "@/lib/models/User";
import { verifyFirebaseToken, AuthError } from "./token";

/**
 * Extracts the bearer token from the incoming Uploadthing request,
 * verifies it with the generic token service, and validates the user in MongoDB.
 */
export async function authenticateUploadUser(req: Request): Promise<IUser> {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UploadThingError({
      code: "BAD_REQUEST",
      message: "Unauthorized: You must be logged in to upload files.",
    });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw new UploadThingError({
      code: "BAD_REQUEST",
      message: "Unauthorized: Empty authentication credentials provided.",
    });
  }

  // 1. Verify token authenticity via token service
  let verifiedUid: string;
  try {
    const verifiedPayload = await verifyFirebaseToken(token);
    verifiedUid = verifiedPayload.uid;
  } catch (err: any) {
    if (err instanceof AuthError) {
      throw new UploadThingError({
        code: "BAD_REQUEST",
        message: `Unauthorized: ${err.message}`,
      });
    }
    throw new UploadThingError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Authentication service error.",
    });
  }

  // 2. Connect to database and verify user
  await connectDB();
  const user = await User.findOne({ firebaseUid: verifiedUid, isDeleted: { $ne: true } });

  if (!user) {
    throw new UploadThingError({
      code: "BAD_REQUEST",
      message: "Unauthorized: User account not found or has been deactivated.",
    });
  }

  return user;
}

/**
 * Restricts upload endpoints strictly to users with role 'admin'.
 * Throws a FORBIDDEN (403) UploadThingError if the user is not an administrator.
 */
export async function requireAdminUploadUser(req: Request): Promise<IUser> {
  const user = await authenticateUploadUser(req);

  if (user.role !== "admin") {
    throw new UploadThingError({
      code: "FORBIDDEN",
      message: "Forbidden: Store administrator privileges required to upload product media.",
    });
  }

  return user;
}
