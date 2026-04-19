# Repository Structure Guide

## Purpose
This repository uses a monorepo structure so that the frontend, backend, ML service, documentation, and shared utilities evolve together under one version-controlled project.

## Design Rationale
- One repository simplifies academic review and supervision.
- Shared documentation stays close to implementation.
- Future configuration and shared UI tokens can be centralized.
- The structure supports phased growth without early over-engineering.

## Top-Level Directories

### `apps/`
Contains deployable applications.

#### `apps/web`
Will contain the React frontend, route-level pages, reusable UI components, chart views, and themed layout primitives.

#### `apps/api`
Will contain the Express backend, request validation, controllers, services, repositories, and authentication logic.

#### `apps/ml`
Will contain the FastAPI forecasting microservice used only for optional predictive analysis.

### `packages/`
Contains shared packages when reuse becomes real.

#### `packages/config`
Reserved for shared configuration such as linting, TypeScript presets, or reusable environment helpers in later phases.

#### `packages/ui`
Reserved for shared UI tokens or utilities if frontend reuse across modules becomes substantial.

### `data/`
Stores non-secret project datasets and curated input files.

#### `data/raw`
Will contain source CSV files, manually curated imports, and raw sample datasets.

#### `data/processed`
Will contain cleaned or transformed datasets generated for analysis or seed preparation.

### `docs/`
Contains academic and technical project artifacts.

#### `docs/academic`
Academic framing, requirements, report prelim pages, and project-defense materials.

#### `docs/architecture`
System design, ERD, API boundaries, data flow, and decision records.

#### `docs/branding`
Logo and visual identity guidance.

#### `docs/meetings`
Supervisor meeting notes and decision tracking.

#### `docs/references`
Manual follow-up instructions for diagrams, screenshots, logos, and institution-specific pages that cannot be finalized directly in Markdown.

### `prisma/`
Will contain the Prisma schema and migration history for the PostgreSQL database.

### `scripts/`
Will contain helper scripts such as seed preparation, import helpers, and development utilities.

### `tests/`
Reserved for integration tests, API tests, and system-level verification in later phases.

## Structure Governance Rules
- Application-specific code belongs under `apps/*`.
- Shared code should move into `packages/*` only when there is actual reuse.
- Documentation should stay in `docs/*`, not mixed into app folders.
- Generated build artifacts should not be committed.

## Personal Actions Required
- None immediately, unless you later choose to reorganize folders after supervisor review. Any structural change should preserve this monorepo intent.
