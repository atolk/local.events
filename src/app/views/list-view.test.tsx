import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Event } from "@/lib/types";
import { useAppStateStore } from "@/stores/app-state-store";
import { ListView } from "./list-view";

let mockEvents: Event[] = [];

vi.mock("@/components/features/category-filter", () => ({
  FiltersPanel: () => <div>FiltersPanel</div>,
}));

vi.mock("@/hooks/use-events", () => ({
  useEvents: () => ({ events: mockEvents, isLoading: false, error: null }),
}));

vi.mock("@/components/features/event-card", () => ({
  EventCard: ({ id, title }: { id: string; title: string }) => (
    <div data-testid="selected-event-card">{`${id}:${title}`}</div>
  ),
}));

function createEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: "evt-1",
    title: "Demo Event",
    description: "Description",
    date: "2026-03-20T18:00:00.000Z",
    location: "Demo Place",
    category: "music",
    lat: 0,
    lng: 0,
    organizer: "Org",
    tags: [],
    ...overrides,
  };
}

describe("ListView", () => {
  beforeEach(() => {
    useAppStateStore.setState({ selectedEventId: null });
    mockEvents = [];
  });

  it("selects an event when list item is clicked", () => {
    const first = createEvent({ id: "evt-1", title: "First Event" });
    const second = createEvent({
      id: "evt-2",
      title: "Second Event",
      category: "tech",
    });

    mockEvents = [first, second];
    render(<ListView />);

    fireEvent.click(screen.getByRole("button", { name: "Выбрать событие: Second Event" }));

    expect(useAppStateStore.getState().selectedEventId).toBe("evt-2");
    expect(screen.getByTestId("selected-event-card")).toHaveTextContent("evt-2:Second Event");
  });

  it("clears stale selection when selected event disappears from list", async () => {
    const selected = createEvent({ id: "evt-1", title: "Selected Event" });
    const other = createEvent({ id: "evt-2", title: "Other Event", category: "sports" });

    useAppStateStore.setState({ selectedEventId: "evt-1" });

    mockEvents = [selected, other];
    const { rerender } = render(<ListView />);

    mockEvents = [other];
    rerender(<ListView />);

    await waitFor(() => {
      expect(useAppStateStore.getState().selectedEventId).toBeNull();
    });
  });
});
