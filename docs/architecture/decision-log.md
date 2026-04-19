# Architecture Decision Log

## ADR-0001: Use a Monorepo
- Status: Accepted
- Context: The project contains multiple services, shared documentation, and possible shared configuration.
- Decision: Use one repository with separate application directories and shared root standards.
- Consequence: Easier coordination, simpler academic review, and lower setup duplication.

## ADR-0002: Prioritize Explainable Rule-Based Analytics Before ML
- Status: Accepted
- Context: The project must remain useful and defendable even without machine learning.
- Decision: Deliver monitoring and deterministic analytics first, then add forecasting as an enhancement.
- Consequence: Stronger transparency, easier testing, and safer phase progression.

## ADR-0003: Restrict Domain Scope to Four Markets and Eight Commodities
- Status: Accepted
- Context: A wider scope risks weak implementation and poor data quality control.
- Decision: Limit the system to four representative markets and eight important commodities.
- Consequence: Better feasibility and clearer data governance.

## ADR-0004: Separate Forecasting Into an ML Microservice
- Status: Accepted
- Context: Forecasting introduces dependencies and concerns different from core CRUD and analytics flows.
- Decision: Keep forecasting in a separate FastAPI service while the main system logic remains in the backend API.
- Consequence: Lower coupling, easier replacement, and clearer architectural explanation during defense.

## ADR-0005: Use Admin Input and CSV Import Instead of Automated Collection
- Status: Accepted
- Context: Real-time scraping and sensor-driven data collection are outside project scope and increase complexity.
- Decision: Use manual entry and CSV import as the controlled data acquisition model.
- Consequence: Higher explainability, lower operational risk, and more realistic academic feasibility.

## ADR-0006: Keep the Backend as the Source of Truth for Analytics
- Status: Accepted
- Context: Analytical consistency is harder to maintain if business logic is split between frontend and backend.
- Decision: Perform analysis in backend services and return structured outputs to the frontend.
- Consequence: Better maintainability, easier testing, and consistent interpretation across views.

## ADR-0007: Use Mermaid for Repository-Native Diagrams First
- Status: Accepted
- Context: Early project phases need editable, version-controlled diagrams without waiting for external design tools.
- Decision: Keep primary diagrams in Mermaid within Markdown documents and optionally redraw them later for final report polish.
- Consequence: Faster iteration now and a clean path to polished visuals later.
