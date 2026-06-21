import { z } from "zod";

export const ShippingSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .regex(/[a-zA-Z]/, { message: "Full name must contain letters." }),
  address: z.string().min(5, { message: "Please enter your full address." }),
  city: z
    .string()
    .min(2, { message: "Please enter your city." })
    .regex(/[a-zA-Z]/, { message: "City must contain letters." }),
  state: z
    .string()
    .min(2, { message: "Please enter your state/province." })
    .regex(/[a-zA-Z]/, { message: "State must contain letters." }),
  zipCode: z
    .string()
    .min(4, { message: "Please enter a valid ZIP or postal code." }),
  country: z
    .string()
    .min(2, { message: "Please enter your country." })
    .regex(/[a-zA-Z]/, { message: "Country must contain letters." }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid phone number (min 10 digits)." }),
});

export type TShippingForm = z.infer<typeof ShippingSchema>;

/** Address-only fields (no email). Used for saved address management. */
export const AddressSchema = ShippingSchema.omit({ email: true });
export type TAddressForm = z.infer<typeof AddressSchema>;
