"use client";

import { Home } from "lucide-react";
import { useUserSettingsStore } from "@/stores/user-settings-store";
import { Button } from "@/components/ui/primitives/button";
import { cn } from "@/lib/utils";

export type LatLng = { lat: number; lng: number };

export interface SetUserHomeActionProps {
  latlng: LatLng;
  onClose: () => void;
  className?: string;
}

export function SetUserHomeAction({ latlng, onClose, className }: SetUserHomeActionProps) {
  const setUserLocation = useUserSettingsStore((s) => s.setUserLocation);

  const handleClick = () => {
    setUserLocation(latlng);
    onClose();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("h-auto w-full justify-start gap-2 px-2 py-1.5 font-normal", className)}
      onClick={handleClick}
    >
      <Home className="size-4 shrink-0" aria-hidden />
      Установить дом
    </Button>
  );
}
