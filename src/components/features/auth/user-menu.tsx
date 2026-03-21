"use client";

import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/primitives/avatar";
import { Button } from "@/components/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/primitives/dropdown-menu";

function initials(name: string | null | undefined, email: string | null | undefined) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

export function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading" || !session?.user) {
    return (
      <Button type="button" variant="outline" size="icon" disabled aria-label="Загрузка профиля">
        <User className="size-4" />
      </Button>
    );
  }

  const user = session.user;
  const label = user.name ?? user.email ?? "Профиль";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" className="gap-2 px-2" aria-label={label}>
          <Avatar size="sm" className="size-8">
            {user.image ? <AvatarImage src={user.image} alt="" /> : null}
            <AvatarFallback className="text-xs">{initials(user.name, user.email)}</AvatarFallback>
          </Avatar>
          <span className="max-w-[120px] truncate text-sm font-medium">{label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user.name ? <p className="text-sm leading-none font-medium">{user.name}</p> : null}
            {user.email ? (
              <p className="text-muted-foreground text-xs leading-none">{user.email}</p>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void signOut({ redirect: false }).then(() => router.refresh());
          }}
        >
          <LogOut className="mr-2 size-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
