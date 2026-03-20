export const EVENT_CATEGORIES = [
  "music",
  "sports",
  "arts",
  "food",
  "tech",
  "business",
  "community",
  "outdoor",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  address?: string;
  category: EventCategory;
  lat: number;
  lng: number;
  imageUrl?: string;
  price?: string;
  organizer: string;
  tags: string[];
}

export interface EventFilters {
  query?: string;
  category?: EventCategory;
  dateFrom?: string;
  dateTo?: string;
}
