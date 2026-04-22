# Repository Structure Guide

## Purpose
This repository uses a single project structure so that the frontend, backend, documentation, and data assets evolve together under one version-controlled project while still remaining easy to reason about as separate application layers.

## Top-Level Directories

### `frontend/`
Contains the React frontend, route-level pages, reusable UI components, chart views, and themed layout primitives.

### `backend/`
Contains the Express backend, request validation, controllers, services, authentication logic, analytics logic, and submission moderation workflows.

### `data/`
Stores non-secret project datasets and curated input files.

### `docs/`
Contains academic and technical project artifacts.

### `prisma/`
Contains the Prisma schema and migration history for the PostgreSQL database.

### `scripts/`
Contains helper scripts such as smoke checks and development utilities.

### `tests/`
Reserved for integration tests, API tests, and system-level verification.

## Structure Governance Rules
- Frontend code belongs under `frontend/`.
- Backend code belongs under `backend/`.
- Documentation should stay in `docs/`, not mixed into app folders.
- Generated build artifacts should not be committed.

## Personal Actions Required
- None immediately, unless your supervisor asks for a different presentation of the repository layout in the final report.
