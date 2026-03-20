import { describe, test, expect, beforeEach, vi } from "vitest";
import { useAppStateStore } from "./app-state-store";

describe("app-state-store", () => {
  beforeEach(() => {
    // Clear URL search params so persist hydration starts from clean state
    window.history.replaceState(
      {},
      "",
      window.location.pathname + window.location.hash
    );
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  test("has correct initial state", () => {
    const state = useAppStateStore.getState();
    expect(state.query).toBe("");
    expect(state.category).toBeNull();
    expect(state.dateFrom).toBeNull();
    expect(state.dateTo).toBeNull();
    expect(state.datePreset).toBeNull();
    expect(state.selectedEventId).toBeNull();
    expect(state.lat).toBeNull();
    expect(state.lng).toBeNull();
    expect(state.z).toBeNull();
    expect(state.south).toBeNull();
    expect(state.west).toBeNull();
    expect(state.north).toBeNull();
    expect(state.east).toBeNull();
    expect(state.flyToTarget).toBeNull();
  });

  test("setQuery updates query", () => {
    useAppStateStore.getState().setQuery("concert");
    expect(useAppStateStore.getState().query).toBe("concert");
  });

  test("setCategory updates category with valid value", () => {
    useAppStateStore.getState().setCategory("music");
    expect(useAppStateStore.getState().category).toBe("music");
  });

  test("setCategory accepts null", () => {
    useAppStateStore.getState().setCategory("music");
    useAppStateStore.getState().setCategory(null);
    expect(useAppStateStore.getState().category).toBeNull();
  });

  test("setDateFilter updates date fields", () => {
    useAppStateStore
      .getState()
      .setDateFilter("2025-03-01", "2025-03-31", "custom");
    const state = useAppStateStore.getState();
    expect(state.dateFrom).toBe("2025-03-01");
    expect(state.dateTo).toBe("2025-03-31");
    expect(state.datePreset).toBe("custom");
  });

  test("clearDateFilter resets date fields", () => {
    useAppStateStore
      .getState()
      .setDateFilter("2025-03-01", "2025-03-31", "custom");
    useAppStateStore.getState().clearDateFilter();
    const state = useAppStateStore.getState();
    expect(state.dateFrom).toBeNull();
    expect(state.dateTo).toBeNull();
    expect(state.datePreset).toBeNull();
  });

  test("setSelectedEventId updates selectedEventId", () => {
    useAppStateStore.getState().setSelectedEventId("evt-123", "test");
    expect(useAppStateStore.getState().selectedEventId).toBe("evt-123");
  });

  test("setSelectedEventId accepts null", () => {
    useAppStateStore.getState().setSelectedEventId("evt-123", "test");
    useAppStateStore.getState().setSelectedEventId(null, "test");
    expect(useAppStateStore.getState().selectedEventId).toBeNull();
  });

  test("setMapViewport updates map viewport fields", () => {
    useAppStateStore.getState().setMapViewport({
      lat: 52.52,
      lng: 13.405,
      z: 10,
      south: 52.4,
      west: 13.2,
      north: 52.6,
      east: 13.6,
    });
    const state = useAppStateStore.getState();
    expect(state.lat).toBe(52.52);
    expect(state.lng).toBe(13.405);
    expect(state.z).toBe(10);
    expect(state.south).toBe(52.4);
    expect(state.west).toBe(13.2);
    expect(state.north).toBe(52.6);
    expect(state.east).toBe(13.6);
  });

  test("clearMapViewport resets map viewport fields", () => {
    useAppStateStore.getState().setMapViewport({
      lat: 52.52,
      lng: 13.405,
      z: 10,
      south: 52.4,
      west: 13.2,
      north: 52.6,
      east: 13.6,
    });
    useAppStateStore.getState().clearMapViewport();
    const state = useAppStateStore.getState();
    expect(state.lat).toBeNull();
    expect(state.lng).toBeNull();
    expect(state.z).toBeNull();
    expect(state.south).toBeNull();
    expect(state.west).toBeNull();
    expect(state.north).toBeNull();
    expect(state.east).toBeNull();
  });

  test("setFlyToTarget sets and clears flyToTarget", () => {
    useAppStateStore
      .getState()
      .setFlyToTarget({ lat: 52.52, lng: 13.405, zoom: 13 });
    expect(useAppStateStore.getState().flyToTarget).toEqual({
      lat: 52.52,
      lng: 13.405,
      zoom: 13,
    });

    useAppStateStore.getState().setFlyToTarget(null);
    expect(useAppStateStore.getState().flyToTarget).toBeNull();
  });
});
