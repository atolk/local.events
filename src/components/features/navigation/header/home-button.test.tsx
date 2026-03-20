"use client";

import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { HomeButton } from "./home-button";
import { useUserSettingsStore } from "@/stores/user-settings-store";
import { useAppStateStore } from "@/stores/app-state-store";

describe("HomeButton", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ userLocation: null, viewMode: "map" });
    useAppStateStore.setState({ flyToTarget: null });
  });

  it("is disabled when userLocation is missing", () => {
    const { getAllByRole } = render(<HomeButton />);

    const button = getAllByRole("button", {
      name: "Центрировать карту на домашнем адресе",
    })[0];
    expect(button).toBeDisabled();
  });

  it("sets flyToTarget from user location", () => {
    useUserSettingsStore.setState({
      userLocation: { lat: 40.7128, lng: -74.006 },
      viewMode: "map",
    });

    const { getAllByRole } = render(<HomeButton />);
    fireEvent.click(
      getAllByRole("button", {
        name: "Центрировать карту на домашнем адресе",
      })[0]
    );

    expect(useAppStateStore.getState().flyToTarget).toEqual({
      lat: 40.7128,
      lng: -74.006,
      zoom: 13,
    });
  });

  it("switches to map view before setting target when currently in list mode", () => {
    useUserSettingsStore.setState({
      userLocation: { lat: 51.5074, lng: -0.1278 },
      viewMode: "list",
    });

    const { getAllByRole } = render(<HomeButton />);
    fireEvent.click(
      getAllByRole("button", {
        name: "Центрировать карту на домашнем адресе",
      })[0]
    );

    expect(useUserSettingsStore.getState().viewMode).toBe("map");
    expect(useAppStateStore.getState().flyToTarget).toEqual({
      lat: 51.5074,
      lng: -0.1278,
      zoom: 13,
    });
  });
});
