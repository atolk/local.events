import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useSWR from "swr";
import { useEvents } from "./use-events";

interface MockAppState {
  query: string;
  category: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}

let mockAppState: MockAppState = {
  query: "",
  category: null,
  dateFrom: null,
  dateTo: null,
};

vi.mock("swr", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("@/stores/app-state-store", () => ({
  useAppStateStore: (selector: (state: MockAppState) => unknown) => selector(mockAppState),
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

describe("useEvents", () => {
  beforeEach(() => {
    mockedUseSWR.mockReset();
  });

  it("uses base key and exposes loading state", () => {
    mockAppState = { query: "", category: null, dateFrom: null, dateTo: null };
    mockedUseSWR.mockReturnValue(createSWRMockResponse({
      data: undefined,
      error: undefined,
      isLoading: true,
    }));

    const { result } = renderHook(() => useEvents());

    expect(mockedUseSWR).toHaveBeenCalledWith("/api/events");
    expect(result.current.events).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("builds key with all active filters", () => {
    mockAppState = {
      query: "music",
      category: "music",
      dateFrom: "2026-01-01",
      dateTo: "2026-01-31",
    };
    mockedUseSWR.mockReturnValue(createSWRMockResponse({
      data: [],
      error: undefined,
      isLoading: false,
    }));

    renderHook(() => useEvents());

    expect(mockedUseSWR).toHaveBeenCalledWith(
      "/api/events?q=music&category=music&dateFrom=2026-01-01&dateTo=2026-01-31"
    );
  });

  it("maps SWR error to message string", () => {
    mockAppState = { query: "", category: null, dateFrom: null, dateTo: null };
    mockedUseSWR.mockReturnValue(createSWRMockResponse({
      data: undefined,
      error: new Error("boom"),
      isLoading: false,
    }));

    const { result } = renderHook(() => useEvents());

    expect(result.current.error).toBe("boom");
    expect(result.current.isLoading).toBe(false);
  });
});
