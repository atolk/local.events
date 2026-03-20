import Link from "next/link";
import { Button } from "@/components/ui/primitives/button";

export default function EventNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">Событие не найдено</h2>
      <p className="text-muted-foreground">
        Событие, которое вы ищете, не существует или было удалено.
      </p>
      <Button asChild>
        <Link href="/events">Перейти к событиям</Link>
      </Button>
    </div>
  );
}
