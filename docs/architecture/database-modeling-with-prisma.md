# Database Modeling with Prisma

## Purpose
This document records the practical database-modeling decisions implemented in Phase 5 and explains how the Prisma schema maps the earlier ERD into an actual application-ready data model.

## Modeling Goals
- preserve the approved project scope
- support clean reference-data seeding
- enforce uniqueness where duplicate price records would create analytical errors
- keep analytical and forecasting outputs separate from raw historical observations

## Main Design Decisions
### Roles as an Enum-Backed Table
Roles are stored in a `Role` table and constrained by the `RoleName` enum. This keeps the data model explicit while still allowing relational access from `User`.

### Users Prepared for Auth Later
The `User` model is included now so Phase 6 can build on a stable auth-oriented table instead of changing the schema later.

### Price Uniqueness
`PriceRecord` is unique on:
- `marketId`
- `commodityId`
- `priceDate`
- `unit`

This prevents duplicate records for the same market, commodity, date, and unit combination.

### Analytical Separation
`AnalysisSnapshot`, `Alert`, and `ForecastRun` are modeled separately from `PriceRecord`. This keeps the historical observation layer clean and makes later analytics easier to reason about.

### Import Traceability
`ImportBatch` preserves source-file level tracking and supports later reporting of success and failure counts for CSV uploads.

## Seed Strategy
The Prisma seed script loads:
- roles
- one placeholder admin user
- market reference data
- commodity reference data
- starter price records from the Phase 2 CSV dataset

## Important Constraint Reminder
The schema intentionally models only:
- the four approved Benue markets
- the eight approved commodities
- admin and viewer roles

It does not introduce broader geographic or commodity scope.

## Personal Actions Required
- Before production-like use later, replace the seeded placeholder admin password strategy with a real hashed credential flow.
- If your supervisor requires a printed schema table in the final report, you may derive it from `prisma/schema.prisma` and this document.
