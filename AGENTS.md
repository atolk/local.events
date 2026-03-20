# Project Overview

Web Application that allows users to find events around them.

# Technology Stack

- Next.js 15
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- Zustand 5 for state management
- SWR 2 for client-side data fetching and caching

# Folder Structure

- `src` - main folder for sources
- you can find more details about folder structure here `docs/FOLDER_STRUCTURE.md`

# Common Rules

- Use comments to briefly explain functions and code blocks where appropriate.
- Use `useEffect` only for external sync (DOM, browser APIs, network, 3rd-party libs, subscriptions); if a value is derivable from props/state, compute it in render (`useMemo` if expensive), not via effect-synced state.