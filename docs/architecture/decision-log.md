# Architecture Decision Log

## ADR-0001: Use a Monorepo
- Status: Accepted
- Context: The project contains a frontend, backend, ML service, documentation, and shared configuration.
- Decision: Use one repository with isolated application directories and shared root standards.
- Consequence: Simpler coordination for an academic project, easier defense, and less duplication.

## ADR-0002: Prioritize Explainable Rule-Based Analytics Before ML
- Status: Accepted
- Context: The system must remain defendable and useful even without machine learning.
- Decision: Build descriptive analytics and rule-based insights first, then add forecasting as an enhancement.
- Consequence: Stronger maintainability, better scope control, and clearer academic explanation.

## ADR-0003: Restrict Scope to Four Markets and Eight Commodities
- Status: Accepted
- Context: Broad geographic or commodity coverage risks shallow implementation.
- Decision: Limit the domain to four representative Benue markets and eight core commodities.
- Consequence: Better feasibility and stronger data consistency.
