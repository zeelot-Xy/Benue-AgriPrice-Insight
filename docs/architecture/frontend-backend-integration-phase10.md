# Phase 10: Frontend-Backend Integration

## Purpose
This document explains how the frontend was connected to the live backend API.

## Main Integration Areas
- dashboard and report data
- market and commodity reference data
- analytics data
- admin authentication
- public upload flow
- submission moderation flow

## Key Frontend Files
- `frontend/src/lib/api-client.ts`
- `frontend/src/lib/auth-storage.ts`
- `frontend/src/services/bapi-api.ts`
- `frontend/src/hooks/use-phase9-data.ts`

## Integration Behavior
- The frontend uses live API endpoints first.
- Admin authentication controls access to protected management actions.
- Public submissions and admin review actions go through the backend instead of mutating UI state locally.
- Analytics render only approved data.

## Live Endpoint Examples
- `POST /api/auth/login`
- `GET /api/reports/overview`
- `GET /api/analytics/trends`
- `POST /api/submissions/manual`
- `POST /api/submissions/csv`
- `GET /api/submissions/pending`

## Personal Actions Required
- Keep your final screenshots aligned with the live integrated state, not fallback or mock-only states.
