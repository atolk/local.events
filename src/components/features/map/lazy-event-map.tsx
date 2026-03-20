"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { EventCard } from "@/components/features/event-card";
import { Button } from "@/components/ui/primitives/button";
import { Skeleton } from "@/components/ui/primitives/skeleton";
import { useEvents } from "@/hooks/use-events";
import { useSelectedEvent } from "@/hooks/use-selected-event";
import { cn } from "@/lib/utils";

const EventMap = dynamic(
  () => import("@/components/features/map/event-map").then((m) => m.EventMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

const EVENT_PANEL_ANIMATION_MS = 260;

function MapSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn("h-[280px] w-full rounded-xl sm:h-[320px] md:h-[400px]", className)}
    />
  );
}

interface LazyEventMapProps {
  className?: string;
}

export function LazyEventMap({ className }: LazyEventMapProps) {
  const { events, isLoading } = useEvents();
  const { selectedEvent, setSelectedEventId } = useSelectedEvent(events);
  const [visibleEventPanelId, setVisibleEventPanelId] = useState<string | null>(
    selectedEvent?.id ?? null
  );
  const [isEventPanelVisible, setIsEventPanelVisible] = useState(Boolean(selectedEvent));
  const hidePanelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hidePanelTimeoutRef.current) {
      clearTimeout(hidePanelTimeoutRef.current);
      hidePanelTimeoutRef.current = null;
    }

    if (selectedEvent) {
      setVisibleEventPanelId(selectedEvent.id);
      setIsEventPanelVisible(true);
      return;
    }

    if (!visibleEventPanelId) {
      setIsEventPanelVisible(false);
      return;
    }

    setIsEventPanelVisible(false);
    hidePanelTimeoutRef.current = setTimeout(() => {
      setVisibleEventPanelId(null);
      hidePanelTimeoutRef.current = null;
    }, EVENT_PANEL_ANIMATION_MS);
  }, [selectedEvent, visibleEventPanelId]);

  useEffect(() => {
    return () => {
      if (hidePanelTimeoutRef.current) {
        clearTimeout(hidePanelTimeoutRef.current);
      }
    };
  }, []);

  const visibleEventPanel =
    visibleEventPanelId ? events.find((event) => event.id === visibleEventPanelId) ?? null : null;

  if (isLoading) {
    return <MapSkeleton className={className} />;
  }

  return (
    <>
      <EventMap events={events} className={className} />
      {visibleEventPanel ? (
        <div className="pointer-events-none absolute inset-y-4 right-4 z-[500] hidden w-[380px] max-w-[48%] md:block">
          <div
            className={cn(
              "pointer-events-auto h-full space-y-3 overflow-y-auto rounded-xl border border-border/70 bg-background/55 p-4 shadow-lg backdrop-blur-md transition-all duration-300",
              isEventPanelVisible ? "translate-x-0 scale-100 opacity-100" : "translate-x-4 scale-95 opacity-0"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Текущее событие</h2>
                <p className="text-sm text-muted-foreground">Выбрано на карте</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setSelectedEventId(null, "LazyEventMap:detailPanelClose")}
                aria-label="Закрыть детали события"
              >
                <X className="size-4" />
              </Button>
            </div>
            <EventCard
              id={visibleEventPanel.id}
              title={visibleEventPanel.title}
              date={visibleEventPanel.date}
              location={visibleEventPanel.location}
              category={visibleEventPanel.category}
              price={visibleEventPanel.price}
              description={visibleEventPanel.description}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
