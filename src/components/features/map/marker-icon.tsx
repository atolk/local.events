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
  const pinWidth = selected ? 48 : 40;
  const pinHeight = selected ? 64 : 54;
  const innerCircleSize = selected ? 30 : 26;
  const innerHoleRadius = selected ? 11 : 10.5;

  return (
    <div className="relative" style={{ width: pinWidth, height: pinHeight + 6 }}>
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.22)]"
        style={{ width: pinWidth, height: pinHeight }}
      >
        <svg viewBox="0 0 48 64" className="h-full w-full" aria-hidden="true">
          <path
            d="M24 0C11.85 0 2 9.85 2 22c0 16.5 17.3 36.8 21 41.9.5.7 1.5.7 2 0C28.7 58.8 46 38.5 46 22 46 9.85 36.15 0 24 0z"
            fill={color}
          />
          <circle cx="24" cy="22" r={innerHoleRadius} fill="white" />
        </svg>
      </div>
      <div
        className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-white"
        style={{ top: selected ? 10 : 9, width: innerCircleSize, height: innerCircleSize, color }}
      >
        <IconComponent className={selected ? "size-[21px]" : "size-[18px]"} />
      </div>
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-black/20 blur-[1px]",
          selected ? "h-2 w-6" : "h-[6px] w-5"
        )}
        style={{ top: pinHeight + 1 }}
      />
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
    iconSize: selected ? [48, 70] : [40, 60],
    iconAnchor: selected ? [24, 64] : [20, 54],
    popupAnchor: selected ? [0, -64] : [0, -54],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}
