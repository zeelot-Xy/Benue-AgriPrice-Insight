# API Boundaries

## Purpose
This document defines the main backend resource groups and responsibility boundaries. It is intentionally stable at the resource level without prematurely fixing every request or response shape.

## Boundary Principles
- Authentication protects administrative write operations.
- Validation belongs in the backend, not the frontend alone.
- Analytical endpoints return both numbers and explanations.
- Forecasting remains an optional integration boundary.

## Resource Groups

### Auth
Purpose:
- authenticate admin users
- expose current-session identity where needed

Expected endpoints:
- `POST /auth/login`
- `GET /auth/me`

### Markets
Purpose:
- expose and manage market reference data within scope

Expected endpoints:
- `GET /markets`
- `GET /markets/:id`
- `POST /markets`
- `PATCH /markets/:id`

### Commodities
Purpose:
- expose and manage commodity reference data

Expected endpoints:
- `GET /commodities`
- `GET /commodities/:id`
- `POST /commodities`
- `PATCH /commodities/:id`

### Prices
Purpose:
- manage historical and weekly price records
- support filtering and import

Expected endpoints:
- `GET /prices`
- `GET /prices/:id`
- `POST /prices`
- `PATCH /prices/:id`
- `POST /prices/import`

### Analytics
Purpose:
- deliver rule-based summaries and explainable insights

Expected endpoints:
- `GET /analytics/trends`
- `GET /analytics/alerts`
- `GET /analytics/comparisons`
- `GET /analytics/seasonality`
- `GET /analytics/state-average`

### Forecasts
Purpose:
- expose forecast request and retrieval functionality

Expected endpoints:
- `GET /forecasts`
- `POST /forecasts/run`

## Validation Expectations
- All write endpoints must validate payloads with Zod.
- Filtered read endpoints should validate query parameters.
- CSV import endpoints must validate both file structure and row data.

## Authorization Expectations
- Admin-only:
  - market writes
  - commodity writes
  - price writes
  - import
- Viewer/Farmer:
  - dashboard and analytical reads

## Response Expectations
- Analytical responses must include:
  - numerical values
  - time or date context
  - explanatory text
- Forecast responses must clearly label predictions as estimates.

## Sequencing Guidance for Later Phases
Recommended build order:
1. auth
2. markets
3. commodities
4. prices
5. analytics
6. forecasts

## Personal Actions Required
- If your final report requires endpoint tables in a different tabular format, you can reformat this document without changing the resource boundaries.
