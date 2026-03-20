import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGeolocation } from "./use-geolocation";

const HOME_LOCATION = { lat: -34.6037, lng: -58.3816 };

function setGeolocationMock(
  getCurrentPosition?: (
    success: PositionCallback,
    error?: PositionErrorCallback,
    options?: PositionOptions
  ) => void
) {
  Object.defineProperty(window.navigator, "geolocation", {
    configurable: true,
    value: getCurrentPosition
      ? { getCurrentPosition }
      : undefined,
  });
}

describe("useGeolocation", () => {
  let originalGeolocation: Geolocation | undefined;

  beforeEach(() => {
    originalGeolocation = window.navigator.geolocation;
  });

  afterEach(() => {
    Object.defineProperty(window.navigator, "geolocation", {
      configurable: true,
      value: originalGeolocation,
    });
    vi.restoreAllMocks();
  });

  it("uses home location when geolocation is not supported", async () => {
    setGeolocationMock();

    const { result } = renderHook(() => useGeolocation(HOME_LOCATION));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.position).toEqual(HOME_LOCATION);
    expect(result.current.error).toBe("Geolocation not supported");
  });

  it("uses home location when geolocation request fails", async () => {
    const getCurrentPosition = vi.fn(
      (_success: PositionCallback, error?: PositionErrorCallback) => {
        error?.({
          code: 1,
          message: "denied",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError);
      }
    );
    setGeolocationMock(getCurrentPosition);

    const { result } = renderHook(() => useGeolocation(HOME_LOCATION));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(result.current.position).toEqual(HOME_LOCATION);
    expect(result.current.error).toBe("Location denied or unavailable");
  });

  it("uses browser geolocation when available", async () => {
    const getCurrentPosition = vi.fn(
      (success: PositionCallback) => {
        success({
          coords: {
            latitude: 51.5074,
            longitude: -0.1278,
            accuracy: 12,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
            toJSON: () => ({}),
          },
          timestamp: Date.now(),
          toJSON: () => ({}),
        } as GeolocationPosition);
      }
    );
    setGeolocationMock(getCurrentPosition);

    const { result } = renderHook(() => useGeolocation(HOME_LOCATION));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.position).toEqual({ lat: 51.5074, lng: -0.1278 });
    expect(result.current.error).toBeNull();
  });
});
