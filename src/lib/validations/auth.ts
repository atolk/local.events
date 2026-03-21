import { z } from "zod";

export const emailPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Некорректный email")
    .transform((e) => e.toLowerCase()),
  password: z.string().min(8, "Минимум 8 символов"),
});

export const registerSchema = z
  .object({
    email: z.string().trim().email("Некорректный email"),
    password: z.string().min(8, "Минимум 8 символов"),
    name: z.string().trim().max(80),
  })
  .transform(({ email, password, name }) => ({
    email: email.toLowerCase(),
    password,
    name: name.length > 0 ? name : undefined,
  }));
