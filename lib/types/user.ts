// ============================================================================
// USER & SHIPPING ADDRESS TYPES (SERIALIZED CLIENT DTOs)
// ============================================================================

export interface SerializedShippingAddress {
  _id: string;
  label: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  email?: string;
}

export interface DbUser {
  _id: string;
  firebaseUid: string;
  email: string;
  name?: string;
  avatar?: string;
  role: "customer" | "admin";
  shippingAddresses: SerializedShippingAddress[];
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type SerializedUser = DbUser;
