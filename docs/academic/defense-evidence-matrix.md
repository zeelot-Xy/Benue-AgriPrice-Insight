# Defense Evidence Matrix

## Purpose
This document prepares you for project defense by mapping likely defense questions to concrete repository evidence, system features, and academic justifications.

## Defense Matrix
| Likely Question | Short Answer Direction | Evidence to Cite |
| --- | --- | --- |
| Why did you restrict the system to only four markets? | To preserve feasibility, data quality, and academic defensibility while still covering representative Benue markets. | `docs/academic/scope-and-constraints.md`, `docs/academic/project-charter.md` |
| Why only eight commodities? | To keep the dataset manageable and the analysis interpretable within a final-year project timeline. | `docs/academic/scope-and-constraints.md`, `data/raw/commodities.csv` |
| Why no real-time scraping? | Because the system is designed around controlled historical and weekly monitoring using validated entry and CSV import. | `docs/academic/scope-and-constraints.md`, `docs/architecture/csv-import-spec.md` |
| Why is the system still useful without ML? | Because rule-based trend detection, alerts, seasonality insight, and market comparison already deliver actionable value. | `docs/architecture/rule-based-analysis-engine.md` |
| Why did you still add forecasting? | To increase academic value as an enhancement, while keeping the core system explainable and functional without it. | `docs/architecture/ml-forecasting-service.md` |
| Why did you choose Prophet? | It is appropriate for short-term time-series forecasting and is easier to explain than more complex black-box methods for this project scope. | `docs/architecture/ml-forecasting-service.md` |
| How do you ensure the system is maintainable? | Through layered architecture, TypeScript usage, documented services, Prisma modeling, and clear module boundaries. | `docs/architecture/system-architecture.md`, `docs/architecture/repository-structure.md`, `docs/architecture/database-modeling-with-prisma.md` |
| How do you ensure the system is testable? | The project includes phased verification, smoke checks, and documented runtime validation steps. | `docs/architecture/testing-and-debugging-phase11.md`, `scripts/smoke-check.mjs` |
| Why separate frontend, backend, and ML service? | Separation improves modularity, maintainability, and failure isolation. | `docs/architecture/system-architecture.md`, `docs/architecture/frontend-backend-integration-phase10.md` |
| What happens if the ML service is unavailable? | The application still works, and the frontend clearly falls back rather than failing silently. | `docs/architecture/ml-forecasting-service.md`, `docs/architecture/frontend-backend-integration-phase10.md` |

## Technical Features You Should Mention During Defense
- controlled CSV import instead of unreliable live scraping
- explainable trend and alert rules
- market comparison and state average logic
- clear distinction between actual values and forecast values
- fallback strategy when backend or ML services are unavailable
- phased, documented implementation from planning to testing

## Evidence Types You Should Bring to Defense
- architecture diagram
- ERD
- use-case model
- screenshots of dashboard, analytics, forecasts, admin, and login pages
- smoke-check output
- sample CSV data
- sample API responses if needed

## High-Value Demo Flow
Recommended defense demo flow:
1. Show login page
2. Show dashboard summary and alert cards
3. Show market comparison
4. Show analytics explanation cards
5. Show forecast view and explain live versus fallback behavior
6. Show admin screen and explain CSV import workflow

## Personal Actions Required
- Practice short answers using this matrix before the final defense.
- Bring visual screenshots and diagrams to support verbal explanations.
- If your supervisor emphasizes research contribution, connect every feature back to the local agricultural price-information problem.
