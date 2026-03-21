"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/primitives/button";
import { Input } from "@/components/ui/primitives/input";
import { Label } from "@/components/ui/primitives/label";
import { register } from "@/lib/auth/actions";
import { emailPasswordSchema } from "@/lib/validations/auth";

type Mode = "login" | "register";

export function EmailLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = { email: fd.get("email"), password: fd.get("password") };
    const parsed = emailPasswordSchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      setError(first.email?.[0] ?? first.password?.[0] ?? "Проверьте поля");
      return;
    }
    setPending(true);
    try {
      const res = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });
      if (res?.error || !res?.ok) {
        setError("Неверный email или пароль");
        return;
      }
      router.refresh();
      onSuccess();
    } finally {
      setPending(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    setPending(true);
    try {
      const result = await register(fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
      onSuccess();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 rounded-lg border p-1">
        <button
          type="button"
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "login"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => {
            setMode("login");
            setError(null);
          }}
        >
          Вход
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === "register"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => {
            setMode("register");
            setError(null);
          }}
        >
          Регистрация
        </button>
      </div>

      {mode === "login" ? (
        <form className="grid gap-3" onSubmit={(e) => void handleLogin(e)}>
          <div className="grid gap-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={pending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="auth-password">Пароль</Label>
            <Input
              id="auth-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              disabled={pending}
            />
          </div>
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Вход…" : "Войти"}
          </Button>
        </form>
      ) : (
        <form className="grid gap-3" onSubmit={(e) => void handleRegister(e)}>
          <div className="grid gap-2">
            <Label htmlFor="reg-name">Имя</Label>
            <Input id="reg-name" name="name" type="text" autoComplete="name" disabled={pending} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={pending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reg-password">Пароль</Label>
            <Input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              disabled={pending}
            />
          </div>
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Создание…" : "Зарегистрироваться"}
          </Button>
        </form>
      )}
    </div>
  );
}
