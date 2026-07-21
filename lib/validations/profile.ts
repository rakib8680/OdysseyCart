import { z } from "zod";

// ==========================================
// DISPLAY NAME — reuses the same letter-check pattern as ShippingSchema.fullName
// ==========================================
export const DisplayNameSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must be under 50 characters." })
    .regex(/[a-zA-Z]/, { message: "Name must contain letters." }),
});

export type TDisplayNameForm = z.infer<typeof DisplayNameSchema>;

// ==========================================
// AVATAR URL — validates the URL stored after Uploadthing upload
// ==========================================
export const AvatarUrlSchema = z.object({
  avatarUrl: z.string().url({ message: "Invalid avatar URL." }),
});

export type TAvatarUrlForm = z.infer<typeof AvatarUrlSchema>;

// ==========================================
// DELETE ACCOUNT — user must type "DELETE" to confirm
// ==========================================
const DELETE_CONFIRMATION_PHRASE = "DELETE" as const;

export const DeleteAccountSchema = z.object({
  confirmation: z.string().refine((val) => val === DELETE_CONFIRMATION_PHRASE, {
    message: `Please type "${DELETE_CONFIRMATION_PHRASE}" to confirm.`,
  }),
});

export type TDeleteAccountForm = z.infer<typeof DeleteAccountSchema>;

export { DELETE_CONFIRMATION_PHRASE };
