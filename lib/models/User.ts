import { Schema, models, model, Document, Model, Types } from "mongoose";

export interface IShippingAddress {
  _id?: Types.ObjectId;
  label: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name?: string;
  avatar?: string;
  role: "customer" | "admin";
  shippingAddresses: IShippingAddress[];
  isDeleted: boolean;
  deletedAt?: Date;
}

const ShippingAddressSchema = new Schema<IShippingAddress>({
  label: { type: String, required: true },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: false },
    avatar: { type: String },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    shippingAddresses: { type: [ShippingAddressSchema], default: [] },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

const User = (models.User as Model<IUser>) || model<IUser>("User", UserSchema);

export default User;
