# Rule-Based Analysis Engine

## Purpose
This document captures the implementation introduced in Phase 7 for deterministic analytics in BAPI. The goal is to provide useful, explainable outputs before any forecasting or machine learning layer is involved.

## Implemented Analytics Endpoints
- `GET /api/analytics/trends`
- `GET /api/analytics/alerts`
- `GET /api/analytics/comparisons`
- `GET /api/analytics/seasonality`
- `GET /api/analytics/state-average`

## Trend Detection
The implemented logic compares the latest two comparable records within each market and commodity series.

Default rule:
- greater than `+3%` => `UPWARD`
- less than `-3%` => `DOWNWARD`
- otherwise => `STABLE`

Each trend response includes:
- previous date and value
- current date and value
- absolute change
- percentage change
- explanation text

## Alerts
Alerts are derived from the same price-change logic but use a stronger threshold.

Default threshold:
- `10%`

Alert responses include:
- alert type (`PRICE_SPIKE` or `PRICE_DROP`)
- severity
- threshold used
- explanatory text tied to the observed values

## Market Comparisons
Comparison logic ranks the four approved markets for a selected commodity and date, then returns:
- highest market
- lowest market
- spread
- state average
- ranked entries

## Seasonality
Seasonality is implemented as grouped monthly average analysis using available historical records.

Guardrail:
- if there is not enough data, the service returns `INSUFFICIENT_DATA` rather than forcing a misleading conclusion

## State Average
State averages are derived from the approved four-market set and explicitly indicate whether the result used all four markets or only the available subset.

## Explainability Guarantee
All analytics endpoints return explanation text alongside numeric values. This preserves the academic requirement that the system remain transparent and defendable.

## Current Limitations
- analytics are computed on demand and not yet persisted as `AnalysisSnapshot`
- alert rows are not yet stored in the `Alert` table
- seasonality is monthly aggregation only in this phase

## Personal Actions Required
- If you later refine thresholds after supervisor review or larger data collection, update both this document and `docs/architecture/data-flow-and-analysis-rules.md`.
