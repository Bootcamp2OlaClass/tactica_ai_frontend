# Tactica AI Frontend

Next.js (App Router) frontend for **Tactica AI**, an AI-powered academic planning platform. See the [backend repo](https://github.com/Bootcamp2OlaClass/tactica_ai_backend) for the API this app talks to, and its `docs/ARCHITECTURE.md` for the full system design.

## Getting Started

Requires the backend API running separately (see the backend repo's own README) — this app has no functionality without it.

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL of the backend API. Inlined into the JS bundle at build time (Next.js only exposes `NEXT_PUBLIC_*` vars to the browser, and does so at build, not at runtime) — set correctly *before* `npm run build`, not just at container start. |
| `E2E_BASE_URL` | No | Only used by Playwright (`npm run test:e2e`) to point at a frontend server other than `http://localhost:3000`. |

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server. |
| `npm run build` | Production build. |
| `npm run start` | Serve a production build. |
| `npm run lint` | ESLint. |
| `npm run test` | Vitest (unit/component tests). |
| `npm run test:e2e` | Playwright — requires a live backend + frontend running (see `e2e/critical-path.spec.ts`'s header comment for exactly what's covered). |

## Auth model

In-memory access token + httpOnly refresh cookie (never `localStorage`), silent refresh on load via `AuthGuard`. See `lib/api/client.ts`.

## Testing

Vitest + React Testing Library for units/components. Playwright for E2E — currently covers the deterministic core of the critical path (register → create semester → sign out → log back in → sign out); document upload/processing and the AI features are out of scope for the current E2E pass (see the backend's `docs/DEPLOYMENT.md` for why).

## CI

`.github/workflows/frontend-ci.yml` — `npm ci`, lint, typecheck, test, build. Runs on PRs/pushes to `main`/`develop`.
