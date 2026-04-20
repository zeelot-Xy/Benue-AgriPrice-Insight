# Phase 8: ML Forecasting Service

## Purpose
Phase 8 adds a forecasting layer to BAPI without replacing the core explainable monitoring workflow. The system still depends first on observed price records, rule-based analytics, and human-readable explanations. Forecasting is introduced as an enhancement for short-term academic and decision-support use.

## Scope of the Forecasting Layer
- Model type: Prophet time-series forecasting
- Service boundary: separate FastAPI microservice
- Forecast horizon: 1 to 12 weeks
- Input series: weekly historical price observations for one market and one commodity
- Output: forecast points, uncertainty bounds, validation summary, warnings, and plain-language explanation
- Persistence: forecast run summaries are stored in the main PostgreSQL database through the Node API

## Why This Design Is Defendable
- Forecasting is isolated from the transactional backend, which keeps the main system stable even if Python dependencies are unavailable.
- The forecasting microservice never writes directly to PostgreSQL. It only receives structured historical data and returns a forecast response.
- The Express API remains the orchestration layer for authorization, database reads, database writes, and persistence of forecast-run summaries.
- Each forecast response includes warnings, confidence labels, and explanation text so the result is not treated as a black box.

## Implemented Components

### FastAPI Service
Files:
- `apps/ml/main.py`
- `apps/ml/schemas.py`
- `apps/ml/forecasting.py`

Responsibilities:
- validate the forecasting request payload
- verify dependency readiness
- prepare the weekly time series
- fit Prophet
- generate future weekly predictions
- compute simple holdout metrics
- return explanation text and warnings

### Express Forecast Module
Files:
- `apps/api/src/modules/forecasts/forecasts.routes.ts`
- `apps/api/src/modules/forecasts/forecasts.controller.ts`
- `apps/api/src/modules/forecasts/forecasts.schemas.ts`
- `apps/api/src/modules/forecasts/forecasts.service.ts`

Responsibilities:
- validate query parameters
- load market, commodity, and price history from Prisma
- reject forecasting when history is too short
- call the ML microservice
- store successful forecast runs in `ForecastRun`
- expose forecast history for later dashboard use

## API Endpoints Added

### ML Service
- `GET /health`
  - returns service status, dependency readiness, and Prophet availability
- `GET /`
  - returns a phase-aware service summary
- `POST /forecast`
  - accepts one market/commodity weekly series and returns a Prophet forecast

### Backend API
- `GET /api/forecasts`
  - generates a forecast for a selected market and commodity
  - query parameters: `marketId`, `commodityId`, `horizonWeeks`
- `GET /api/forecasts/history`
  - returns persisted forecast-run summaries
  - optional query parameters: `marketId`, `commodityId`, `limit`

## Forecasting Rules
- minimum history requirement: 4 observations
- preferred history for stronger confidence: 8 or more observations
- yearly seasonality is enabled only when the series is long enough to justify it
- forecasts always remain separate from actual observed price records
- if intervals are not perfectly weekly, the service still responds but includes a reliability warning

## Output Interpretation
Each successful forecast includes:
- latest observed price and date
- future predicted price points by week
- lower and upper forecast bounds
- projected direction relative to the latest observed value
- holdout metrics such as MAE and MAPE when possible
- a confidence label
- a plain-language explanation suitable for the dashboard and academic report

## Failure and Degradation Strategy
- if Prophet or pandas is not installed correctly, the ML service reports `UNAVAILABLE` instead of crashing
- if insufficient history is supplied, the service reports `INSUFFICIENT_DATA`
- if the FastAPI service is offline, the Node API returns `SERVICE_UNAVAILABLE` with a clear action message
- this keeps the overall BAPI application usable even when the ML layer is not ready

## Environment Variables
- `ML_SERVICE_BASE_URL`
- `ML_FORECAST_TIMEOUT_MS`

These variables are used by the backend API to call the FastAPI forecasting service safely.

## Academic Notes
- Prophet is appropriate here because the project focuses on explainable short-term forecasting, not deep-learning complexity.
- The forecasting phase is intentionally isolated so the system remains valid even if the ML service is disabled during demonstration.
- Confidence labels and validation summaries help defend the claim that forecasts are advisory outputs, not guaranteed predictions.

## Personal Actions Required
- If Python ML dependencies are not installed locally, install them before runtime testing of forecasts.
- If your final report requires a screenshot or chart of the forecast interface later, add it to the report and note it in `docs/references/presentation-and-screenshot-reference.md`.
