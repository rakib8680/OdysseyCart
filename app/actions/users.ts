"use server";

import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";

export async function syncUser(firebaseUid: string, email: string, name?: string) {
  try {
    await connectDB();
    
    // Check if user already exists
    let user = await User.findOne({ firebaseUid });
    
    // If not, create a new user with default 'customer' role
    if (!user) {
      user = await User.create({
        firebaseUid,
        email,
        name: name || email.split('@')[0],
        role: "customer"
      });
    }
    
    // Return standard JSON object (required for Server Actions)
    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.error("Error syncing user:", error);
    return { success: false, error: error.message };
  }
}
