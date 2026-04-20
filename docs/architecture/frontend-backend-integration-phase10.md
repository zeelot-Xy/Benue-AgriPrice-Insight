# Phase 10: Frontend-Backend Integration

## Purpose
Phase 10 replaces the Phase 9 mock-query layer with live backend integration while preserving graceful behavior when local services are unavailable. The main goal is to make the BAPI interface read real data from the Node API and use the authentication endpoints where appropriate.

## Integration Scope Completed
- dashboard reads live report and analytics summaries
- market page reads live market records and seasonality results
- analytics page reads live alerts and selected commodity history
- forecast page calls the live forecast endpoint and also reads forecast history
- login page is connected to the backend authentication endpoint
- admin page reads live scope counts and shows authenticated-user context when available

## Key Frontend Changes

### Shared API Layer
New files:
- `apps/web/src/lib/api-client.ts`
- `apps/web/src/lib/auth-storage.ts`
- `apps/web/src/services/bapi-api.ts`

Responsibilities:
- centralize fetch behavior
- read the configured API base URL from `VITE_API_BASE_URL`
- attach bearer tokens when required
- raise consistent API errors
- provide live-data functions with controlled fallback behavior

### Query Hook Layer
Updated file:
- `apps/web/src/hooks/use-phase9-data.ts`

Responsibilities:
- expose TanStack Query hooks for dashboard, markets, analytics, forecasts, admin, and current user
- expose login mutation and logout handling
- invalidate queries after successful authentication

### Page-Level Integration Behavior
- Each main page now distinguishes between:
  - live backend data
  - fallback demo data
- The interface surfaces this state clearly using badges and explanatory notes.
- This keeps the app usable during local setup while still moving the architecture to a real integration model.

## Authentication Integration
- `POST /api/auth/login` is used by the login screen
- `GET /api/auth/me` is used to recover the authenticated user when a token is present
- the auth token is stored in browser local storage for the current demo environment
- the app shell can now show the authenticated role and user name

## Pages Connected to Real Endpoints

### Dashboard
Endpoints used:
- `GET /api/reports/overview`
- `GET /api/reports/latest-prices`
- `GET /api/analytics/alerts`
- `GET /api/commodities`
- `GET /api/prices`

### Markets
Endpoints used:
- `GET /api/markets`
- `GET /api/reports/latest-prices`
- `GET /api/analytics/seasonality`

### Analytics
Endpoints used:
- `GET /api/analytics/alerts`
- `GET /api/analytics/seasonality`
- `GET /api/commodities`
- `GET /api/prices`

### Forecasts
Endpoints used:
- `GET /api/markets`
- `GET /api/commodities`
- `GET /api/analytics/alerts`
- `GET /api/reports/overview`
- `GET /api/forecasts/history`
- `GET /api/forecasts`

### Admin
Endpoints used:
- `GET /api/reports/overview`
- `GET /api/markets`
- `GET /api/commodities`
- `GET /api/auth/me` when authenticated

## Fallback Strategy
The frontend now uses live endpoints first. If the API or forecast service is unavailable:
- the UI falls back to locally prepared Phase 9 demo data
- the page labels this clearly
- the app remains reviewable for presentation and design feedback

This is a practical final-year project compromise because the interface remains useful during incomplete local environment startup.

## Verification
- frontend TypeScript typecheck should pass
- frontend production build should pass
- runtime verification depends on the local API, database, and optional ML service being started

## Personal Review Checkpoint
At this phase, you should run the full stack locally and verify:
- login works with the seeded admin account
- dashboard changes from fallback mode to live mode when the API is available
- forecast page changes from fallback mode to live mode when both API and ML service are available
- admin page reflects authenticated state

## Personal Actions Required
- Start the local services before end-to-end review.
- If the forecast page stays in fallback mode, install Python ML dependencies and start the ML service before judging forecast integration quality.
