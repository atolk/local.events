import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useSWR from "swr";
import { useFavoriteEvents } from "./use-favorite-events";

interface MockUserSettingsState {
  favorites: string[];
}

let mockUserSettingsState: MockUserSettingsState = {
  favorites: [],
};

vi.mock("swr", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/stores/user-settings-store", () => ({
  useUserSettingsStore: (selector: (state: MockUserSettingsState) => unknown) =>
    selector(mockUserSettingsState),
}));

const mockedUseSWR = vi.mocked(useSWR);

function createSWRMockResponse({
  data,
  error,
  isLoading,
}: {
  data?: unknown;
  error?: unknown;
  isLoading: boolean;
}) {
  return {
    data,
    error,
    isLoading,
    isValidating: false,
    mutate: vi.fn(),
  };
}

describe("useFavoriteEvents", () => {
  beforeEach(() => {
    mockedUseSWR.mockReset();
  });

  it("uses null key when favorites are empty", () => {
    mockUserSettingsState = { favorites: [] };
    mockedUseSWR.mockReturnValue(createSWRMockResponse({
      data: undefined,
      error: undefined,
      isLoading: false,
    }));

    const { result } = renderHook(() => useFavoriteEvents());

    expect(mockedUseSWR).toHaveBeenCalledWith(null);
    expect(result.current.events).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("builds ids key when favorites are present", () => {
    mockUserSettingsState = { favorites: ["evt-1", "evt-2"] };
    mockedUseSWR.mockReturnValue(createSWRMockResponse({
      data: [],
      error: undefined,
      isLoading: false,
    }));

    renderHook(() => useFavoriteEvents());

    expect(mockedUseSWR).toHaveBeenCalledWith("/api/events?ids=evt-1,evt-2");
  });

  it("maps SWR error to message string", () => {
    mockUserSettingsState = { favorites: ["evt-1"] };
    mockedUseSWR.mockReturnValue(createSWRMockResponse({
      data: undefined,
      error: new Error("favorites failed"),
      isLoading: false,
    }));

    const { result } = renderHook(() => useFavoriteEvents());

    expect(result.current.error).toBe("favorites failed");
    expect(result.current.events).toEqual([]);
  });
});
