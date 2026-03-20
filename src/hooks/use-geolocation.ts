"use client";

import { useState, useEffect, useRef } from "react";

type Coordinates = { lat: number; lng: number };

export interface GeolocationState {
  position: Coordinates | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(fallbackPosition: Coordinates | null = null): GeolocationState {
  const [position, setPosition] = useState<Coordinates | null>(fallbackPosition);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fallbackPositionRef = useRef<Coordinates | null>(fallbackPosition);
  const fallbackLat = fallbackPosition?.lat ?? null;
  const fallbackLng = fallbackPosition?.lng ?? null;

  useEffect(() => {
    fallbackPositionRef.current =
      fallbackLat !== null && fallbackLng !== null ? { lat: fallbackLat, lng: fallbackLng } : null;

    if (position === null && fallbackLat !== null && fallbackLng !== null) {
      setPosition({ lat: fallbackLat, lng: fallbackLng });
    }
  }, [fallbackLat, fallbackLng, position]);

  useEffect(() => {
    const getFallbackPosition = () => fallbackPositionRef.current;

    if (typeof window === "undefined" || !navigator.geolocation) {
      setPosition((current) => current ?? getFallbackPosition());
      setLoading(false);
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
        setError(null);
      },
      () => {
        setPosition((current) => current ?? getFallbackPosition());
        setLoading(false);
        setError("Location denied or unavailable");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { position, loading, error };
}
