# Map context menu

## Architecture

- **`context-menu-controller.tsx`** — Leaflet `contextmenu` listener (`useMapEvents`), open/close state, container-relative positioning, portal into `map.getContainer()`, dismiss handlers (Escape, pointer outside, scroll, `movestart`/`zoomstart`). Does not know what each action does.
- **`actions/*`** — One component per menu row. Props: `latlng`, `onClose`. Owns label, icon, and side effects (e.g. `setUserLocation`).

Radix `ContextMenu` is not used: Leaflet owns the map DOM; Radix expects a React trigger wrapping the hit target, so map/tile right-clicks are not a good fit.

## Adding a new action

1. Add `actions/your-action.tsx` with `latlng` + `onClose`.
2. Import and render it inside the controller next to existing actions (subscribe to stores only in the action leaf).

## Dismiss triggers

Escape, pointerdown outside the menu, window scroll (capture), map move start, map zoom start, successful action (action calls `onClose`).

## Interaction with the user marker

`UserLocationMarker` stops propagation on marker `contextmenu`, so the map-level menu does not open when right-clicking the home marker (RMB-drag still applies).

## Styles

`context-menu.module.css` — scoped glassmorphism, colocated with the controller (no `globals.css`).
