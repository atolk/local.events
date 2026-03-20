import { EventCard } from "@/components/features/event-card";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventListProps {
  events: Event[];
  emptyMessage?: string;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function EventList({
  events,
  emptyMessage = "События не найдены.",
  columns = 3,
  className,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const gridClassName =
    columns === 1
      ? "grid gap-4"
      : columns === 2
        ? "grid gap-4 sm:grid-cols-2"
        : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cn(gridClassName, className)}>
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
  );
}
