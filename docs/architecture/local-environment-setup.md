# Local Environment Setup

## Purpose
This document defines the local environment baseline introduced in Phase 4 so the project can be run consistently across the frontend, backend, database, and ML service layers.

## Services Introduced
- React frontend on port `5173`
- Express backend on port `8000`
- FastAPI ML service on port `8001`
- PostgreSQL on port `5432`

## Configuration Files
- root `.env.example`
- root `docker-compose.yml`
- app-level `package.json`, TypeScript config, and Dockerfiles for `apps/web` and `apps/api`
- Python requirements and Dockerfile for `apps/ml`

## Local Startup Modes
### Docker Compose
Use Docker Compose when a full local stack is needed with PostgreSQL included.

### Individual App Development
Use root npm scripts for frontend and backend, and the Python uvicorn command for the ML service when iterating on a single service.

## Expected Environment Variables
- `DATABASE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `SEED_ADMIN_PASSWORD`
- `VITE_API_BASE_URL`

## Current Scope of This Phase
This phase introduces only bootstrapping and health endpoints. It does not yet implement:
- authentication logic
- Prisma schema
- production-ready routing
- CSV import handling
- forecasting logic

## Personal Actions Required
- Copy `.env.example` to `.env` before running the stack locally later.
- Install Node and Python dependencies locally if you want non-Docker development in addition to Docker Compose.
- After database migration and seeding later, use the seed admin credentials from `.env` to test the auth endpoints.
- Use `npm run smoke:check` in later phases to verify the stack quickly after startup.
