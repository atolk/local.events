"use client";

import { Calendar, MapPin, X } from "lucide-react";
import { EventCard } from "@/components/features/event-card";
import { FiltersPanel } from "@/components/features/category-filter";
import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/utils/constants";
import { formatEventDate } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORIES } from "@/lib/types";
import { useEvents } from "@/hooks/use-events";
import { useSelectedEvent } from "@/hooks/use-selected-event";

export function ListView() {
  const { events, isLoading, error } = useEvents();
  const { selectedEventId, selectedEvent, setSelectedEventId } = useSelectedEvent(events);

  return (
    <section className="space-y-3">
      <div className="grid gap-4 xl:grid-cols-4">
        <aside className="xl:col-span-1 xl:self-start">
          <FiltersPanel categories={EVENT_CATEGORIES} />
        </aside>

        <div className="xl:col-span-2">
          <div className="space-y-2 rounded-xl border border-border/70 bg-card/40 p-3">
            <h2 className="text-sm font-semibold tracking-tight">Список событий</h2>
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Загрузка событий...</p>
            ) : error ? (
              <p className="py-8 text-center text-sm text-destructive">
                Не удалось загрузить события. Попробуйте обновить страницу.
              </p>
            ) : events.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">События не найдены.</p>
            ) : (
              <div className="max-h-[68dvh] space-y-2 overflow-y-auto pr-1">
                {events.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedEventId(event.id, "ListView:eventSelect")}
                    aria-label={`Выбрать событие: ${event.title}`}
                    className={cn(
                      "w-full rounded-lg border bg-background p-3 text-left transition-colors",
                      selectedEventId === event.id
                        ? "border-primary/70 ring-1 ring-primary/40"
                        : "border-border/70 hover:bg-muted/40"
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="line-clamp-1 font-medium">{event.title}</p>
                      <Badge variant="secondary" className={cn("text-[11px]", CATEGORY_COLORS[event.category])}>
                        {CATEGORY_LABELS[event.category]}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 shrink-0" />
                        <span>{formatEventDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="xl:col-span-1">
          <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold tracking-tight">Текущее событие</h2>
                <p className="text-xs text-muted-foreground">Выбрано из списка</p>
              </div>
              {selectedEvent ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setSelectedEventId(null, "ListView:detailPanelClose")}
                  aria-label="Снять выбор события"
                >
                  <X className="size-4" />
                </Button>
              ) : null}
            </div>

            {selectedEvent ? (
              <EventCard
                id={selectedEvent.id}
                title={selectedEvent.title}
                date={selectedEvent.date}
                location={selectedEvent.location}
                category={selectedEvent.category}
                price={selectedEvent.price}
                description={selectedEvent.description}
              />
            ) : (
              <p className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-sm text-muted-foreground">
                Выберите событие в списке, чтобы увидеть детали.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
