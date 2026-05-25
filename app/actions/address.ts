"use server";

import { connectDB } from "@/lib/db/mongoose";
import User, { IShippingAddress } from "@/lib/models/User";
import { TAddressForm } from "@/lib/validations/checkout";

export async function getSavedAddresses(firebaseUid: string) {
  try {
    await connectDB();
    const user = await User.findOne({ firebaseUid }).lean();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Stringify and parse to ensure ObjectIds become standard strings for Next.js Client Components
    return {
      success: true,
      addresses: JSON.parse(JSON.stringify(user.shippingAddresses || [])),
    };
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return { success: false, message: "Failed to fetch addresses" };
  }
}

export async function saveAddress(
  firebaseUid: string,
  addressData: TAddressForm,
  label: string,
  setAsDefault: boolean = false,
) {
  try {
    await connectDB();
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.shippingAddresses.length >= 5) {
      return {
        success: false,
        message: "Maximum of 5 saved addresses reached.",
      };
    }

    // If this is the first address, automatically make it the default
    const isFirst = user.shippingAddresses.length === 0;
    const isDefault = isFirst || setAsDefault;

    // If this new one is default, unset default on all existing addresses
    if (isDefault) {
      user.shippingAddresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      label,
      ...addressData,
      isDefault,
    };

    user.shippingAddresses.push(newAddress as IShippingAddress);
    await user.save();

    return {
      success: true,
      message: "Address saved successfully",
      addresses: JSON.parse(JSON.stringify(user.shippingAddresses)),
    };
  } catch (error) {
    console.error("Error saving address:", error);
    return { success: false, message: "Failed to save address" };
  }
}

export async function deleteAddress(firebaseUid: string, addressId: string) {
  try {
    await connectDB();
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const addrIndex = user.shippingAddresses.findIndex(
      (addr) => addr._id?.toString() === addressId,
    );

    if (addrIndex === -1) {
      return { success: false, message: "Address not found" };
    }

    const wasDefault = user.shippingAddresses[addrIndex].isDefault;

    // Remove the address from the array
    user.shippingAddresses.splice(addrIndex, 1);

    // If we removed the default address, make the first remaining address the default
    if (wasDefault && user.shippingAddresses.length > 0) {
      user.shippingAddresses[0].isDefault = true;
    }

    await user.save();

    return {
      success: true,
      message: "Address deleted successfully",
      addresses: JSON.parse(JSON.stringify(user.shippingAddresses)),
    };
  } catch (error) {
    console.error("Error deleting address:", error);
    return { success: false, message: "Failed to delete address" };
  }
}

export async function setDefaultAddress(
  firebaseUid: string,
  addressId: string,
) {
  try {
    await connectDB();
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    let found = false;
    user.shippingAddresses.forEach((addr) => {
      if (addr._id?.toString() === addressId) {
        addr.isDefault = true;
        found = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!found) {
      return { success: false, message: "Address not found" };
    }

    await user.save();

    return {
      success: true,
      message: "Default address updated",
      addresses: JSON.parse(JSON.stringify(user.shippingAddresses)),
    };
  } catch (error) {
    console.error("Error setting default address:", error);
    return { success: false, message: "Failed to update default address" };
  }
}

// ==========================================
// UPDATE ADDRESS
// ==========================================

export async function updateAddress(
  firebaseUid: string,
  addressId: string,
  addressData: TAddressForm,
  label: string,
) {
  try {
    await connectDB();
    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const addr = user.shippingAddresses.find(
      (a) => a._id?.toString() === addressId,
    );
    if (!addr) {
      return { success: false, message: "Address not found" };
    }

    // Update fields
    addr.label = label;
    addr.fullName = addressData.fullName;
    addr.address = addressData.address;
    addr.city = addressData.city;
    addr.state = addressData.state;
    addr.zipCode = addressData.zipCode;
    addr.country = addressData.country;
    addr.phone = addressData.phone;

    await user.save();

    return {
      success: true,
      message: "Address updated successfully",
      addresses: JSON.parse(JSON.stringify(user.shippingAddresses)),
    };
  } catch (error) {
    console.error("Error updating address:", error);
    return { success: false, message: "Failed to update address" };
  }
}
