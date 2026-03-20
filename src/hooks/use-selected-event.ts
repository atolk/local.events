"use client";

import { useEffect, useMemo } from "react";
import { useAppStateStore } from "@/stores/app-state-store";
import type { Event } from "@/lib/types";

export function useSelectedEvent(events: Event[]) {
  const selectedEventId = useAppStateStore((state) => state.selectedEventId);
  const setSelectedEventId = useAppStateStore((state) => state.setSelectedEventId);

  const selectedEvent = useMemo(
    () => (selectedEventId ? events.find((event) => event.id === selectedEventId) ?? null : null),
    [events, selectedEventId]
  );

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    const hasSelectedEvent = events.some((event) => event.id === selectedEventId);
    if (!hasSelectedEvent) {
      setSelectedEventId(null, "useSelectedEvent:missingEventReset");
    }
  }, [events, selectedEventId, setSelectedEventId]);

  return {
    selectedEventId,
    selectedEvent,
    setSelectedEventId,
  };
}
