"use client";

import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { Marker, type MarkerProps } from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import type { EventCategory } from "@/lib/types";
import { createEventMarkerLeafletIcon } from "./marker-icon";
import {
  applyEventMarkerInitial,
  applyEventMarkerSelectionTransition,
  EVENT_MARKER_ROOT_SELECTOR,
} from "./marker-selection";

type EventMapMarkerProps = Omit<MarkerProps, "icon" | "zIndexOffset"> & {
  category: EventCategory;
  selected: boolean;
  children?: ReactNode;
};

export function EventMapMarker({ category, selected, children, ...markerProps }: EventMapMarkerProps) {
  const markerRef = useRef<LeafletMarker | null>(null);
  const previousSelectedRef = useRef<boolean | undefined>(undefined);
  const icon = useMemo(() => createEventMarkerLeafletIcon({ category }), [category]);

  useLayoutEffect(() => {
    const el = markerRef.current?.getElement();
    const root = el?.querySelector<HTMLElement>(EVENT_MARKER_ROOT_SELECTOR) ?? null;
    const previous = previousSelectedRef.current;
    previousSelectedRef.current = selected;

    if (previous === undefined) {
      applyEventMarkerInitial(root, selected);
      return;
    }
    if (previous === selected) {
      return;
    }
    applyEventMarkerSelectionTransition(root, selected);
  }, [selected]);

  return (
    <Marker
      ref={markerRef}
      icon={icon}
      zIndexOffset={selected ? 1000 : 0}
      {...markerProps}
    >
      {children}
    </Marker>
  );
}
