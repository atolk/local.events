"use client";

import { List, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserSettingsStore, type ViewMode } from "@/stores/user-settings-store";

const VIEW_OPTIONS: ReadonlyArray<{ id: ViewMode; label: string; icon: typeof List }> = [
  { id: "list", label: "Список", icon: List },
  { id: "map", label: "Карта", icon: Map },
];

export function ViewSwitcher() {
  const viewMode = useUserSettingsStore((state) => state.viewMode);
  const setViewMode = useUserSettingsStore((state) => state.setViewMode);

  return (
    <div
      className="inline-flex items-center rounded-xl border bg-muted/50 p-1 shadow-sm"
      aria-label="Переключение вида: список или карта"
    >
      {VIEW_OPTIONS.map((view) => (
        <button
          key={view.id}
          type="button"
          aria-label={view.label}
          aria-pressed={viewMode === view.id}
          onClick={() => setViewMode(view.id)}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors sm:gap-1.5 sm:px-3",
            viewMode === view.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <view.icon className="size-3.5" />
          <span className="hidden sm:inline">{view.label}</span>
        </button>
      ))}
    </div>
  );
}
