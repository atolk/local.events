"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Popup, useMap, useMapEvents } from "react-leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useAppStateStore } from "@/stores/app-state-store";
import { useUserSettingsStore } from "@/stores/user-settings-store";
import { CATEGORY_LABELS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";
import { FlyToTargetController } from "./fly-to-target-controller";
import { ContextMenuController } from "./context-menu";
import { EventMapMarker } from "./event-map-marker";
import { UserLocationMarker } from "./user-location-marker";

const DEFAULT_CENTER: [number, number] = [55.75251356119127, 37.61559963226319];
const DEFAULT_ZOOM = 15;
const DEMO_MARKER_COUNT = 10;
const CENTER_BIAS_FACTOR = 1.5;

interface MapViewportBounds {
  lat: number;
  lng: number;
  z: number;
  south: number;
  west: number;
  north: number;
  east: number;
}

function hasSameBounds(a: MapViewportBounds, b: MapViewportBounds) {
  return a.south === b.south && a.west === b.west && a.north === b.north && a.east === b.east;
}

function randomCloserToViewportCenter(min: number, max: number, unitValue: number) {
  const center = (min + max) / 2;
  const span = max - min;
  const compressedHalfSpan = span / (2 * CENTER_BIAS_FACTOR);
  return center + (unitValue * 2 - 1) * compressedHalfSpan;
}

function stringHash(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededUnit(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function MapCenterController({
  center,
  zoom,
  shouldWaitForGeolocation,
}: {
  center: [number, number];
  zoom: number;
  shouldWaitForGeolocation: boolean;
}) {
  const map = useMap();
  const hasSet = useRef(false);
  useEffect(() => {
    if (!shouldWaitForGeolocation && !hasSet.current) {
      map.setView(center, zoom);
      hasSet.current = true;
    }
  }, [map, center, zoom, shouldWaitForGeolocation]);
  return null;
}

function ViewportChangeController({
  onViewportChange,
}: {
  onViewportChange: (viewport: MapViewportBounds) => void;
}) {
  const map = useMap();

  const emitCurrentBounds = useCallback(() => {
    const bounds = map.getBounds();
    const center = map.getCenter();
    onViewportChange({
      lat: center.lat,
      lng: center.lng,
      z: map.getZoom(),
      south: bounds.getSouth(),
      west: bounds.getWest(),
      north: bounds.getNorth(),
      east: bounds.getEast(),
    });
  }, [map, onViewportChange]);

  useMapEvents({
    dragend: emitCurrentBounds,
    zoomend: emitCurrentBounds,
  });

  useEffect(() => {
    emitCurrentBounds();
  }, [emitCurrentBounds]);

  return null;
}

interface EventMapProps {
  events: Event[];
  className?: string;
}

export function EventMap({ events, className }: EventMapProps) {
  const userLocation = useUserSettingsStore((state) => state.userLocation);
  const { position, loading } = useGeolocation(userLocation);
  const selectedEventId = useAppStateStore((state) => state.selectedEventId);
  const setSelectedEventId = useAppStateStore((state) => state.setSelectedEventId);
  const setMapViewport = useAppStateStore((state) => state.setMapViewport);
  const lat = useAppStateStore((state) => state.lat);
  const lng = useAppStateStore((state) => state.lng);
  const z = useAppStateStore((state) => state.z);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [viewport, setViewport] = useState<MapViewportBounds | null>(null);
  const hasPersistedCenter = lat !== null && lng !== null;
  const center: [number, number] = hasPersistedCenter
    ? [lat, lng]
    : position
      ? [position.lat, position.lng]
      : DEFAULT_CENTER;
  const zoom = z ?? DEFAULT_ZOOM;

  const handleViewportChange = useCallback((nextViewport: MapViewportBounds) => {
    setViewport((prevViewport) => {
      if (prevViewport && hasSameBounds(prevViewport, nextViewport)) {
        return prevViewport;
      }
      return nextViewport;
    });
  }, []);

  useEffect(() => {
    if (!viewport) {
      return;
    }
    setMapViewport(viewport);
  }, [viewport, setMapViewport]);

  const eventsWithCoords = useMemo(() => {
    if (!viewport) {
      return [];
    }

    const viewportFingerprint = [viewport.south, viewport.west, viewport.north, viewport.east]
      .map((value) => value.toFixed(5))
      .join("|");

    const rankedEvents = [...events]
      .map((event) => ({
        event,
        rank: stringHash(`${viewportFingerprint}|rank|${event.id}`),
      }))
      .sort((a, b) => a.rank - b.rank)
      .map((entry) => entry.event);

    let sampledEvents = rankedEvents.slice(0, DEMO_MARKER_COUNT);

    if (selectedEventId) {
      const selectedEvent = events.find((event) => event.id === selectedEventId);
      if (selectedEvent && !sampledEvents.some((event) => event.id === selectedEventId)) {
        sampledEvents =
          DEMO_MARKER_COUNT > 0
            ? [selectedEvent, ...sampledEvents.slice(0, DEMO_MARKER_COUNT - 1)]
            : [selectedEvent];
      }
    }

    return sampledEvents.map((event) => ({
      ...event,
      lat: randomCloserToViewportCenter(
        viewport.south,
        viewport.north,
        seededUnit(stringHash(`${viewportFingerprint}|lat|${event.id}`))
      ),
      lng: randomCloserToViewportCenter(
        viewport.west,
        viewport.east,
        seededUnit(stringHash(`${viewportFingerprint}|lng|${event.id}`))
      ),
    }));
  }, [events, selectedEventId, viewport]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewportMode = () => setIsMobileViewport(mediaQuery.matches);
    syncViewportMode();

    mediaQuery.addEventListener("change", syncViewportMode);
    return () => {
      mediaQuery.removeEventListener("change", syncViewportMode);
    };
  }, []);

  return (
    <div
      className={cn(
        "event-map-canvas relative h-[280px] w-full overflow-hidden rounded-xl sm:h-[320px] md:h-[400px]",
        className
      )}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom
        attributionControl={false}
        zoomControl={false}
      >
        <MapCenterController
          center={center}
          zoom={zoom}
          shouldWaitForGeolocation={!hasPersistedCenter && userLocation === null && loading}
        />
        <FlyToTargetController />
        <ContextMenuController />
        <ViewportChangeController onViewportChange={handleViewportChange} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <UserLocationMarker fallbackPosition={position} />
        {eventsWithCoords.map((event) => (
          <EventMapMarker
            key={event.id}
            position={[event.lat, event.lng]}
            category={event.category}
            selected={selectedEventId === event.id}
            eventHandlers={{
              click: () => setSelectedEventId(event.id, "EventMap:markerClick"),
            }}
          >
            {isMobileViewport ? (
              <Popup className="event-map-mobile-popup">
                <div className="min-w-[180px]">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-muted-foreground text-xs">{CATEGORY_LABELS[event.category]}</p>
                  <Link
                    href={`/events/${event.id}`}
                    className="text-primary mt-2 inline-block text-sm underline"
                  >
                    Открыть детали
                  </Link>
                </div>
              </Popup>
            ) : null}
          </EventMapMarker>
        ))}
      </MapContainer>
    </div>
  );
}
