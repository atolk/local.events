"use client";

import { useState } from "react";
import { CalendarRange, ChevronLeft, SlidersHorizontal } from "lucide-react";
import { SearchInput } from "@/components/features/search-input";
import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";
import { type DatePreset, useAppStateStore } from "@/stores/app-state-store";
import {
  CATEGORY_COLORS,
  CATEGORY_ICON_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from "@/lib/utils/constants";
import { cn } from "@/lib/utils";
import type { EventCategory } from "@/lib/types";

interface FiltersPanelProps {
  categories: readonly EventCategory[];
}

interface CategoryFilterSectionProps {
  categories: readonly EventCategory[];
}

type DistanceMode = "all" | "walk" | "transport";

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function getWeekRange(baseDate: Date): { from: string; to: string } {
  const day = baseDate.getDay();
  const diffToMonday = (day + 6) % 7;
  const start = new Date(baseDate);
  start.setDate(baseDate.getDate() - diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    from: startOfDay(start).toISOString(),
    to: endOfDay(end).toISOString(),
  };
}

function isoToInputDate(value: string | null): string {
  if (!value) {
    return "";
  }
  return value.slice(0, 10);
}

function inputDateToIso(value: string, end = false): string {
  const date = new Date(`${value}T00:00:00`);
  if (end) {
    date.setHours(23, 59, 59, 999);
  }
  return date.toISOString();
}

function CategoryFilterSection({ categories }: CategoryFilterSectionProps) {
  const activeCategory = useAppStateStore((state) => state.category);
  const setCategory = useAppStateStore((state) => state.setCategory);

  function handleSelect(category: EventCategory | null) {
    setCategory(category);
  }

  return (
    <div className="space-y-2 rounded-lg border border-border/70 bg-background/70 p-2">
      <p className="text-xs font-medium text-muted-foreground">Фильтр по категориям</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр категорий событий">
        <button
          type="button"
          onClick={() => handleSelect(null)}
          aria-pressed={activeCategory === null}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Badge
            variant={activeCategory === null ? "default" : "outline"}
            className="inline-flex cursor-pointer items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="size-3.5" />
            Все
          </Badge>
        </button>
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleSelect(cat)}
              aria-pressed={activeCategory === cat}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <Badge
                variant="secondary"
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 transition-colors",
                  activeCategory === cat
                    ? CATEGORY_COLORS[cat]
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <Icon className={cn("size-3.5", CATEGORY_ICON_COLORS[cat])} />
                {CATEGORY_LABELS[cat]}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DateFilterSection() {
  const dateFrom = useAppStateStore((state) => state.dateFrom);
  const dateTo = useAppStateStore((state) => state.dateTo);
  const datePreset = useAppStateStore((state) => state.datePreset);
  const setDateFilter = useAppStateStore((state) => state.setDateFilter);
  const clearDateFilter = useAppStateStore((state) => state.clearDateFilter);
  const now = new Date();

  const todayRange = {
    from: startOfDay(now).toISOString(),
    to: endOfDay(now).toISOString(),
  };
  const weekRange = getWeekRange(now);

  const activePreset: DatePreset | null =
    datePreset === "custom"
      ? "custom"
      : dateFrom && dateTo
        ? dateFrom === todayRange.from && dateTo === todayRange.to
          ? "today"
          : dateFrom === weekRange.from && dateTo === weekRange.to
            ? "week"
            : "custom"
        : null;

  function setPreset(preset: Exclude<DatePreset, "custom">) {
    const range = preset === "today" ? todayRange : weekRange;
    setDateFilter(range.from, range.to, preset);
  }

  function setCustomDate(value: string, key: "dateFrom" | "dateTo") {
    const parsedValue = value ? inputDateToIso(value, key === "dateTo") : null;
    const nextDateFrom = key === "dateFrom" ? parsedValue : dateFrom;
    const nextDateTo = key === "dateTo" ? parsedValue : dateTo;
    setDateFilter(nextDateFrom, nextDateTo, "custom");
  }

  return (
    <div className="space-y-2 rounded-lg border border-border/70 bg-background/70 p-2">
      <p className="text-xs font-medium text-muted-foreground">Фильтр по дате</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по дате">
        <button
          type="button"
          onClick={() => clearDateFilter()}
          aria-pressed={activePreset === null}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Badge
            variant={activePreset === null ? "default" : "outline"}
            className="inline-flex cursor-pointer items-center gap-1.5 transition-colors"
          >
            <CalendarRange className="size-3.5" />
            Все
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => setPreset("today")}
          aria-pressed={activePreset === "today"}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Badge variant={activePreset === "today" ? "default" : "outline"} className="cursor-pointer">
            Сегодня
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => setPreset("week")}
          aria-pressed={activePreset === "week"}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Badge variant={activePreset === "week" ? "default" : "outline"} className="cursor-pointer">
            Эта неделя
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => {
            setDateFilter(dateFrom ?? todayRange.from, dateTo ?? todayRange.to, "custom");
          }}
          aria-pressed={activePreset === "custom"}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Badge variant={activePreset === "custom" ? "default" : "outline"} className="cursor-pointer">
            Свои даты
          </Badge>
        </button>
      </div>

      {activePreset === "custom" ? (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={isoToInputDate(dateFrom)}
            onChange={(event) => setCustomDate(event.target.value, "dateFrom")}
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            aria-label="Дата начала"
          />
          <span className="text-xs text-muted-foreground">—</span>
          <input
            type="date"
            value={isoToInputDate(dateTo)}
            onChange={(event) => setCustomDate(event.target.value, "dateTo")}
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            aria-label="Дата окончания"
          />
        </div>
      ) : null}
    </div>
  );
}

