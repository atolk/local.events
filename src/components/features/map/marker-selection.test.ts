import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  applyEventMarkerInitial,
  applyEventMarkerSelectionTransition,
  EVENT_MARKER_SCALE_ACTIVE,
  EVENT_MARKER_SCALE_INACTIVE,
} from "./marker-selection";

describe("applyEventMarkerInitial", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("does nothing when root is null", () => {
    expect(() => applyEventMarkerInitial(null, true)).not.toThrow();
  });

  test("sets inactive transform when not selected (no animate)", () => {
    const el = document.createElement("div");
    applyEventMarkerInitial(el, false);
    expect(el.style.transform).toContain(String(EVENT_MARKER_SCALE_INACTIVE));
  });

  test("sets active transform when animate is missing and selected", () => {
    const el = document.createElement("div");
    // @ts-expect-error remove WAAPI for fallback branch
    el.animate = undefined;
    applyEventMarkerInitial(el, true);
    expect(el.style.transform).toContain(String(EVENT_MARKER_SCALE_ACTIVE));
  });
});

describe("applyEventMarkerSelectionTransition", () => {
  test("does nothing when root is null", () => {
    expect(() => applyEventMarkerSelectionTransition(null, true)).not.toThrow();
  });

  test("sets resting transform when animate is missing", () => {
    const el = document.createElement("div");
    // @ts-expect-error remove WAAPI for fallback branch
    el.animate = undefined;
    applyEventMarkerSelectionTransition(el, false);
    expect(el.style.transform).toContain(String(EVENT_MARKER_SCALE_INACTIVE));
  });
});
