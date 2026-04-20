# BAPI - Benue AgriPrice Insight

## Official Project Title
Design and Implementation of a Web-Based Agricultural Market Price Monitoring and Analysis System for Benue State

## Short Description
BAPI is a web-based agricultural market price monitoring and analysis system designed for Benue State, Nigeria. It supports structured historical data storage, weekly price updates, visual analytics, rule-based insight generation, and optional short-term forecasting for selected commodities across selected markets.

## Problem Context
Agricultural producers, traders, and public-sector decision-makers often rely on fragmented and informal price information. In practice, this weakens bargaining power, slows response to unusual market shifts, and makes it difficult to compare local markets over time. BAPI addresses this problem by providing a focused, explainable, and academically defendable information system for monitoring commodity prices within a tightly defined local scope.

## Project Aim
To design and implement a web-based agricultural market price monitoring and analysis system for Benue State that captures historical and weekly agricultural market prices, supports comparison across selected markets, generates explainable analytical insights, and optionally provides short-term price forecasts.

## Core Objectives
1. Provide a reliable platform for recording historical and weekly agricultural commodity prices.
2. Support data entry through admin manual entry and CSV import.
3. Visualize price changes across time, commodities, and markets.
4. Generate explainable rule-based insights such as trends, alerts, market comparisons, and seasonality summaries.
5. Support optional forecasting as an enhancement, not as the foundation of the system.
6. Maintain a scope that is realistic for a final-year project and strong enough for academic defense.

## Locked Scope
- Geographic scope: Benue State only
- Markets: Makurdi, Gboko, Zaki Biam, Otukpo
- Commodities: Yam, Cassava, Rice, Maize, Beans, Soybean, Millet, Sorghum
- Users: Admin and Viewer/Farmer
- Data capture method: manual weekly entry and CSV import
- Analysis coverage: historical analysis, weekly monitoring, trend detection, alerts, seasonality insight, market comparison, state averages, optional forecasting

## Explicitly Out of Scope
- Real-time web scraping
- IoT sensors or embedded hardware collection
- Native mobile application
- Expansion to all Nigerian states
- Autonomous decision-making without explainable logic

## Academic Positioning
This project is intentionally scoped for feasibility, explainability, and technical defensibility. The system is useful even without machine learning because rule-based analytics provide immediate value. Forecasting is added only as an optional enhancement after the monitoring and analytics foundation is complete.

## Locked Technology Stack
- Frontend: React 18, Vite, TypeScript, Tailwind CSS v4, Recharts, React Router v7, TanStack Query, Lucide React
- Backend: Node.js 20, Express, TypeScript, Prisma ORM, PostgreSQL, Zod, JWT, Helmet
- AI/ML: Python 3.11, FastAPI, pandas, scikit-learn, Prophet, joblib
- Deployment: Docker Compose

## Visual System
- Primary: Evergreen `#0F3A2F`
- Accent: Jade `#34C9A2`
- Secondary: Mint `#A1E8C8`
- Background: Soft cream `#F8F7F2`
- Background treatment: subtle grid-line pattern with low-opacity forest-inspired gradients
- Brand: BAPI - Benue AgriPrice Insight

## Development Philosophy
1. Make the system work fully without AI/ML.
2. Add rule-based analysis and explainable alerts.
3. Introduce forecasting logic.
4. Add optional ML enhancement for academic value.
5. Polish the interface, report artifacts, and defense narrative.

## Documentation Map
- `docs/academic`: academic framing, requirements, use cases, report prelim pages
- `docs/architecture`: repository structure, system architecture, ERD, API boundaries, analysis rules
- `docs/architecture/backend-api-development.md`: implemented backend scope and route coverage
- `docs/branding`: brand and logo specification
- `docs/meetings`: supervisor meeting records
- `docs/references`: manual follow-up instructions for assets or details that cannot be finalized directly in Markdown
- `CONTRIBUTING.md`: Git workflow discipline, branch strategy, and commit conventions

## Repository Layout
```text
apps/
  api/            # Express backend
  ml/             # FastAPI forecasting microservice
  web/            # React frontend
data/
  processed/      # cleaned or transformed datasets
  raw/            # source CSV files and curated input data
docs/
  academic/       # defense-facing academic documents
  architecture/   # technical design and diagrams
  branding/       # logo and visual identity notes
  meetings/       # supervisor meeting records
  references/     # manual action trackers and external asset notes
packages/
  config/         # shared configuration
  ui/             # shared UI tokens or utilities if needed later
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
- Phase 7 onward: analytics and integration phases continue incrementally

## Current Setup Expectations
This repository currently emphasizes project documentation and structure. Environment setup, app bootstrapping, database modeling, APIs, forecasting service wiring, and frontend implementation will be added in later phases.

## Engineering Rules
- Prefer TypeScript across frontend and backend.
- Keep business logic in service layers.
- Keep analytics explainable with both numbers and human-readable reasons.
- Keep forecasting separate from observed historical values.
- Keep the project inside the approved scope at all times.

## Personal Actions Required
Some project artifacts cannot be finalized directly in the repository at this stage, including final logo graphics, polished report diagrams, screenshots, institutional prelim-page wording, and personal details. See `docs/references/document-edit-actions.md` for the complete checklist of manual actions required later.
