// Product Server Actions
// ======================
// "use server" — All functions in this file run on the server.
//
// Actions to implement:
// 1. getProducts()     — Fetch all products from MongoDB
// 2. getProductById()  — Fetch a single product by ID
// 3. addProduct()      — Create a new product (called from /items/add form)
// 4. deleteProduct()   — Delete a product by ID (called from /items/manage)
//
// Each action should:
// - Call connectDB() first
// - Use the Product model for queries
// - Use revalidatePath("/items") after mutations to refresh cached data
//
// Example:
//   "use server";
//   import { connectDB } from "@/lib/db/mongoose";
//   import Product from "@/lib/models/Product";
//   import { revalidatePath } from "next/cache";
//
//   export async function addProduct(formData: FormData) {
//     await connectDB();
//     // ... create product
//     revalidatePath("/items");
//   }
