"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/primitives/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">Что-то пошло не так</h2>
      <p className="text-muted-foreground">Произошла непредвиденная ошибка. Попробуйте еще раз.</p>
      <Button onClick={reset}>Повторить</Button>
    </div>
  );
}
