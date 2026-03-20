"use client";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { useAppStateStore } from "@/stores/app-state-store";
import { FlyToTargetController } from "./fly-to-target-controller";

const flyToMock = vi.fn();

vi.mock("react-leaflet", () => ({
  useMap: () => ({
    flyTo: flyToMock,
  }),
}));

describe("FlyToTargetController", () => {
  beforeEach(() => {
    flyToMock.mockReset();
    useAppStateStore.setState({ flyToTarget: null });
  });

  it("calls map.flyTo and clears flyToTarget", () => {
    useAppStateStore.setState({
      flyToTarget: { lat: 48.8566, lng: 2.3522, zoom: 13 },
    });

    render(<FlyToTargetController />);

    expect(flyToMock).toHaveBeenCalledWith([48.8566, 2.3522], 13);
    expect(useAppStateStore.getState().flyToTarget).toBeNull();
  });

  it("does nothing when flyToTarget is null", () => {
    render(<FlyToTargetController />);

    expect(flyToMock).not.toHaveBeenCalled();
  });
});
