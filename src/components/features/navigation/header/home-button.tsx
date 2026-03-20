"use client";

import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStateStore } from "@/stores/app-state-store";
import { useUserSettingsStore } from "@/stores/user-settings-store";

const HOME_FLY_TO_ZOOM = 13;

export function HomeButton() {
  const userLocation = useUserSettingsStore((state) => state.userLocation);
  const viewMode = useUserSettingsStore((state) => state.viewMode);
  const setViewMode = useUserSettingsStore((state) => state.setViewMode);
  const setFlyToTarget = useAppStateStore((state) => state.setFlyToTarget);

  const isDisabled = userLocation === null;

  const handleClick = () => {
    if (!userLocation) {
      return;
    }
    if (viewMode === "list") {
      setViewMode("map");
    }
    setFlyToTarget({
      lat: userLocation.lat,
      lng: userLocation.lng,
      zoom: HOME_FLY_TO_ZOOM,
    });
  };

  return (
    <button
      type="button"
      aria-label="Центрировать карту на домашнем адресе"
      title={isDisabled ? "Set your location on the map first" : "Центрировать на домашнем адресе"}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border bg-muted/50 px-2 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors sm:gap-1.5 sm:px-3",
        isDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-muted"
      )}
    >
      <Home className="size-3.5" />
      <span className="hidden sm:inline">Дом</span>
    </button>
  );
}
