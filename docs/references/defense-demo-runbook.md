# Defense Demo Runbook

## Purpose
This runbook provides a simple and reliable flow for presenting the BAPI system live during supervision, internal review, or final defense.

## Demo Goal
Demonstrate that the system:
- records and organizes agricultural market data
- provides explainable analysis
- supports forecasting as an enhancement
- remains stable even when some services are unavailable

## Pre-Demo Preparation
Before the demo:
1. Ensure `.env` exists and is correct.
2. Start Docker Desktop if using Docker.
3. Start the application stack.
4. Run `npm run smoke:check`.
5. Keep backup screenshots ready in case of environment failure.

## Recommended Live Setup
Suggested startup sequence:

```bash
docker compose up -d
npm run smoke:check
npm run dev:web
```

If ML is not ready:
- keep the frontend in fallback-capable mode
- explain that forecasting degrades gracefully rather than breaking the application

## Recommended Demo Flow

### Step 1: Show the Login Screen
Say:
- the system supports Admin and Viewer/Farmer roles
- the login screen is part of the controlled access design

### Step 2: Show the Dashboard
Highlight:
- total markets
- total commodities
- active alerts
- latest week ending
- weekly trend chart

Say:
- this is the main monitoring view for understanding current movement at a glance

### Step 3: Show Market Comparison
Highlight:
- four approved markets only
- cross-market comparison chart
- state-level interpretation

Say:
- the project is intentionally scoped to selected representative markets for defendable analysis

### Step 4: Show Analytics Page
Highlight:
- alert cards
- trend chart
- seasonality explanation cards

Say:
- explainability is central, so the system shows both numbers and text explanations

### Step 5: Show Forecast Page
Highlight:
- actual versus projected values
- confidence and warning messages
- fallback behavior if ML is unavailable

Say:
- forecasting is an enhancement layered on top of the core monitoring system

### Step 6: Show Admin Page
Highlight:
- controlled CSV import area
- admin checklist
- authenticated state if login is active

Say:
- the data collection model is manual and CSV-driven for realism and feasibility

## If Something Fails During the Demo

### If the frontend loads but API is down
Say:
- the frontend is designed to fall back safely for presentation review
- live backend mode is normally verified using the smoke-check workflow

### If the ML service is down
Say:
- the system still functions because forecasting is isolated and optional
- this design improves maintainability and resilience

### If Docker is unavailable
Say:
- use backup screenshots
- explain the expected startup process and show smoke-check documentation

## Backup Items to Keep Ready
- dashboard screenshot
- analytics screenshot
- forecast screenshot
- admin screenshot
- architecture diagram
- ERD
- smoke-check output or screenshot

## Personal Actions Required
- Rehearse this runbook at least once before the final defense.
- Capture backup screenshots before presentation day.
- Keep your login credentials and startup commands ready in a note you can access quickly.