function DistanceFilterSection() {
  const [mode, setMode] = useState<DistanceMode>("all");
  const [minutes, setMinutes] = useState(35);

  return (
    <div className="space-y-2 rounded-lg border border-border/70 bg-background/70 p-2">
      <p className="text-xs font-medium text-muted-foreground">Фильтр по расстоянию</p>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по расстоянию">
        <button
          type="button"
          onClick={() => setMode("all")}
          aria-pressed={mode === "all"}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Badge variant={mode === "all" ? "default" : "outline"} className="cursor-pointer">
            Все
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => setMode("walk")}
          aria-pressed={mode === "walk"}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Badge variant={mode === "walk" ? "default" : "outline"} className="cursor-pointer">
            Пешком
          </Badge>
        </button>
        <button
          type="button"
          onClick={() => setMode("transport")}
          aria-pressed={mode === "transport"}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Badge variant={mode === "transport" ? "default" : "outline"} className="cursor-pointer">
            Транспорт
          </Badge>
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Время в пути</span>
          <span className="font-medium text-foreground">{minutes} мин</span>
        </div>
        <input
          type="range"
          min={10}
          max={120}
          step={5}
          value={minutes}
          onChange={(event) => setMinutes(Number(event.target.value))}
          className="h-2 w-full cursor-pointer accent-primary"
          aria-label="Время в пути в минутах"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>10 мин</span>
          <span>120 мин</span>
        </div>
      </div>
    </div>
  );
}

export function FiltersPanel({ categories }: FiltersPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-background/55 shadow-lg backdrop-blur-md transition-all duration-300 ease-out",
        collapsed ? "w-11" : "w-[min(86vw,340px)]"
      )}
    >
      <div className="flex items-center gap-2 p-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Развернуть фильтры" : "Свернуть фильтры"}
        >
          {collapsed ? <SlidersHorizontal className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
        <button
          type="button"
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Развернуть фильтры" : "Свернуть фильтры"}
          className={cn(
            "overflow-hidden text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            collapsed ? "max-w-0 opacity-0" : "max-w-full opacity-100"
          )}
        >
          <p className="text-sm font-medium">Фильтры</p>
        </button>
      </div>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 px-3 pb-3">
            <SearchInput />
            <CategoryFilterSection categories={categories} />
            <DateFilterSection />
            <DistanceFilterSection />
          </div>
        </div>
      </div>
    </div>
  );
}
