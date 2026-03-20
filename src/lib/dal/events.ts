import { cache } from "react";
import eventsData from "@/data/events.json";
import type { Event, EventFilters } from "@/lib/types";
import { eventSchema } from "@/lib/validations/event";

const validatedEvents: Event[] = eventsData.map((event) => eventSchema.parse(event));

export const getEvents = cache(async (filters?: EventFilters): Promise<Event[]> => {
  let events = [...validatedEvents];

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters?.category) {
    events = events.filter((e) => e.category === filters.category);
  }

  const dateFrom = filters?.dateFrom;
  if (dateFrom) {
    events = events.filter((e) => e.date >= dateFrom);
  }

  const dateTo = filters?.dateTo;
  if (dateTo) {
    events = events.filter((e) => e.date <= dateTo);
  }

  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

export const getEventById = cache(async (id: string): Promise<Event | undefined> => {
  return validatedEvents.find((e) => e.id === id);
});
