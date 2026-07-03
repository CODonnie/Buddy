import { z } from "zod";

//profile update
export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),

    bio: z
    .string()
    .max(300, "Bio cannot exceed 300 characters")
    .optional(),
});

//password change
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(6),

    newPassword: z.string().min(6),
});