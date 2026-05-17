# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

Monorepo with two independent apps that talk over HTTP + Socket.IO:

- `backend/` — Node.js / Express / MongoDB API (see `backend/CLAUDE.md`)
- `frontend/` — React 18 + Vite + Tailwind SPA (see `frontend/CLAUDE.md`)

There is **no root `package.json`** and **no workspaces**. Each app is installed and run independently. Always `cd` into the right subdir.

## Run the Full Stack Locally

```bash
# Terminal 1 — backend on :5000
cd backend && npm install && npm run dev

# Terminal 2 — frontend on :4029 (strictPort)
cd frontend && npm install && npm start
```

The frontend dev server is locked to port `4029` (`strictPort: true` in `vite.config.mjs`). The backend's CORS allowlist hardcodes `:4029`, `:3000`, `:5173` — if you change the frontend port, also update `corsOptions.origin` in `backend/server.js`.

## How Frontend and Backend Are Wired

- **REST**: Frontend hits `${API_BASE}/api/*`. The base URL is read inconsistently across files — see `frontend/CLAUDE.md` "Env var trap" before touching env config.
- **Real-time**: `backend/socket.js` exports `initializeSocket(server)`, but in `backend/server.js` the call is **commented out**. Sockets are wired on the frontend (`frontend/src/services/socket.js`, `ChatContext`, `NotificationContext`) but will not work end-to-end until that line is uncommented. Don't assume real-time features run — verify in `server.js`.
- **Auth**: JWT in `localStorage` on the frontend, sent as `Authorization: Bearer <token>`. Backend has **two** auth styles in parallel: a hand-rolled `middleware/auth.js` (used by most routes) and `passport-jwt` (used by `routes/products.js`, `routes/upload.js`). Match the style of the route you're editing.

## "Dynamic Everything" — The Admin-Driven Content Model

The homepage and catalog are not hardcoded. Public content is assembled from CMS-style collections that admin pages mutate:

| Collection | Drives | Admin page |
|---|---|---|
| `Section` | Homepage product rows (Flash Deals, Trending, etc.) | `pages/admin/SectionsManagement.jsx` |
| `Banner` | Hero / promotional banners | `BannersManagement.jsx` |
| `Category` | Nav + filters | `CategoriesManagement.jsx` |
| `Page` | Static/CMS pages | `PagesManagement.jsx` |
| `Poster` | Marketing posters (with in-app generator) | `PostersManagement.jsx`, `PosterGenerator.jsx` |
| `Setting` / `Settings` | Site-wide config | `Settings.jsx`, `SettingsPage.jsx` |

When asked to "make X dynamic" or redesign a homepage section, first check whether a backend model/route + admin page already exists for it; extend rather than hardcode.

> ⚠️ There are **two** settings models (`backend/models/Setting.js` and `Settings.js`) and **two** settings pages — likely an unfinished migration. Confirm which one is authoritative before adding fields.

## Production-Ready Implementation Notes

`PRODUCTION_READY_IMPLEMENTATION.md` at the repo root documents an enquiry/WhatsApp flow, enhanced product cards, and an admin dashboard rewrite. It references files like `EnhancedDashboard.jsx` and `EnhancedProductCard.jsx` — some exist, some are aspirational. Verify on disk before quoting it as ground truth.

## Design System

Frontend design tokens live in `frontend/src/styles/index.css` as CSS custom properties (`--color-primary`, `--shadow-soft`, `--gradient-cta`, etc.) and are consumed by `tailwind.config.js` via `var(--…)`. Don't hardcode hex colors — extend the tokens. See `frontend/DESIGN_SYSTEM.md` for the full vocabulary and `frontend/COMPONENT_GUIDE.md` for component-level conventions.

## Known Hazards

- **Hardcoded Cloudinary credentials** in `backend/routes/upload.js` — fix to read from `process.env.CLOUDINARY_*` before any deploy.
- **`helmet()` is commented out** in `backend/server.js`. Re-enable for prod.
- **`.env` files are gitignored** but `.env.example` files exist in both apps — start from those.
- Redux/Redux Toolkit are in `frontend/package.json` and marked `rocketCritical` (do not remove), but the app uses React Context for state. The deps are required by the build tooling, not actually wired into a store.
