import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, MapPin, Tag, User, Clock } from "lucide-react";
import Link from "next/link";
import { getEventById, getEvents } from "@/lib/dal/events";
import { EventList } from "@/components/features/event-list";
import { FavoriteButton } from "@/components/features/favorite-button";
import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";
import { Skeleton } from "@/components/ui/primitives/skeleton";
import { formatEventDateRange, formatEventTime, isUpcoming } from "@/lib/utils/dates";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return { title: "Событие не найдено" };

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "article",
    },
  };
}

async function RelatedEvents({ category, excludeId }: { category: string; excludeId: string }) {
  const events = await getEvents({ category: category as "music" });
  const related = events.filter((e) => e.id !== excludeId).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Похожие события</h2>
      <EventList events={related} />
    </section>
  );
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const upcoming = isUpcoming(event.date);

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/events">
            <ArrowLeft className="size-4" />
            Назад к событиям
          </Link>
        </Button>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={cn(CATEGORY_COLORS[event.category])}>
                  {CATEGORY_LABELS[event.category]}
                </Badge>
                {!upcoming && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Прошедшее событие
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            </div>
            <FavoriteButton eventId={event.id} size="default" />
          </div>

          <div className="grid gap-3 text-muted-foreground">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 shrink-0" />
              <span>{formatEventDateRange(event.date, event.endDate)}</span>
            </div>
            {event.endDate && (
              <div className="flex items-center gap-3">
                <Clock className="size-5 shrink-0" />
                <span>
                  {formatEventTime(event.date)} – {formatEventTime(event.endDate)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <MapPin className="size-5 shrink-0" />
              <div>
                <p>{event.location}</p>
                {event.address && <p className="text-sm">{event.address}</p>}
              </div>
            </div>
            {event.price && (
              <div className="flex items-center gap-3">
                <Tag className="size-5 shrink-0" />
                <span>{event.price}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <User className="size-5 shrink-0" />
              <span>{event.organizer}</span>
            </div>
          </div>

          <div className="max-w-none pt-4">
            <p className="leading-relaxed text-foreground/90">{event.description}</p>
          </div>

          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-7 w-40" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[280px] rounded-xl" />
              ))}
            </div>
          </div>
        }
      >
        <RelatedEvents category={event.category} excludeId={event.id} />
      </Suspense>
    </div>
  );
}
