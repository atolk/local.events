"use client";

import { Heart, Trash2 } from "lucide-react";
import { useUserSettingsStore } from "@/stores/user-settings-store";
import { EventCard } from "@/components/features/event-card";
import { Button } from "@/components/ui/primitives/button";
import { Skeleton } from "@/components/ui/primitives/skeleton";
import { useFavoriteEvents } from "@/hooks/use-favorite-events";

export default function FavoritesPage() {
  const favorites = useUserSettingsStore((s) => s.favorites);
  const clearFavorites = useUserSettingsStore((s) => s.clearFavorites);
  const { events, isLoading: loading } = useFavoriteEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Избранное</h1>
          <p className="text-muted-foreground">Сохранено событий: {favorites.length}</p>
        </div>
        {favorites.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearFavorites}>
            <Trash2 className="size-4" />
            Очистить все
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <Heart className="size-12 text-muted-foreground/50" />
          <div className="space-y-1">
            <p className="text-lg font-medium">Пока нет избранных событий</p>
            <p className="text-muted-foreground">
              Нажмите на иконку сердца у любого события, чтобы сохранить его здесь
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="event-list-item">
              <EventCard
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                category={event.category}
                price={event.price}
                description={event.description}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
