import { z } from "zod";
export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    country: z.string().optional(),
});
export const AuthResponseSchema = z.object({
    token: z.string(),
    user: UserSchema,
});
export type User = z.infer<typeof UserSchema>;
