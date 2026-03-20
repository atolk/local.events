"use client";

import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FavoriteButton } from "@/components/features/favorite-button";
import { useUserSettingsStore } from "@/stores/user-settings-store";

describe("FavoriteButton", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ favorites: [] });
  });

  it("toggles favorite state for an event", () => {
    render(<FavoriteButton eventId="evt-42" />);

    const button = screen.getByRole("button", { name: "Добавить в избранное" });
    fireEvent.click(button);

    expect(useUserSettingsStore.getState().favorites).toContain("evt-42");
    expect(screen.getByRole("button", { name: "Убрать из избранного" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Убрать из избранного" }));
    expect(useUserSettingsStore.getState().favorites).not.toContain("evt-42");
  });
});
