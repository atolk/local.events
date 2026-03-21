"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/primitives/button";
import { cn } from "@/lib/utils";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4", className)} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function YandexIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4", className)} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12.186 2C7.842 2 5 4.62 5 8.276c0 3.14 1.95 5.18 5.008 5.18h.99v-1.93h-.99c-2.058 0-3.24-1.5-3.24-3.25 0-1.95 1.35-3.15 3.42-3.15 2.07 0 3.42 1.2 3.42 3.15v7.5c0 2.85-1.95 4.65-5.01 4.65H5v2h4.578c3.6 0 6.422-2.4 6.422-6.9V8.276C16 4.62 13.158 2 12.186 2z"
      />
    </svg>
  );
}

export type OAuthAvailability = {
  google: boolean;
  yandex: boolean;
};

export function OAuthButtons({ oauth }: { oauth: OAuthAvailability }) {
  if (!oauth.google && !oauth.yandex) {
    return (
      <p className="text-muted-foreground text-center text-xs">
        OAuth не настроен. Добавьте переменные AUTH_GOOGLE_* и AUTH_YANDEX_* в окружение.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {oauth.google ? (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => void signIn("google", { callbackUrl: "/" })}
        >
          <GoogleIcon />
          Войти через Google
        </Button>
      ) : null}
      {oauth.yandex ? (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => void signIn("yandex", { callbackUrl: "/" })}
        >
          <YandexIcon />
          Войти через Яндекс
        </Button>
      ) : null}
    </div>
  );
}
