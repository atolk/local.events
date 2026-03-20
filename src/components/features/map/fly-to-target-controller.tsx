"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useAppStateStore } from "@/stores/app-state-store";

export function FlyToTargetController() {
  const map = useMap();
  const flyToTarget = useAppStateStore((state) => state.flyToTarget);
  const setFlyToTarget = useAppStateStore((state) => state.setFlyToTarget);

  useEffect(() => {
    if (!flyToTarget) {
      return;
    }

    map.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom);
    setFlyToTarget(null);
  }, [flyToTarget, map, setFlyToTarget]);

  return null;
}
