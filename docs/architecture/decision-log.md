# Decision Log

## ADR-0001: Keep the Project Strictly Scoped
- Context: Final-year projects become harder to finish and defend when scope expands too early.
- Decision: Limit the project to Benue State, four markets, and eight commodities.
- Consequence: The system remains feasible and testable.

## ADR-0002: Prefer Explainable Rule-Based Analytics
- Context: The project must remain useful and defendable through transparent logic.
- Decision: Use deterministic analytical rules for trends, alerts, seasonality summaries, comparisons, and state averages.
- Consequence: Outputs are easier to explain and validate academically.

## ADR-0003: Keep Frontend and Backend as Distinct Application Layers
- Context: The primary developer reasons more clearly with an explicit frontend-backend boundary.
- Decision: Organize the active implementation into `frontend` and `backend`.
- Consequence: Ownership, debugging, and maintenance become more straightforward.

## ADR-0004: Retire Forecasting From the Final Project Baseline
- Context: The forecasting layer increased architectural complexity, runtime dependencies, and maintenance cost without being essential to the approved project objective.
- Decision: Remove forecasting from the final implementation baseline and keep the finished system centered on monitoring, moderated data capture, and explainable rule-based analytics.
- Consequence: The project is easier to run, easier to defend, and easier to maintain.

## ADR-0005: Allow Public Submission but Require Admin Review
- Context: Public contribution improves practicality, but uncontrolled direct publishing would weaken data quality.
- Decision: Route public entries through a pending submission queue reviewed by an admin.
- Consequence: The system gains accessibility without sacrificing trust in official outputs.
