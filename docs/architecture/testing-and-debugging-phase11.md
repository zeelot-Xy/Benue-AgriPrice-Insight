# Phase 11: Testing and Debugging

## Purpose
Phase 11 focuses on practical verification, debugging readiness, and edge-case awareness. At this stage, the goal is not only to have code that builds, but to have a repeatable method for checking whether the system is actually healthy for demo and defense.

## What This Phase Adds
- a repeatable smoke-check script for local verification
- a clearer runtime checklist for the full stack
- explicit identification of the current local blockers that can prevent end-to-end success

## Smoke Check Script
Command:

```bash
npm run smoke:check
```

The script checks:
- API health
- API overview
- reports overview
- markets endpoint
- analytics alerts endpoint
- ML health
- admin login
- authenticated user lookup
- forecast history endpoint
- frontend HTTP response

Optional flags:
- `--skip-web`
- `--skip-ml`
- `--skip-auth`

Examples:

```bash
npm run smoke:check -- --skip-web
npm run smoke:check -- --skip-ml
```

## Current Runtime Risks Observed
During Phase 11 preparation, the following practical issues were observed:

### 1. Python ML dependencies are not yet installed locally
Observed issue:
- `No module named 'fastapi'`

Impact:
- the ML service cannot run locally outside Docker yet
- forecast endpoints may remain in fallback mode on the frontend

Required action:

```bash
python -m pip install -r apps/ml/requirements.txt
```

### 2. Docker was not reachable from the current session
Observed issue:
- permission denied while trying to connect to the Docker API

Impact:
- the full Compose stack could not be verified from this session
- live end-to-end checks depend on Docker Desktop being available and accessible

Required action:
- ensure Docker Desktop is running
- ensure the current terminal session has permission to access Docker

### 3. `.env` file may still be missing locally
Observed symptom:
- Compose warned that variables such as `POSTGRES_USER`, `POSTGRES_DB`, and `JWT_SECRET` were not set

Impact:
- Compose startup will be incomplete or invalid without a real `.env`

Required action:
- copy `.env.example` to `.env`

## Recommended Full Verification Order
1. Copy `.env.example` to `.env`
2. Start Docker Desktop
3. Install Python ML dependencies if you want local non-Docker ML verification
4. Run:

```bash
docker compose up -d
```

5. Run Prisma migration and seed if needed
6. Run:

```bash
npm run smoke:check
```

7. Open the frontend and test:
- login
- dashboard live mode
- admin authenticated state
- market and analytics data
- forecast live mode or fallback behavior

## Edge Cases Worth Testing Manually
- API offline but frontend running
- API online but ML service offline
- login with wrong credentials
- forecast request when insufficient history exists
- admin view with no token
- forecast page fallback messaging
- dashboard fallback messaging
- CSV import later with invalid rows

## Academic Notes
- This phase strengthens the project defense because it demonstrates operational verification discipline, not just feature implementation.
- A smoke-check script is especially useful during demo day because it gives a quick confidence check before presentation.
- Explicit documentation of current blockers is not a weakness; it is evidence of structured debugging and honest system evaluation.

## Personal Actions Required
- Create a real `.env` from `.env.example`
- Ensure Docker Desktop is available
- Install local Python dependencies if you want the ML service outside Docker
- Run the smoke check before final demo sessions
