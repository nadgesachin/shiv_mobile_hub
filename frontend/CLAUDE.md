# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm start        # vite dev server on http://localhost:4029 (strictPort)
npm run dev      # alias for start
npm run build    # vite build --sourcemap → outputs to ./build (not ./dist)
npm run serve    # vite preview of the build
```

No test script and no linter are wired despite `@testing-library/*` being in deps. There is no `eslint` binary — `eslintConfig` in `package.json` is unused.

## Critical: Do NOT Remove `rocketCritical` Dependencies

`package.json` has a `rocketCritical` block listing deps + scripts that the Rocket.new build tooling assumes exist:
`@dhiwise/component-tagger`, `react`, `react-dom`, `@reduxjs/toolkit`, `redux`, `react-router-dom`, plus `vite`, `vite-tsconfig-paths`, `tailwindcss`, etc.

`@reduxjs/toolkit` and `redux` are listed but the app uses **React Context** for state (`contexts/AuthContext`, `ChatContext`, `NotificationContext`). The Redux packages are not wired into a store — leave them anyway.

`@dhiwise/component-tagger` is loaded as a Vite plugin in `vite.config.mjs` and must remain.

## Env var trap — fix before touching API config

The frontend reads its API base URL **inconsistently**:

- `src/services/api.js` reads `import.meta.env.VITE_ADSENSE_ID` (misnamed — this is the API base URL, not an AdSense ID).
- `src/pages/auth/LoginPage.jsx` and `src/components/auth/RegisterForm.jsx` read `import.meta.env.VITE_API_URL`.
- `.env` defines `BACKEND_BASE_API` (without the `VITE_` prefix — **Vite will not expose this to the client**).

So today the app falls back to the hardcoded `http://localhost:5000` / `http://localhost:5000/api` defaults in each file. When wiring a real deployment, pick one var name (`VITE_API_URL`), set it in `.env`, and update both call sites. The socket URL is also hardcoded in `src/services/socket.js` (`http://localhost:5000`).

## Routing

`src/App.jsx` → `Routes.jsx`. All routes are declared in one `Routes.jsx` (no per-feature route splitting). Three route classes:

- **Public**: `/`, `/contact`, `/csc-portal`, `/services-hub`, `/products-catalog`, `/premium`, …
- **Protected** (wrapped in `<ProtectedRoute>`): `/profile`, `/chat`, `/notifications`
- **Admin** (wrapped in `<AdminGuard><AdminLayout/>`): everything under `/admin/*`

Provider stack (outermost first): `HelmetProvider` → `GoogleOAuthProvider` → `AuthProvider` → `BrowserRouter` → `ErrorBoundary` → `ChatProvider` → `NotificationProvider` → routes.

Path imports use `baseUrl: "./src"` from `jsconfig.json`, e.g. `import Foo from "components/Foo"`. Both `pages/products-catalog/:id` and `pages/products/:id` route to the same detail page — duplicate aliases are intentional.

## Styling: Tailwind + CSS-variable design system

Tailwind colors, radii, shadows, and gradients map to CSS custom properties defined in `src/styles/index.css` and friends. Example: `bg-primary` resolves to `var(--color-primary)`. **Never hardcode hex** — extend the variables.

Five stylesheets are loaded in `src/index.jsx` in this order, each layering on top: `tailwind.css`, `index.css`, `mobile.css`, `premium.css`, `modern-effects.css`. When introducing a new effect, decide which layer it belongs to.

Fonts: `Plus Jakarta Sans` (headlines), `Inter` (body), `JetBrains Mono` (accent). Tailwind exposes these as `font-headline`, `font-body`, `font-accent`.

Detailed token reference and component conventions: `DESIGN_SYSTEM.md` and `COMPONENT_GUIDE.md` at the repo's frontend root. `REDESIGN_SUMMARY.md` documents the last visual overhaul.

## State / data fetching

- **`services/api.js`** — hand-rolled `fetch` wrapper with a built-in cache layer (`services/cacheService.js`). Cache is invalidated automatically by URL prefix on any non-GET request, so a `POST /products` clears the `products` cache. Use it as `apiService.get('/products', { useCache: true, cacheTime: 30 })`.
- **`services/socket.js`** — singleton wrapping `socket.io-client` with named callback arrays. Authenticate after connect by emitting `authenticate` with `{ userId, role }`.
- **Contexts** (`src/contexts/`) — Auth, Chat, Notification. Each uses `useReducer` over a typed action map. There is no Redux store despite the deps.

## "Dynamic everything" — homepage is admin-driven

The homepage renders backend-controlled collections, not hardcoded data. To add a new homepage row, do **not** edit `pages/homepage/index.jsx` to add a static section — instead:

1. Pick (or add) a `Section.style` enum value on the backend
2. Create a matching React renderer component (see existing `MobileShowcase`, `ServiceCategories`, `TrustIndicators`, etc. in `pages/homepage/components/`)
3. Map `style → component` where sections are rendered
4. Configure the row from the admin UI (`/admin/sections`)

Same pattern applies for banners, posters, categories, and CMS pages — each has an admin page under `pages/admin/` and a public surface.

## When adding/editing UI

- Prefer extending tokens in `tailwind.config.js` + `styles/index.css` over inline styles.
- Use `framer-motion` for animations — it's already imported throughout (`MobileShowcase`, `CTASection`, …).
- Icons: `lucide-react` is the primary set; `react-icons` is also installed.
- Forms: `react-hook-form`. Toasts: `react-toastify`. Charts: `recharts` (+ `d3` for custom viz).
- `class-variance-authority` + `clsx` + `tailwind-merge` are wired via `utils/cn.js` — use `cn(...)` for conditional class composition.

## Known UI hazards / cleanup candidates

- `pages/admin/PosterGenerator.backup.jsx` and `PosterGenerator.old.jsx` are stale copies — don't edit them.
- `pages/admin/Settings.jsx` and `SettingsPage.jsx` both exist; mirrors the backend `Setting`/`Settings` model duplication. Resolve before adding settings fields.
- `<ChatWidget />` mount in `Routes.jsx` is commented out — chat UI only appears on the dedicated `/chat` page today.
- The Vite plugin `@dhiwise/component-tagger` instruments JSX; if you see unexpected `data-*` attributes in DOM, that's the source.
