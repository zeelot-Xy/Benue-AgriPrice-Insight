# Local Environment Setup

## Purpose
This document defines the local environment baseline so the project can be run consistently across the frontend, backend, and database layers.

## Services
- React frontend on port `5173`
- Express backend on port `8000`
- PostgreSQL on port `5432` or the mapped host port you configure locally

## Configuration Files
- root `.env.example`
- root `docker-compose.yml`
- root `package.json`
- app-level files under `frontend` and `backend`

## Local Startup Modes
### Docker Compose
Use Docker Compose when a full local stack is needed with PostgreSQL included.

### Individual App Development
Use root npm scripts for frontend and backend when iterating on a single service.

## Expected Environment Variables
- `DATABASE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `SEED_ADMIN_PASSWORD`
- `VITE_API_BASE_URL`

## Current Scope of This Setup
This setup supports:
- authentication
- Prisma-backed persistence
- CSV import handling
- public submission and moderation
- rule-based analytics

## Personal Actions Required
- Copy `.env.example` to `.env` before running the stack locally.
- Install Node dependencies locally if you want non-Docker development in addition to Docker Compose.
- After database migration and seeding, use the seed admin credentials from `.env` to test the auth endpoints.
- Use `npm run smoke:check` to verify the stack quickly after startup.
