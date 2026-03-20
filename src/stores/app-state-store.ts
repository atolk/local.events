import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { EVENT_CATEGORIES, type EventCategory } from "@/lib/types";

export type DatePreset = "today" | "week" | "custom";

interface AppState {
  query: string;
  category: EventCategory | null;
  dateFrom: string | null;
  dateTo: string | null;
  datePreset: DatePreset | null;
  selectedEventId: string | null;
  lat: number | null;
  lng: number | null;
  z: number | null;
  south: number | null;
  west: number | null;
  north: number | null;
  east: number | null;
  flyToTarget: { lat: number; lng: number; zoom: number } | null;
}

interface AppActions {
  setSelectedEventId: (eventId: string | null, source: string) => void;
  setQuery: (query: string) => void;
  setCategory: (category: EventCategory | null) => void;
  setDateFilter: (
    dateFrom: string | null,
    dateTo: string | null,
    datePreset: DatePreset | null
  ) => void;
  clearDateFilter: () => void;
  setMapViewport: (params: {
    lat: number;
    lng: number;
    z: number;
    south: number;
    west: number;
    north: number;
    east: number;
  }) => void;
  clearMapViewport: () => void;
  setFlyToTarget: (target: { lat: number; lng: number; zoom: number } | null) => void;
}

type AppStateStore = AppState & AppActions;

const STORAGE_NAME = "appState";
const STORAGE_VERSION = 1;
const EVENT_CATEGORIES_SET: ReadonlySet<EventCategory> = new Set(EVENT_CATEGORIES);
const DATE_PRESETS: ReadonlySet<DatePreset> = new Set(["today", "week", "custom"]);

function normalizeCategory(value: string | null): EventCategory | null {
  if (!value || !EVENT_CATEGORIES_SET.has(value as EventCategory)) {
    return null;
  }
  return value as EventCategory;
}

function normalizeDatePreset(value: string | null): DatePreset | null {
  if (!value || !DATE_PRESETS.has(value as DatePreset)) {
    return null;
  }
  return value as DatePreset;
}

function parseNumber(value: string | null): number | null {
  if (value === null) {
    return null;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function setOrDelete(
  params: URLSearchParams,
  key: string,
  value: string | number | null | undefined
) {
  if (value === null || value === undefined || value === "") {
    params.delete(key);
    return;
  }
  params.set(key, String(value));
}

function replaceSearchParams(params: URLSearchParams) {
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", nextUrl);
}

const urlSearchStorage: StateStorage = {
  getItem: () => {
    if (typeof window === "undefined") {
      return null;
    }
    const params = new URLSearchParams(window.location.search);
    return JSON.stringify({
      state: {
        query: params.get("q") ?? "",
        category: normalizeCategory(params.get("category")),
        dateFrom: params.get("dateFrom"),
        dateTo: params.get("dateTo"),
        datePreset: normalizeDatePreset(params.get("datePreset")),
        selectedEventId: params.get("event"),
        lat: parseNumber(params.get("lat")),
        lng: parseNumber(params.get("lng")),
        z: parseNumber(params.get("z")),
        south: parseNumber(params.get("south")),
        west: parseNumber(params.get("west")),
        north: parseNumber(params.get("north")),
        east: parseNumber(params.get("east")),
      },
      version: STORAGE_VERSION,
    });
  },
  setItem: (_key, value) => {
    if (typeof window === "undefined") {
      return;
    }
    const parsed = JSON.parse(value) as { state?: Partial<AppState> };
    const state = parsed.state ?? {};
    const params = new URLSearchParams(window.location.search);

    setOrDelete(params, "q", state.query ?? "");
    setOrDelete(params, "category", state.category);
    setOrDelete(params, "dateFrom", state.dateFrom);
    setOrDelete(params, "dateTo", state.dateTo);
    setOrDelete(params, "datePreset", state.datePreset);
    setOrDelete(params, "event", state.selectedEventId);
    setOrDelete(params, "lat", state.lat);
    setOrDelete(params, "lng", state.lng);
    setOrDelete(params, "z", state.z);
    setOrDelete(params, "south", state.south);
    setOrDelete(params, "west", state.west);
    setOrDelete(params, "north", state.north);
    setOrDelete(params, "east", state.east);

    replaceSearchParams(params);
  },
  removeItem: () => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    [
      "q",
      "category",
      "dateFrom",
      "dateTo",
      "datePreset",
      "event",
      "lat",
      "lng",
      "z",
      "south",
      "west",
      "north",
      "east",
    ].forEach((param) => params.delete(param));
    replaceSearchParams(params);
  },
};

export const useAppStateStore = create<AppStateStore>()(
  persist(
    (set) => ({
      query: "",
      category: null,
      dateFrom: null,
      dateTo: null,
      datePreset: null,
      selectedEventId: null,
      lat: null,
      lng: null,
      z: null,
      south: null,
      west: null,
      north: null,
      east: null,
      flyToTarget: null,
      setQuery: (query) => set({ query }),
      setCategory: (category) => set({ category }),
      setDateFilter: (dateFrom, dateTo, datePreset) => set({ dateFrom, dateTo, datePreset }),
      clearDateFilter: () => set({ dateFrom: null, dateTo: null, datePreset: null }),
      setSelectedEventId: (eventId, source) =>
        set((state) => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[AppStateStore:selectedEventId:update]", {
              source,
              eventId,
              previousEventId: state.selectedEventId,
            });
          }
          return { selectedEventId: eventId };
        }),
      setMapViewport: (params) =>
        set({
          lat: params.lat,
          lng: params.lng,
          z: params.z,
          south: params.south,
          west: params.west,
          north: params.north,
          east: params.east,
        }),
      clearMapViewport: () =>
        set({
          lat: null,
          lng: null,
          z: null,
          south: null,
          west: null,
          north: null,
          east: null,
        }),
      setFlyToTarget: (flyToTarget) => set({ flyToTarget }),
    }),
    {
      name: STORAGE_NAME,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => urlSearchStorage),
      partialize: (state) => ({
        query: state.query,
        category: state.category,
        dateFrom: state.dateFrom,
        dateTo: state.dateTo,
        datePreset: state.datePreset,
        selectedEventId: state.selectedEventId,
        lat: state.lat,
        lng: state.lng,
        z: state.z,
        south: state.south,
        west: state.west,
        north: state.north,
        east: state.east,
      }),
    }
  )
);
