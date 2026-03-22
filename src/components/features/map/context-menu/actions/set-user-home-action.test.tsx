"use client";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useUserSettingsStore } from "@/stores/user-settings-store";
import { SetUserHomeAction } from "./set-user-home-action";

describe("SetUserHomeAction", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ userLocation: null });
  });

  it("calls setUserLocation with latlng and onClose", () => {
    const onClose = vi.fn();

    render(<SetUserHomeAction latlng={{ lat: 55.75, lng: 37.61 }} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /установить дом/i }));

    expect(useUserSettingsStore.getState().userLocation).toEqual({ lat: 55.75, lng: 37.61 });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
