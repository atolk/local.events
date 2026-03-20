"use client";

import { useUserSettingsStore } from "@/stores/user-settings-store";
import { MapView } from "./map-view";
import { ListView } from "./list-view";

export function ViewOrchestrator() {
  const viewMode = useUserSettingsStore((state) => state.viewMode);

  if (viewMode === "list") {
    return <ListView />;
  }

  return <MapView />;
}
