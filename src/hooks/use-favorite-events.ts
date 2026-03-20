"use client";

import { useMemo } from "react";
import useSWR from "swr";
import type { Event } from "@/lib/types";
import { useUserSettingsStore } from "@/stores/user-settings-store";

interface UseFavoriteEventsResult {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}

export function useFavoriteEvents(): UseFavoriteEventsResult {
  const favorites = useUserSettingsStore((state) => state.favorites);
  const key = useMemo(
    () => (favorites.length > 0 ? `/api/events?ids=${favorites.join(",")}` : null),
    [favorites]
  );

  const { data, error, isLoading } = useSWR<Event[]>(key);

  return {
    events: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
