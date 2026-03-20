import Link from "next/link";
import { Calendar, MapPin, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/composites/card";
import { Badge } from "@/components/ui/primitives/badge";
import { FavoriteButton } from "@/components/features/favorite-button";
import { formatEventDate, isUpcoming } from "@/lib/utils/dates";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";
import type { EventCategory } from "@/lib/types";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  category: EventCategory;
  price?: string;
  description: string;
}

export function EventCard({
  id,
  title,
  date,
  location,
  category,
  price,
  description,
}: EventCardProps) {
  const upcoming = isUpcoming(date);

  return (
    <Link href={`/events/${id}`} className="block">
      <Card className="group h-full gap-0 py-0 transition-shadow hover:shadow-md">
        <CardHeader className="flex-row items-start justify-between gap-4 p-6">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn("text-[11px]", CATEGORY_COLORS[category])}
              >
                {CATEGORY_LABELS[category]}
              </Badge>
              {!upcoming && (
                <Badge variant="outline" className="text-[11px] text-muted-foreground">
                  Прошло
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg transition-colors group-hover:text-primary/80">
              {title}
            </CardTitle>
          </div>
          <FavoriteButton eventId={id} />
        </CardHeader>
        <CardContent className="space-y-2 p-6 pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 shrink-0" />
              <span>{formatEventDate(date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </CardContent>
        {price && (
          <CardFooter className="p-6 pt-0">
            <div className="flex items-center gap-2 text-sm">
              <Tag className="size-4" />
              <span className="font-medium">{price}</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
