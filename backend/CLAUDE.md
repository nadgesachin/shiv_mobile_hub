# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps
npm run dev          # nodemon server.js (port 5000)
npm start            # node server.js (production)
npm run seed         # scripts/seed.js — seeds admin user, sample sections, services, etc.
```

There is no test runner, no linter, and no build step. Restart `nodemon` if you add a new `routes/*.js` file — it won't be auto-mounted unless `server.js` requires it.

A second seed script exists for services only: `node scripts/seedServices.js`. A Cloudinary image-cache utility lives at `scripts/cacheProductImages.js`.

## Architecture

Express monolith with MongoDB via Mongoose. Single entry point: `server.js`.

### Request pipeline (in order, from `server.js`)
1. `compression()`
2. Static `/uploads` served from `backend/uploads/` (legacy — most uploads now go to Cloudinary)
3. `express-rate-limit` (100 req / 15 min / IP) applied to `/api/`
4. CORS — **hardcoded** allowlist: `localhost:4029`, `:3000`, `:5173`
5. JSON body parser (10mb limit)
6. `morgan('dev')` logging
7. Route mounts (see below)
8. Generic error handler + 404 handler

> `helmet()` is imported but **commented out**. Re-enable before deploying.

### Route mounting pattern

```js
app.use('/api/admin',  auth, adminOnly, require('./routes/admin'));  // admin gate at mount
app.use('/api/upload', auth,            require('./routes/upload'));
app.use('/api/notifications', auth,     require('./routes/notifications'));
// most other routes apply auth/adminOnly per-handler inside the router file
```

When adding admin-only behavior, prefer the per-handler pattern (`router.post('/', auth, adminOnly, …)`) unless every endpoint in the file is admin-only.

### Two auth styles coexist — match the file you're editing
- **`middleware/auth.js`** — plain `jsonwebtoken` verify, exports `{ auth, adminOnly }`. Used by most routes.
- **`config/passport.js` + `passport-jwt`** — used inside `routes/products.js` and `routes/upload.js` as `passport.authenticate('jwt', { session: false })`.

Both read the same JWT, so they're interoperable on the wire — but don't mix them inside one router.

### Models (`models/`)

`User`, `Product`, `Category` (hierarchical with `categoryPath`), `Section`, `Service`, `Banner`, `Page`, `Poster`, `Review`, `Enquiry`, `Message`, `Notification`, `Setting`, `Settings`.

> **`Setting.js` and `Settings.js` both exist.** Likely an unfinished migration. Check which one your route imports before adding fields — and consider consolidating.

`User` hashes passwords with bcrypt in a `pre('save')` hook and supports Google OAuth via `googleId` (sparse unique). `Section` defines a `style` enum (`DailyDeals`, `TrendingProducts`, `BestsellingProducts`, …) that maps 1:1 to a frontend component — adding a new style requires changes on both sides.

### Socket.IO

`socket.js` implements a chat + notification gateway: tracks `connectedUsers` (userId → socketId) and `adminSockets`, emits `new_message` / `notification` / `user_typing` / `user_connected` / `user_disconnected`.

> **`initializeSocket(server)` is commented out in `server.js`.** Real-time chat and notifications will not work end-to-end until that line is uncommented. CORS inside `socket.js` is `origin: '*'` — tighten before prod.

### File uploads

`routes/upload.js` uses `multer-storage-cloudinary` to push directly to Cloudinary. Detects image vs video by MIME and routes to the appropriate `resource_type`. Files are stored under the `shiv-mobile-hub` folder with `${originalName}_${timestamp}` as public_id.

> **Cloudinary credentials are hardcoded** in `routes/upload.js`. Move them to `process.env.CLOUDINARY_*` (already documented in `.env.example`) before any deploy or public push.

## Environment

Copy `.env.example` → `.env`. Required:

- `MONGODB_URI` — connection refusal exits the process (see `server.js` line 74)
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `FRONTEND_URL` (informational; CORS is hardcoded in `server.js`)
- `PORT` (default 5000), `NODE_ENV`

## Seed Credentials

After `npm run seed`: `admin@shivmobilehub.com` / `admin123456`. Rotate immediately on any non-local environment.

## When adding a new resource

1. Define schema in `models/<Name>.js`
2. Add `routes/<name>.js` (mirror an existing router for auth pattern + response shape)
3. Mount in `server.js` (manual — there is no auto-discovery)
4. If admin-managed, add a `pages/admin/<Name>Management.jsx` on the frontend
5. If it appears on the homepage, add a `Section.style` enum value and a corresponding renderer component on the frontend
