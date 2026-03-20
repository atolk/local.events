"use client";

import { Heart } from "lucide-react";
import { useUserSettingsStore } from "@/stores/user-settings-store";
import { Button } from "@/components/ui/primitives/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  eventId: string;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function FavoriteButton({ eventId, size = "icon", className }: FavoriteButtonProps) {
  const toggleFavorite = useUserSettingsStore((s) => s.toggleFavorite);
  const isFavorite = useUserSettingsStore((s) => s.favorites.includes(eventId));

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(eventId);
      }}
      className={cn("group", className)}
      aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
    >
      <Heart
        className={cn(
          "size-5 transition-colors",
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground group-hover:text-red-400"
        )}
      />
    </Button>
  );
}
