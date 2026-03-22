"use client";

import { useState } from "react";
import { Button } from "@/components/ui/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/primitives/dialog";
import { Separator } from "@/components/ui/primitives/separator";
import { EmailLoginForm } from "./email-login-form";
import { OAuthButtons, type OAuthAvailability } from "./oauth-buttons";

export function LoginDialog({ oauth }: { oauth: OAuthAvailability }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Войти
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Вход в аккаунт</DialogTitle>
          <DialogDescription>
            Выберите способ входа или зарегистрируйтесь по email.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <OAuthButtons oauth={oauth} />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">или</span>
            </div>
          </div>
          <EmailLoginForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
