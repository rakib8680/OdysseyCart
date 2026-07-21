"use server";

import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Review from "@/lib/models/Review";
import Wishlist from "@/lib/models/Wishlist";
import Cart from "@/lib/models/Cart";
import { DisplayNameSchema, AvatarUrlSchema } from "@/lib/validations/profile";

// ==========================================
// UPDATE DISPLAY NAME
// ==========================================
export async function updateUserName(firebaseUid: string, name: string) {
  try {
    const { name: validName } = DisplayNameSchema.parse({ name });

    await connectDB();

    const user = await User.findOneAndUpdate(
      { firebaseUid, isDeleted: { $ne: true } },
      { name: validName },
      { new: true },
    );

    if (!user) {
      return { success: false, error: "User not found." };
    }

    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.error("Error updating user name:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// UPDATE AVATAR URL
// ==========================================
export async function updateUserAvatar(
  firebaseUid: string,
  avatarUrl: string,
) {
  try {
    const { avatarUrl: validUrl } = AvatarUrlSchema.parse({ avatarUrl });

    await connectDB();

    const user = await User.findOneAndUpdate(
      { firebaseUid, isDeleted: { $ne: true } },
      { avatar: validUrl },
      { new: true },
    );

    if (!user) {
      return { success: false, error: "User not found." };
    }

    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.error("Error updating avatar:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// DELETE ACCOUNT (Soft Delete + Anonymize)
// ==========================================
export async function deleteAccount(firebaseUid: string) {
  try {
    await connectDB();

    const user = await User.findOne({ firebaseUid, isDeleted: { $ne: true } });
    if (!user) {
      return { success: false, error: "User not found." };
    }

    // 1. Soft-delete + anonymize PII on user document
    await User.updateOne(
      { firebaseUid },
      {
        isDeleted: true,
        deletedAt: new Date(),
        name: "Deleted User",
        email: `deleted_${firebaseUid}@removed.com`,
        avatar: undefined,
        shippingAddresses: [],
      },
    );

    // 2. Anonymize review author names (reviews stay visible)
    await Review.updateMany(
      { userId: firebaseUid },
      { userName: "Deleted User" },
    );

    // 3. Cleanup non-business data (wishlist + cart)
    await Promise.all([
      Wishlist.deleteOne({ userId: firebaseUid }),
      Cart.deleteOne({ userId: firebaseUid }),
    ]);

    // NOTE: Orders are intentionally NOT touched — legal/tax compliance

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting account:", error);
    return { success: false, error: error.message };
  }
}
