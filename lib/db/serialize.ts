// ============================================================================
// DOCUMENT SERIALIZATION SINGLE SOURCE OF TRUTH (SSOT)
// ============================================================================
// Converts Mongoose documents into plain JS objects safe for Next.js Server
// Actions and React Server/Client Components (ObjectIds → strings, Dates → ISO).

import type { DbUser } from "@/lib/types/user";
import type { SerializedOrder } from "@/lib/types/order";
import type { Review } from "@/lib/types/review";

/**
 * Generic document serializer. Converts Mongoose Documents, ObjectIds, and
 * Date objects into clean plain JSON primitives with compile-time type safety.
 */
export function serializeDoc<T>(doc: unknown): T {
  if (doc === null || doc === undefined) {
    return doc as T;
  }
  return JSON.parse(JSON.stringify(doc)) as T;
}

/**
 * Serializes a Mongoose User document into a strongly-typed DbUser DTO.
 */
export function serializeUser(doc: any): DbUser {
  if (!doc) return doc;

  const raw = typeof doc.toObject === "function" ? doc.toObject() : doc;

  return {
    _id: raw._id?.toString() || "",
    firebaseUid: raw.firebaseUid,
    email: raw.email,
    name: raw.name || undefined,
    avatar: raw.avatar || undefined,
    role: raw.role || "customer",
    shippingAddresses: (raw.shippingAddresses || []).map((addr: any) => ({
      _id: addr._id?.toString() || "",
      label: addr.label,
      fullName: addr.fullName,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      phone: addr.phone,
      isDefault: Boolean(addr.isDefault),
    })),
    isDeleted: Boolean(raw.isDeleted),
    deletedAt: raw.deletedAt ? new Date(raw.deletedAt).toISOString() : undefined,
    createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : new Date().toISOString(),
  };
}

/**
 * Converts a Mongoose Order document into a plain JS object safe for passing
 * from Server Actions to Client Components.
 * Preserves variantSku and maps selectedOptions cleanly.
 */
export function serializeOrder(doc: any): SerializedOrder {
  return {
    _id: doc._id.toString(),
    userId: doc.userId,
    stripePaymentId: doc.stripePaymentId || undefined,
    items: (doc.items || []).map((item: any) => {
      let selectedOptions: Record<string, string> | undefined = undefined;
      if (item.selectedOptions) {
        const rawOptions =
          item.selectedOptions instanceof Map
            ? Object.fromEntries(item.selectedOptions)
            : typeof item.selectedOptions.toJSON === "function"
              ? item.selectedOptions.toJSON()
              : typeof item.selectedOptions === "object"
                ? { ...item.selectedOptions }
                : undefined;

        if (rawOptions && Object.keys(rawOptions).length > 0) {
          selectedOptions = rawOptions;
        }
      }

      return {
        productId: item.productId.toString(),
        variantSku: item.variantSku || undefined,
        selectedOptions,
        title: item.title,
        price: item.price,
        image: item.image || "",
        quantity: item.quantity,
      };
    }),
    shippingInfo: {
      email: doc.shippingInfo.email,
      fullName: doc.shippingInfo.fullName,
      address: doc.shippingInfo.address,
      city: doc.shippingInfo.city,
      state: doc.shippingInfo.state,
      zipCode: doc.shippingInfo.zipCode,
      country: doc.shippingInfo.country,
      phone: doc.shippingInfo.phone,
    },
    subtotal: doc.subtotal,
    tax: doc.tax,
    shippingCost: doc.shippingCost,
    discount: doc.discount || 0,
    couponCode: doc.couponCode || undefined,
    total: doc.total,
    status: doc.status,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

/**
 * Converts a Mongoose Review document into a plain JS Review object.
 */
export function serializeReview(doc: any): Review {
  return {
    _id: doc._id.toString(),
    productId: doc.productId.toString(),
    userId: doc.userId,
    userName: doc.userName,
    rating: doc.rating,
    title: doc.title,
    body: doc.body,
    isVerifiedPurchase: Boolean(doc.isVerifiedPurchase),
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}
