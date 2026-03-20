import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";
export type ViewMode = "list" | "map";
type UserLocation = { lat: number; lng: number };

interface UserSettingsState {
  theme: ThemeMode;
  viewMode: ViewMode;
  favorites: string[];
  userLocation: UserLocation | null;
}

interface UserSettingsActions {
  setTheme: (theme: ThemeMode) => void;
  setViewMode: (viewMode: ViewMode) => void;
  toggleFavorite: (eventId: string) => void;
  clearFavorites: () => void;
  setUserLocation: (location: UserLocation) => void;
}

type UserSettingsStore = UserSettingsState & UserSettingsActions;

const STORAGE_VERSION = 1;

export const useUserSettingsStore = create<UserSettingsStore>()(
  persist(
    (set) => ({
      theme: "system",
      viewMode: "map",
      favorites: [],
      userLocation: null,
      setTheme: (theme) => set({ theme }),
      setViewMode: (viewMode) => set({ viewMode }),
      toggleFavorite: (eventId) =>
        set((state) => ({
          favorites: state.favorites.includes(eventId)
            ? state.favorites.filter((id) => id !== eventId)
            : [...state.favorites, eventId],
        })),
      clearFavorites: () => set({ favorites: [] }),
      setUserLocation: (userLocation) => set({ userLocation }),
    }),
    {
      name: `app-storage-v${STORAGE_VERSION}`,
      version: STORAGE_VERSION,
      migrate: (persistedState: unknown, version: number) => {
        if (version < STORAGE_VERSION) {
          return {
            theme: "system",
            viewMode: "map",
            favorites: [],
            userLocation: null,
            ...(persistedState as Partial<UserSettingsState>),
          };
        }
        return persistedState as UserSettingsStore;
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<UserSettingsStore> | undefined;
        return {
          ...currentState,
          ...persisted,
          viewMode: persisted?.viewMode ?? currentState.viewMode,
        };
      },
    }
  )
);
