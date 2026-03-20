import { LazyEventMap } from "@/components/features/map/lazy-event-map";
import { FiltersPanel } from "@/components/features/category-filter";
import { EVENT_CATEGORIES } from "@/lib/types";

export function MapView() {
  return (
    <section className="space-y-3">
      <div className="relative">
        <LazyEventMap
          className="h-[70dvh] min-h-[420px] md:h-[75dvh] xl:h-[calc(100dvh-9rem)] xl:min-h-[600px]"
        />

        <div className="absolute left-4 top-4 z-[500]">
          <FiltersPanel categories={EVENT_CATEGORIES} />
        </div>
      </div>
    </section>
  );
}
