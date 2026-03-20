# EventHub - Event Aggregator PWA

A Progressive Web App event aggregator built with Next.js 15, React 19, and TypeScript. Browse, search, and save local events with a mobile-first responsive design.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
├── app/                    Next.js App Router
│   ├── page.tsx           Home (featured events, categories)
│   ├── events/
│   │   ├── page.tsx       Search & browse events
│   │   └── [id]/page.tsx  Event detail
│   ├── favorites/page.tsx Saved events
│   └── api/events/        REST API for client-side fetching
├── components/
│   ├── ui/                shadcn/ui primitives
│   └── features/          Feature components
├── lib/
│   ├── data/              Server data access with React.cache
│   ├── stores/            Zustand stores
│   ├── types/             TypeScript types
│   ├── validations/       Zod schemas
│   └── utils/             Helpers, constants, date formatting
├── hooks/                 Custom React hooks
├── data/                  Static JSON event data
└── public/                PWA manifest, service worker, icons
```

## Key Features

- **Event browsing** with search and category filters
- **Event detail pages** with related events
- **Favorites** stored in browser localStorage via Zustand
- **Dark mode** toggle with persistent preference
- **PWA** installable with offline support
- **Mobile-first** responsive design
- **Streaming** via Suspense boundaries

## State Architecture (URL + Zustand Hub)

The app uses two coordinated state paths:

### 1) URL search params (single source of truth for filter/navigation state)

- URL owns shareable state: `q`, `category`, `dateFrom`, `dateTo`, `datePreset`, `event`
- Server components read `searchParams` and fetch data from it
- This keeps deep links, back/forward navigation, and refresh behavior deterministic

### 2) Zustand app store (client interaction hub)

- Client components read/write through `useAppStore` actions/selectors
- A single sync hook (`useUrlStoreSync`) mirrors URL <-> store
- Components do not call `router.push()`/`useSearchParams()` directly for filter/selection updates

### Producer -> Store -> URL contract (client path)

1. Producer emits intent by calling an action (`setQuery`, `setCategory`, `setDateFilter`, `setSelectedEventId`)
2. Store is the client write boundary
3. Sync layer flushes store state to URL and hydrates store from URL changes
4. Subscribers re-render from slice selectors

### Store design conventions

- Keep state serializable and minimal
- Expose semantic actions (`setSelectedEventId`, `toggleFavorite`, `setTheme`) instead of raw setters
- Add `source` metadata for debug-sensitive actions when tracing is needed
- Use per-slice selectors: `useAppStore((s) => s.someField)`
- Avoid selecting large objects when only one primitive is needed

### Persistence policy

- Persist only stable user preferences / durable state (`theme`, `favorites`, etc.)
- Do **not** persist transient UI flow state (`selectedEventId`, filters, open popover id, hover state, in-flight flags)
- Use `persist.partialize` to control exactly what is stored

### External system sync policy (URL, storage, server, router)

When state is mirrored to another system:

- Choose one source of truth per flow (URL for filter/navigation flows)
- Keep one directional sync as primary (`store -> URL`) with guarded reverse hydration (`URL -> store`)
- Guard reverse sync to avoid feedback loops/races
- Treat external changes as explicit hydrate events (back/forward, deep links, restored session)

### Debug/observability pattern

For hard-to-track races, instrument actions at the store boundary:

- Log action name
- Log `source` (component/effect initiating the action)
- Log payload + previous value

This gives deterministic traces without scattering `console.log` across UI components.

## Adding Events

Edit `data/events.json`. Each event must match the schema defined in `lib/validations/event.ts`. Fields:

- `id` - Unique identifier
- `title` - Event name
- `description` - Full description
- `date` - ISO 8601 datetime
- `endDate` - Optional end datetime
- `location` - Venue name
- `address` - Optional full address
- `category` - One of: music, sports, arts, food, tech, business, community, outdoor
- `price` - Price as display string
- `organizer` - Organizer name
- `tags` - Array of tag strings

## Documentation

- [Folder Structure](docs/FOLDER_STRUCTURE.md) — project layout and conventions
- [Data Flow](docs/DATA_FLOW.md) — how data moves through the app
