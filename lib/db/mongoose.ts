// MongoDB Connection Singleton
// ============================
// This file creates and caches a single MongoDB connection
// so we don't open a new connection on every request.
//
// Steps:
// 1. Install mongoose: npm install mongoose
// 2. Add MONGODB_URI to your .env.local
// 3. Use connectDB() in your server actions/components before any DB operation
//
// Example usage:
//   import { connectDB } from "@/lib/db/mongoose";
//   await connectDB();
