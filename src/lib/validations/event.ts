import { z } from "zod";
import { EVENT_CATEGORIES } from "@/lib/types";

export const eventCategorySchema = z.enum(EVENT_CATEGORIES);

export const eventSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  date: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  location: z.string(),
  address: z.string().optional(),
  category: eventCategorySchema,
  lat: z.number(),
  lng: z.number(),
  imageUrl: z.string().optional(),
  price: z.string().optional(),
  organizer: z.string(),
  tags: z.array(z.string()),
});

export const eventFiltersSchema = z.object({
  query: z.string().optional(),
  category: eventCategorySchema.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
