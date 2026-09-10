import { z } from "zod"

const emailSchema = z
    .email("Enter a valid email address")
    .trim()
    .max(254)
    .transform((email) => email.toLowerCase())

export const registerSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: z.string().min(12).max(128),
    }),
})

export const loginSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: z.string().min(1).max(128),
    }),
})

export type RegisterBody = z.infer<typeof registerSchema>["body"]
export type LoginBody = z.infer<typeof loginSchema>["body"] 
