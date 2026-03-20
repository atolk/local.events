# Folder Structure

`src/`
- `app/` Next.js routes, layouts, route-only code (UI orchestration)
- `components/` shared components
  - `ui/` pure components, no business logic
    - `primitives/` atomic UI only
    - `composites/` generic composed UI
  - `features/` components with business logic (can subscribe to store and emit events)
- `data/` static/mock data
- `hooks/` reusable hooks
- `lib/` domain logic, types, utils
  - `dal/` server-side data access layer (single entry point for data sources)
- `public/` source-owned static assets
- `stores/` global app state

## Placement

- Route-only component -> `src/app/{route}/components`
- Shared generic UI -> `src/components/ui/*`
- Business component -> `src/components/features/*`
- Store -> `src/stores/*`
- Domain/types/utils -> `src/lib/*`

## Dependency Rules (strict)

- `ui/primitives` -> can import: `ui/primitives` only
- `ui/composites` -> can import: `ui/primitives`, `ui/composites`
- `features` -> can import: `components/ui/*`, `hooks`, `stores`, `lib`, `data`
- `app` -> can import: everything in `src/*`
- `hooks` -> can import: `lib`, `stores` (no `app`, no `features`)
- `stores` -> can import: `lib` only
- `lib` -> can import: `lib` only
- `data` -> no imports from app/component layers

## Forbidden

- No business logic/stores in `components/ui/*`
- No imports from `app/*` outside `app/*`
- No cross-route imports between `src/app/{routeA}` and `src/app/{routeB}`