import { describe, test, expect, beforeEach } from "vitest";
import { useUserSettingsStore } from "./user-settings-store";

const STORAGE_KEY = "app-storage-v1";

describe("user-settings-store", () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  test("has correct initial state", () => {
    const state = useUserSettingsStore.getState();
    expect(state.theme).toBe("system");
    expect(state.viewMode).toBe("map");
    expect(state.favorites).toEqual([]);
    expect(state.userLocation).toBeNull();
  });

  test("setTheme updates theme", () => {
    useUserSettingsStore.getState().setTheme("dark");
    expect(useUserSettingsStore.getState().theme).toBe("dark");
  });

  test("setTheme accepts light, dark, system", () => {
    useUserSettingsStore.getState().setTheme("light");
    expect(useUserSettingsStore.getState().theme).toBe("light");

    useUserSettingsStore.getState().setTheme("dark");
    expect(useUserSettingsStore.getState().theme).toBe("dark");

    useUserSettingsStore.getState().setTheme("system");
    expect(useUserSettingsStore.getState().theme).toBe("system");
  });

  test("setViewMode updates view mode", () => {
    useUserSettingsStore.getState().setViewMode("list");
    expect(useUserSettingsStore.getState().viewMode).toBe("list");

    useUserSettingsStore.getState().setViewMode("map");
    expect(useUserSettingsStore.getState().viewMode).toBe("map");
  });

  test("toggleFavorite adds event when not in favorites", () => {
    useUserSettingsStore.getState().toggleFavorite("evt-1");
    expect(useUserSettingsStore.getState().favorites).toEqual(["evt-1"]);
  });

  test("toggleFavorite removes event when already in favorites", () => {
    useUserSettingsStore.getState().toggleFavorite("evt-1");
    useUserSettingsStore.getState().toggleFavorite("evt-1");
    expect(useUserSettingsStore.getState().favorites).toEqual([]);
  });

  test("toggleFavorite appends when adding multiple", () => {
    useUserSettingsStore.getState().toggleFavorite("evt-1");
    useUserSettingsStore.getState().toggleFavorite("evt-2");
    expect(useUserSettingsStore.getState().favorites).toEqual(["evt-1", "evt-2"]);
  });

  test("clearFavorites resets favorites", () => {
    useUserSettingsStore.getState().toggleFavorite("evt-1");
    useUserSettingsStore.getState().toggleFavorite("evt-2");
    useUserSettingsStore.getState().clearFavorites();
    expect(useUserSettingsStore.getState().favorites).toEqual([]);
  });

  test("setUserLocation updates userLocation", () => {
    const loc = { lat: 52.52, lng: 13.405 };
    useUserSettingsStore.getState().setUserLocation(loc);
    expect(useUserSettingsStore.getState().userLocation).toEqual(loc);
  });

  test("setUserLocation overwrites previous location", () => {
    useUserSettingsStore.getState().setUserLocation({ lat: 1, lng: 2 });
    useUserSettingsStore.getState().setUserLocation({ lat: 3, lng: 4 });
    expect(useUserSettingsStore.getState().userLocation).toEqual({ lat: 3, lng: 4 });
  });
});
