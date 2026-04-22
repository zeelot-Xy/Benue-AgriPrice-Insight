# Repository Governance

## Purpose
This document explains how responsibility is divided across the active project layers so the codebase remains understandable and maintainable.

## Ownership Boundaries

### `frontend`
Owns:
- route rendering
- visual components
- TanStack Query hooks
- API client consumption
- public upload experience
- admin-facing UI behavior

### `backend`
Owns:
- authentication and authorization
- validation schemas
- business logic
- analytics rules
- submission moderation logic
- persistence orchestration through Prisma

### `prisma`
Owns:
- database schema
- migrations
- seed logic

### `docs`
Owns:
- academic framing
- architectural explanation
- defense support materials

## Governance Rules
- Keep business rules in the backend, not the frontend.
- Keep UI presentation concerns in the frontend, not the backend.
- Update docs when structural decisions change.
- Do not reintroduce dropped architecture layers without a clear documented reason.

## Personal Actions Required
- If you later extend the project, update this document before expanding the code structure.
