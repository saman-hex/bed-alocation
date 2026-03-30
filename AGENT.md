# Agent Context — Bed Allocation

> **How to use this file:** Load this file at the start of every agent session before executing any prompt. It provides the full project context, architecture, current state, and working conventions so you never start blind.

---

## Project Overview

| Field | Value |
|---|---|
| **Name** | bed-alocation |
| **Type** | Client-side SPA (no backend) |
| **Stack** | React 18 + Vite 5 |
| **Deployment** | GitHub Pages via GitHub Actions |
| **Live URL** | https://saman-hex.github.io/bed-alocation/ |
| **Default branch** | `main` (deploy triggers on push to `main`) |

**Purpose:** Randomly assign a list of people to beds spread across configurable rooms.

---

## Repository Layout

```
bed-alocation/
├── AGENT.md               ← this file — load first
├── README.md              ← user-facing documentation
├── index.html             ← Vite entry point
├── vite.config.js         ← Vite config (base = /bed-alocation/)
├── package.json           ← scripts: dev | build | preview
├── public/                ← static assets
└── src/
    ├── main.jsx           ← React root mount
    ├── App.jsx            ← root component, owns all state
    ├── App.css            ← global + layout styles
    ├── index.css          ← CSS reset / base styles
    ├── config.js          ← default rooms & people (edit to change defaults)
    └── components/
        ├── RoomManager.jsx        ← add/remove/edit rooms and bed counts
        ├── PeopleManager.jsx      ← add/remove people, enforces capacity
        └── AllocationResults.jsx  ← renders allocation grid after shuffle
```

---

## Architecture & Data Flow

```
App (state owner)
 ├── rooms[]       { id, name, beds }   — managed by RoomManager
 ├── people[]      string[]             — managed by PeopleManager
 └── allocation[]  { ...room, assignments[] } | null — set on "Assign Randomly"

Allocation algorithm (App.jsx › allocate()):
  shuffle people → iterate rooms → fill beds sequentially → set allocation state
```

**State lives entirely in `App.jsx`.** Child components receive slices via props and call setter callbacks. There is no global store, no router, no persistence layer.

---

## Key Files & Responsibilities

| File | Responsibility |
|---|---|
| `src/config.js` | Change default rooms/people without touching components |
| `src/App.jsx` | Holds `rooms`, `people`, `allocation` state; runs `allocate()` |
| `src/components/RoomManager.jsx` | Add/remove/rename rooms, change bed counts |
| `src/components/PeopleManager.jsx` | Add/remove people, enforces `people.length <= totalBeds` |
| `src/components/AllocationResults.jsx` | Renders result cards; purely presentational |
| `vite.config.js` | Sets `base: '/bed-alocation/'` — required for GitHub Pages sub-path |
| `.github/workflows/deploy.yml` | CI/CD: build → deploy to `gh-pages` branch on push to `main` |

---

## Development Workflow

```bash
# Install dependencies (first time or after package.json changes)
npm install

# Start dev server (hot reload at http://localhost:5173/bed-alocation/)
npm run dev

# Production build (output in ./dist)
npm run build

# Preview production build locally
npm run preview
```

There are **no test scripts or linters configured** in `package.json` at this time. Before adding any, verify with `cat package.json`.

---

## Coding Conventions

- **Framework:** Functional React components only (no class components).
- **State:** Local `useState` hooks inside components; `App.jsx` owns shared state.
- **Styling:** Plain CSS in `App.css` / `index.css`. No CSS-in-JS, no Tailwind.
- **Imports:** Relative paths. No path aliases configured.
- **No TypeScript** — all files use `.jsx` / `.js`.
- **No external UI libraries** — keep the dependency footprint minimal.
- **IDs:** Rooms use integer IDs; `nextId` counter starts at 100 for new rooms.
- **Immutability:** State updates always return new arrays/objects (never mutate in place).

---

## Current State

| Area | Status |
|---|---|
| Core allocation feature | ✅ Complete |
| Room management (add/remove/rename/resize) | ✅ Complete |
| People management (add/remove, capacity guard) | ✅ Complete |
| GitHub Pages CI/CD | ✅ Working |
| Tests | ❌ None yet |
| Linting / formatting | ❌ Not configured |
| Persistence (localStorage / URL state) | ❌ Not implemented |
| Export / print allocation | ❌ Not implemented |

---

## Session Log

> Append a new entry here at the end of each agent session to track what changed.

| Date | Branch | Summary |
|---|---|---|
| 2026-03-30 | `copilot/create-agent-friendly-md-file` | Initial repo setup (React + Vite app, GitHub Pages deploy). Created this `AGENT.md`. |

---

## Agent Instructions

1. **Always read this file first** before executing any prompt in this repository.
2. **Update the Session Log** at the end of every session with a one-line summary and the branch name.
3. **Update the Current State table** whenever a feature is added, removed, or its status changes.
4. **Do not break the Vite base path** (`/bed-alocation/`) — it is required for GitHub Pages to serve assets correctly.
5. **Keep dependencies minimal.** Check `package.json` before adding any new package.
6. **No secrets or API keys** belong in this repository — it is fully public and client-side only.
7. **Run `npm run build` to validate** any non-trivial change before committing; the CI deploy will fail if the build breaks.
8. When adding components, follow the existing pattern: functional component, plain CSS class names, props for data/callbacks.
9. When the problem statement is ambiguous, prefer the minimal-change solution and note alternatives in the Session Log.
