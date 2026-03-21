"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";

export type RegisterResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function register(formData: FormData): Promise<RegisterResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: String(formData.get("name") ?? ""),
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Проверьте поля формы",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const email = parsed.data.email;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "Пользователь с таким email уже зарегистрирован" };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name ?? email.split("@")[0],
      password: hashed,
    },
  });

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Не удалось войти после регистрации" };
    }
    throw error;
  }

  return { ok: true };
}
