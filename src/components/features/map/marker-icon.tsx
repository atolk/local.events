"use client";

import { renderToStaticMarkup } from "react-dom/server";
import { divIcon, type DivIcon } from "leaflet";
import { CATEGORY_ICONS, CATEGORY_MARKER_COLORS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";
import type { EventCategory } from "@/lib/types";

export interface EventMarkerIconProps {
  category: EventCategory;
  selected?: boolean;
}

export function EventMarkerIcon({ category, selected = false }: EventMarkerIconProps) {
  const IconComponent = CATEGORY_ICONS[category];
  const color = CATEGORY_MARKER_COLORS[category];

  return (
    <div
      className={cn(
        "flex min-w-10 items-center justify-center rounded-full bg-white shadow-md transition-all",
        selected ? "border-primary size-12 border-4" : "size-10 border-2 border-white"
      )}
      style={{ color }}
    >
      <IconComponent className={selected ? "size-6" : "size-5"} />
    </div>
  );
}

const iconCache = new Map<string, DivIcon>();

export function createEventMarkerLeafletIcon({ category, selected = false }: EventMarkerIconProps) {
  const cacheKey = `${category}:${selected}`;
  const cached = iconCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const icon = divIcon({
    html: renderToStaticMarkup(<EventMarkerIcon category={category} selected={selected} />),
    className: "!border-0 !bg-transparent",
    iconSize: selected ? [48, 48] : [40, 40],
    iconAnchor: selected ? [24, 48] : [20, 40],
    popupAnchor: selected ? [0, -48] : [0, -40],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}
