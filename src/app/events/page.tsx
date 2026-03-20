import { Suspense } from "react";
import type { Metadata } from "next";
import { getEvents } from "@/lib/dal/events";
import { EventList } from "@/components/features/event-list";
import { SearchInput } from "@/components/features/search-input";
import { FiltersPanel } from "@/components/features/category-filter";
import { Skeleton } from "@/components/ui/primitives/skeleton";
import { EVENT_CATEGORIES, type EventCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "События",
  description: "Просмотр и поиск всех предстоящих событий",
};

interface EventsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: EventCategory;
  }>;
}

function EventListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-[280px] rounded-xl" />
      ))}
    </div>
  );
}

async function FilteredEvents({ query, category }: { query?: string; category?: EventCategory }) {
  const events = await getEvents({ query, category });
  return (
    <EventList
      events={events}
      emptyMessage={
        query || category
          ? "По вашему запросу ничего не найдено. Попробуйте другие ключевые слова или фильтры."
          : "Событий пока нет."
      }
    />
  );
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { q, category } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">События</h1>
        <p className="text-muted-foreground">Найдите события, которые вам интересны</p>
      </div>

      <div className="space-y-4">
        <Suspense>
          <SearchInput />
        </Suspense>
        <Suspense
          fallback={
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          }
        >
          <FiltersPanel categories={EVENT_CATEGORIES} />
        </Suspense>
      </div>

      <Suspense fallback={<EventListSkeleton />}>
        <FilteredEvents query={q} category={category} />
      </Suspense>
    </div>
  );
}
