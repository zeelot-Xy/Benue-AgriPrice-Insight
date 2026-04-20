# Monorepo Governance

## Purpose
This document refines how the BAPI monorepo should grow so that new code is added to the correct place and responsibilities do not become blurred over time.

## Governance Principles
- keep app responsibilities separate
- avoid premature shared-package extraction
- prefer clarity over clever structure
- keep documentation and data close to the repo root
- add new top-level folders only with clear justification

## Folder Responsibility Rules

### `apps/web`
This folder owns:
- React routes
- dashboard UI
- admin forms
- chart components
- client-side data fetching hooks

It should not own:
- business-rule calculation logic that belongs in the backend
- database access logic
- forecasting implementation

### `apps/api`
This folder owns:
- HTTP endpoints
- authentication
- validation
- business logic orchestration
- rule-based analysis logic
- database access

It should not own:
- frontend presentation
- long-term model training artifacts

### `apps/ml`
This folder owns:
- forecast-specific preprocessing
- model loading and inference
- forecast API responses

It should not own:
- system-wide authentication
- primary CRUD logic for markets or prices

### `packages/config`
Only move files here when multiple apps genuinely share the same configuration concern.

### `packages/ui`
Only move tokens or helpers here when there is real reuse across frontend modules. Do not create a complex design-system package too early.

### `docs`
This folder owns:
- academic artifacts
- architectural references
- branding guidance
- manual-reference notes

### `data`
This folder owns:
- raw CSV source data
- processed datasets
- future seed-oriented data preparation artifacts

## Shared Code Extraction Rule
Do not move code into `packages/*` just because it might be reused later. Extract only after the same logic is duplicated or clearly needed in multiple places.

## Naming Guidance
- use lowercase folder and file names where practical
- use descriptive names over abbreviations
- keep CSV filenames stable and explicit

## Change-Control Guidance
When introducing a new structural decision:
1. confirm it supports the approved scope
2. document it if it changes team workflow or architecture
3. avoid restructuring unrelated parts of the repo at the same time

## Anti-Patterns to Avoid
- mixing backend services into frontend folders
- storing report-only assets inside application directories
- expanding `packages/*` before real reuse exists
- adding infrastructure complexity before local development basics are working

## Personal Actions Required
- If your supervisor requests a different organization for report materials, keep the repo structure intact and adapt the exported submission bundle instead of destabilizing the codebase.
