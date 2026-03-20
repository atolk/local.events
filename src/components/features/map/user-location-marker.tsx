"use client";

import { useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker, useMap } from "react-leaflet";
import { divIcon, type LeafletMouseEvent, type Marker as LeafletMarker } from "leaflet";
import { User } from "lucide-react";
import { useUserSettingsStore } from "@/stores/user-settings-store";

type UserCoordinates = { lat: number; lng: number };

interface UserLocationMarkerProps {
  fallbackPosition: UserCoordinates | null;
}

const userMarkerIcon = divIcon({
  html: renderToStaticMarkup(
    <div className="relative flex size-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg ring-2 ring-white">
      <span className="user-marker-pulse absolute inset-0 rounded-full bg-indigo-400" />
      <User className="relative z-10 size-4" strokeWidth={2.2} />
    </div>
  ),
  className: "!border-0 !bg-transparent",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

export function UserLocationMarker({ fallbackPosition }: UserLocationMarkerProps) {
  const map = useMap();
  const markerRef = useRef<LeafletMarker | null>(null);
  const isDraggingRef = useRef(false);
  const userLocation = useUserSettingsStore((state) => state.userLocation);
  const setUserLocation = useUserSettingsStore((state) => state.setUserLocation);
  const [dragMarkerPosition, setDragMarkerPosition] = useState<[number, number] | null>(null);
  const fallbackLat = fallbackPosition?.lat ?? null;
  const fallbackLng = fallbackPosition?.lng ?? null;
  const userLat = userLocation?.lat ?? null;
  const userLng = userLocation?.lng ?? null;
  const markerPosition: [number, number] | null = dragMarkerPosition
    ? dragMarkerPosition
    : userLocation
      ? [userLocation.lat, userLocation.lng]
      : fallbackPosition
        ? [fallbackPosition.lat, fallbackPosition.lng]
        : null;

  useEffect(() => {
    if (userLat === null && userLng === null && fallbackLat !== null && fallbackLng !== null) {
      setUserLocation({ lat: fallbackLat, lng: fallbackLng });
    }
  }, [fallbackLat, fallbackLng, setUserLocation, userLat, userLng]);

  useEffect(() => {
    const handleMapMouseMove = (event: LeafletMouseEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      if ((event.originalEvent as MouseEvent).buttons !== 2) {
        isDraggingRef.current = false;
        map.dragging.enable();
        map.getContainer().style.cursor = "";
        const finalPosition = markerRef.current?.getLatLng();
        if (finalPosition) {
          setUserLocation({ lat: finalPosition.lat, lng: finalPosition.lng });
        }
        setDragMarkerPosition(null);
        return;
      }

      const nextPosition: [number, number] = [event.latlng.lat, event.latlng.lng];
      markerRef.current?.setLatLng(event.latlng);
      setDragMarkerPosition(nextPosition);
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) {
        return;
      }

      isDraggingRef.current = false;
      map.dragging.enable();
      map.getContainer().style.cursor = "";

      const finalPosition = markerRef.current?.getLatLng();
      if (finalPosition) {
        setUserLocation({ lat: finalPosition.lat, lng: finalPosition.lng });
      }
      setDragMarkerPosition(null);
    };

    map.on("mousemove", handleMapMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      map.off("mousemove", handleMapMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      map.dragging.enable();
      map.getContainer().style.cursor = "";
    };
  }, [map, setUserLocation]);

  if (!markerPosition) {
    return null;
  }

  return (
    <Marker
      ref={markerRef}
      position={markerPosition}
      icon={userMarkerIcon}
      keyboard={false}
      bubblingMouseEvents={false}
      eventHandlers={{
        contextmenu: (event) => {
          event.originalEvent.preventDefault();
          event.originalEvent.stopPropagation();
          isDraggingRef.current = true;
          map.dragging.disable();
          map.getContainer().style.cursor = "grabbing";
          setDragMarkerPosition([event.latlng.lat, event.latlng.lng]);
        },
      }}
    />
  );
}
