"use client";

import { renderToStaticMarkup } from "react-dom/server";
import { divIcon, type DivIcon } from "leaflet";
import { CATEGORY_ICONS, CATEGORY_MARKER_COLORS } from "@/lib/utils/constants";
import type { EventCategory } from "@/lib/types";
import { EVENT_MARKER_SCALE_INACTIVE, EVENT_MARKER_TRANSFORM_ORIGIN } from "./marker-selection";

export interface EventMarkerIconProps {
  category: EventCategory;
}

const PIN_WIDTH = 48;
const PIN_HEIGHT = 64;
const INNER_CIRCLE = 30;
const INNER_HOLE_R = 11;
const ICON_CLASS = "size-[21px]";
const ICON_BOX_HEIGHT = 70;

export function EventMarkerIcon({ category }: EventMarkerIconProps) {
  const IconComponent = CATEGORY_ICONS[category];
  const color = CATEGORY_MARKER_COLORS[category];

  return (
    <div className="relative overflow-visible" style={{ width: PIN_WIDTH, height: ICON_BOX_HEIGHT }}>
      <div
        data-event-marker-root=""
        className="pointer-events-auto absolute inset-0 overflow-visible"
        style={{
          transformOrigin: EVENT_MARKER_TRANSFORM_ORIGIN,
          transform: `scale(${EVENT_MARKER_SCALE_INACTIVE})`,
        }}
      >
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.22)]"
          style={{ width: PIN_WIDTH, height: PIN_HEIGHT }}
        >
          <svg viewBox="0 0 48 64" className="h-full w-full" aria-hidden="true">
            <path
              d="M24 0C11.85 0 2 9.85 2 22c0 16.5 17.3 36.8 21 41.9.5.7 1.5.7 2 0C28.7 58.8 46 38.5 46 22 46 9.85 36.15 0 24 0z"
              fill={color}
            />
            <circle cx="24" cy="22" r={INNER_HOLE_R} fill="white" />
          </svg>
        </div>
        <div
          className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-full bg-white"
          style={{ top: 10, width: INNER_CIRCLE, height: INNER_CIRCLE, color }}
        >
          <IconComponent className={ICON_CLASS} />
        </div>
        <div
          className="pointer-events-none absolute left-1/2 h-2 w-6 -translate-x-1/2 rounded-full bg-black/20 blur-[1px]"
          style={{ top: PIN_HEIGHT + 1 }}
        />
      </div>
    </div>
  );
}

const iconCache = new Map<EventCategory, DivIcon>();

export function createEventMarkerLeafletIcon({ category }: EventMarkerIconProps) {
  const cached = iconCache.get(category);

  if (cached) {
    return cached;
  }

  const icon = divIcon({
    html: renderToStaticMarkup(<EventMarkerIcon category={category} />),
    className: "!border-0 !bg-transparent",
    iconSize: [48, ICON_BOX_HEIGHT],
    iconAnchor: [24, 64],
    popupAnchor: [0, -64],
  });

  iconCache.set(category, icon);
  return icon;
}
