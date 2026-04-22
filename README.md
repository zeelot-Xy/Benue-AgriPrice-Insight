# BAPI - Benue AgriPrice Insight

## Official Project Title
Design and Implementation of a Web-Based Agricultural Market Price Monitoring and Analysis System for Benue State

## Short Description
BAPI is a web-based agricultural market price monitoring and analysis system designed for Benue State, Nigeria. It supports structured historical data storage, weekly price updates, visual analytics, and explainable rule-based insights across selected commodities and markets.

## Problem Context
Agricultural producers, traders, and public-sector decision-makers often rely on fragmented and informal price information. In practice, this weakens bargaining power, slows response to unusual market shifts, and makes it difficult to compare local markets over time. BAPI addresses this problem by providing a focused, explainable, and academically defendable information system for monitoring commodity prices within a tightly defined local scope.

## Project Aim
To design and implement a web-based agricultural market price monitoring and analysis system for Benue State that captures historical and weekly agricultural market prices, supports comparison across selected markets, and generates explainable analytical insights.

## Core Objectives
1. Provide a reliable platform for recording historical and weekly agricultural commodity prices.
2. Support data entry through admin manual entry and CSV import.
3. Visualize price changes across time, commodities, and markets.
4. Generate explainable rule-based insights such as trends, alerts, market comparisons, and seasonality summaries.
5. Maintain a scope that is realistic for a final-year project and strong enough for academic defense.

## Locked Scope
- Geographic scope: Benue State only
- Markets: Makurdi, Gboko, Zaki Biam, Otukpo
- Commodities: Yam, Cassava, Rice, Maize, Beans, Soybean, Millet, Sorghum
- Users: Admin and Viewer/Farmer
- Data capture method: manual weekly entry and CSV import
- Analysis coverage: historical analysis, weekly monitoring, trend detection, alerts, seasonality insight, market comparison, state averages

## Explicitly Out of Scope
- Real-time web scraping
- IoT sensors or embedded hardware collection
- Native mobile application
- Expansion to all Nigerian states
- Autonomous decision-making without explainable logic

## Academic Positioning
This project is intentionally scoped for feasibility, explainability, and technical defensibility. The system focuses on weekly monitoring and rule-based analytics so that every major output remains understandable, maintainable, and easy to defend academically.

## Locked Technology Stack
- Frontend: React 18, Vite, TypeScript, Tailwind CSS v4, Recharts, React Router v7, TanStack Query, Lucide React
- Backend: Node.js 20, Express, TypeScript, Prisma ORM, PostgreSQL, Zod, JWT, Helmet
- Deployment: Docker Compose

## Visual System
- Primary: Evergreen `#0F3A2F`
- Accent: Jade `#34C9A2`
- Secondary: Mint `#A1E8C8`
- Background: Soft cream `#F8F7F2`
- Background treatment: subtle grid-line pattern with low-opacity forest-inspired gradients
- Brand: BAPI - Benue AgriPrice Insight

## Development Philosophy
1. Make the system work fully with clear frontend and backend boundaries.
2. Keep rule-based analysis and alerts explainable.
3. Use a structure that is easy to maintain, debug, and extend.
4. Polish the interface, report artifacts, and defense narrative.

## Documentation Map
- `docs/academic`: academic framing, requirements, use cases, report prelim pages
- `docs/academic/report-chapter-mapping.md`: maps repository evidence to final report chapters
- `docs/academic/methodology-and-implementation-mapping.md`: maps the development method to actual implementation phases
- `docs/academic/defense-evidence-matrix.md`: likely defense questions and supporting evidence
- `docs/academic/defense-presentation-outline.md`: suggested slide-by-slide structure for the final presentation
- `docs/architecture`: repository structure, system architecture, ERD, API boundaries, analysis rules
- `docs/architecture/backend-api-development.md`: implemented backend scope and route coverage
- `docs/architecture/rule-based-analysis-engine.md`: implemented analytics endpoints and deterministic rules
- `docs/architecture/frontend-ui-phase9.md`: implemented frontend shell, page routes, and chart-driven dashboard views
- `docs/architecture/frontend-backend-integration-phase10.md`: implemented live frontend data integration, auth wiring, and fallback behavior
- `docs/architecture/testing-and-debugging-phase11.md`: testing checklist, runtime blockers, and smoke-check workflow
- `docs/branding`: brand and logo specification
- `docs/meetings`: supervisor meeting records
- `docs/references`: manual follow-up instructions for assets or details that cannot be finalized directly in Markdown
- `docs/references/submission-readiness-checklist.md`: final submission and defense checklist
- `docs/references/defense-demo-runbook.md`: practical live demo flow and fallback plan
- `docs/references/final-polish-handoff.md`: summary of what is complete and what still depends on you
- `CONTRIBUTING.md`: Git workflow discipline, branch strategy, and commit conventions

## Repository Layout
```text
backend/          # Express backend
frontend/         # React frontend
data/
  processed/      # cleaned or transformed datasets
  raw/            # source CSV files and curated input data
docs/
  academic/       # defense-facing academic documents
  architecture/   # technical design and diagrams
  branding/       # logo and visual identity notes
  meetings/       # supervisor meeting records
  references/     # manual action trackers and external asset notes
prisma/
  migrations/     # migration history
scripts/          # helper scripts, imports, seeds
tests/            # integration and end-to-end tests later
```

## Phase Status
- Phase 0 completed: project definition, academic framing, repo setup
- Phase 1 completed: requirements analysis, system design, ERD, architecture
- Phase 2 completed: dataset strategy and sample data preparation
- Phase 3 completed: Git workflow discipline and monorepo governance
- Phase 4 completed: local environment setup and service bootstrapping
- Phase 5 completed: database modeling with Prisma schema and seed foundation
- Phase 6 completed: backend API development for auth, reference data, prices, and reports
- Phase 7 completed: rule-based trend, alert, seasonality, comparison, and state-average analytics
- Phase 8 retired: forecasting layer removed to keep the project focused on explainable monitoring and analysis
- Phase 9 completed: frontend UI shell, themed pages, and chart-driven dashboard foundation
- Phase 10 completed: live frontend-backend integration with TanStack Query and auth wiring
- Phase 11 completed: smoke-check workflow, runtime blocker review, and testing/debugging guidance
- Phase 12 completed: documentation mapping, defense evidence preparation, and submission readiness support
- Phase 13 completed: final polish support, defense presentation outline, and demo runbook
- Project implementation phases complete: final personal submission tasks remain

## Current Setup Expectations
This repository now includes the project documentation set, dataset foundation, Prisma data model, backend APIs, explainable analytics, the frontend product shell, and live frontend-backend data integration.

## Engineering Rules
- Prefer TypeScript across frontend and backend.
- Keep business logic in service layers.
- Keep analytics explainable with both numbers and human-readable reasons.
- Keep the project inside the approved scope at all times.

## Personal Actions Required
Some project artifacts cannot be finalized directly in the repository at this stage, including final logo graphics, polished report diagrams, screenshots, institutional prelim-page wording, and personal details. See `docs/references/document-edit-actions.md` for the complete checklist of manual actions required later.
