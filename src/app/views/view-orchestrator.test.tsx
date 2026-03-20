import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useUserSettingsStore } from "@/stores/user-settings-store";
import { ViewOrchestrator } from "./view-orchestrator";

vi.mock("./map-view", () => ({
  MapView: () => <div>MapView</div>,
}));

vi.mock("./list-view", () => ({
  ListView: () => <div>ListView</div>,
}));

describe("ViewOrchestrator", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ viewMode: "map" });
  });

  it("renders map view when mode is map", () => {
    render(<ViewOrchestrator />);

    expect(screen.getByText("MapView")).toBeInTheDocument();
    expect(screen.queryByText("ListView")).not.toBeInTheDocument();
  });

  it("renders list view when mode is list", () => {
    useUserSettingsStore.setState({ viewMode: "list" });

    render(<ViewOrchestrator />);

    expect(screen.getAllByText("ListView").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("MapView")).toHaveLength(0);
  });
});
