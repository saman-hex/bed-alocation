# Bed Allocation 🛏️

A client-side React + Vite app that randomly assigns people to beds across configurable rooms.  
Live demo is deployed to **GitHub Pages** via the included GitHub Actions workflow.

## Features

- Configure rooms with custom names and bed counts
- Add / remove people from the list
- Counter showing people vs. total beds
- One-click random allocation
- Fully responsive layout

## Quick Start

```bash
npm install
npm run dev        # development server at http://localhost:5173/bed-alocation/
npm run build      # production build in ./dist
npm run preview    # preview the production build locally
```

## Configuration

Edit **`src/config.js`** to change the default rooms and people list.

```js
export const defaultRooms = [
  { id: 1, name: 'Room 1', beds: 2 },
  // …
]

export const defaultPeople = ['Alice', 'Bob', /* … */]
```

## Deployment (GitHub Pages)

The `.github/workflows/deploy.yml` workflow automatically builds and deploys the app to GitHub Pages on every push to the `master` branch.

To enable it in your fork:
1. Go to **Settings → Pages** in your repository.
2. Set **Source** to **GitHub Actions**.
3. Push to `master` — the workflow will do the rest.

The live site will be available at `https://<your-username>.github.io/bed-alocation/`.

