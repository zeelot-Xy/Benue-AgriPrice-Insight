# Backend API Development

## Purpose
This document captures the practical backend implementation introduced in Phase 6 on top of the Phase 5 Prisma model.

## Implemented Resource Areas
- authentication
- markets
- commodities
- prices
- reports

## Authentication
Implemented endpoints:
- `POST /api/auth/login`
- `GET /api/auth/me`

Current behavior:
- admin login uses JWT
- protected routes require `Bearer` authentication
- write routes require the authenticated user to have the `ADMIN` role

## Markets
Implemented endpoints:
- `GET /api/markets`
- `GET /api/markets/:id`
- `POST /api/markets`
- `PATCH /api/markets/:id`

## Commodities
Implemented endpoints:
- `GET /api/commodities`
- `GET /api/commodities/:id`
- `POST /api/commodities`
- `PATCH /api/commodities/:id`

## Prices
Implemented endpoints:
- `GET /api/prices`
- `GET /api/prices/:id`
- `POST /api/prices`
- `PATCH /api/prices/:id`
- `POST /api/prices/import`

Current import behavior:
- accepts `fileName` and `csvContent`
- parses CSV text in the backend
- records import results in `ImportBatch`
- upserts price rows by market, commodity, date, and unit

## Reports
Implemented endpoints:
- `GET /api/reports/overview`
- `GET /api/reports/latest-prices`

These provide operational reporting and latest-price summaries without yet introducing the full rule-based analysis engine of Phase 7.

## Architectural Notes
- route handlers are kept thin
- services contain business logic
- Zod validates request payloads and query parameters
- Prisma remains the only data-access layer

## Current Limitations
- no refresh-token flow
- no password reset flow
- no multipart file upload yet
- no rule-based trend engine yet
- no forecasting endpoint wiring yet

## Personal Actions Required
- After you create a real `.env`, run migration and seed commands before testing login-protected endpoints.
- If your report requires an endpoint summary table, this document can be converted into one later.
