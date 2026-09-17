import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// We cache the connection so we don't open a new one on every single request in Next.js
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    let uri = MONGODB_URI as string;
    if (uri.includes("directConnection=true")) {
      uri = uri.replace(
        "directConnection=true",
        "replicaSet=atlas-z6h7jh-shard-0&retryWrites=true&w=majority",
      );
    }

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

import { serializeDoc } from "./serialize";
export { serializeDoc };

/**
 * Serialize a Mongoose document for Next.js client consumption.
 * Converts ObjectId → string, Date → string, etc.
 * Delegates to serializeDoc for centralized serialization.
 */
export function serialize<T = any>(doc: unknown): T {
  return serializeDoc<T>(doc);
}

/** Convert a string ID to a Mongoose ObjectId */
export function toObjectId(id: string) {
  return new mongoose.Types.ObjectId(id);
}
