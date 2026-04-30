// Product Mongoose Model
// ======================
// Define the schema and model for products in MongoDB.
//
// Fields to include (based on your Add Product form):
// - title: string (required)
// - shortDescription: string (required)
// - fullDescription: string (required)
// - price: number (required)
// - category: string (required) — e.g. "Electronics", "Furniture", "Accessories"
// - imageUrl: string (optional)
// - status: string — e.g. "In Stock", "Out of Stock"
// - createdBy: string — Firebase user UID
// - createdAt: Date
//
// Example usage:
//   import Product from "@/lib/models/Product";
//   const products = await Product.find();
