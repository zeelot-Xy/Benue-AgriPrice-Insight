# BAPI - Benue AgriPrice Insight

## Project Title
Web-Based Agricultural Market Price Monitoring and Analysis System for Benue State

## Refined Academic Title
Design and Implementation of a Web-Based Agricultural Market Price Monitoring and Analysis System for Benue State

## Project Summary
BAPI is a web-based decision-support system for monitoring, analyzing, and forecasting agricultural market prices across selected markets in Benue State, Nigeria. The system focuses on eight key commodities and four representative markets: Makurdi, Gboko, Zaki Biam, and Otukpo.

The platform is intentionally scoped for academic rigor, explainability, and successful delivery within a final-year project timeline. It supports historical and weekly price monitoring through manual entry and CSV import, then builds upward into rule-based analysis, visual insights, and optional machine learning forecasting.

## Locked Scope
- State coverage: Benue State only
- Markets: Makurdi, Gboko, Zaki Biam, Otukpo
- Commodities: Yam, Cassava, Rice, Maize, Beans, Soybean, Millet, Sorghum
- Data collection: historical records plus weekly updates
- Data entry mode: admin CSV import and manual entry only
- Users: Admin and Viewer/Farmer
- Analysis focus: trends, alerts, seasonality, market comparison, state average, optional forecasting
- Exclusions: no real-time scraping, no IoT sensors, no mobile app

## Locked Technology Stack
- Frontend: React 18, Vite, TypeScript, Tailwind CSS v4, Recharts, React Router v7, TanStack Query, Lucide React
- Backend: Node.js 20, Express, TypeScript, Prisma ORM, PostgreSQL, Zod, JWT, Helmet
- AI/ML: Python 3.11, FastAPI, pandas, scikit-learn, Prophet, joblib
- Deployment: Docker Compose

## Development Philosophy
1. Build the full system without AI/ML first.
2. Add explainable rule-based analysis and alerts.
3. Add forecasting logic.
4. Add optional ML enhancement for academic strength.
5. Polish the UI, documentation, and defense narrative.

## Visual Direction
- Primary: Evergreen `#0F3A2F`
- Accent: Jade `#34C9A2`
- Secondary: Mint `#A1E8C8`
- Background: Soft natural cream `#F8F7F2`
- Background treatment: gentle forest-inspired gradients with subtle low-opacity grid lines

## Phase Status
- Phase 0: Project definition, academic framing, and repo setup

## Repository Layout
```text
apps/
  api/            # Express + TypeScript backend
  ml/             # FastAPI forecasting microservice
  web/            # React + Vite frontend
data/
  processed/      # cleaned or transformed datasets
  raw/            # imported CSV files and source datasets
docs/
  academic/       # defense-facing academic documentation
  architecture/   # diagrams, ERD, and design notes
  branding/       # logo brief and visual system
packages/
  config/         # shared configuration
  ui/             # shared UI tokens/components if needed later
prisma/
  migrations/     # Prisma migration history
scripts/          # utilities, seed helpers, import helpers
tests/            # integration and system-level tests
```

## Quick Start
This phase only establishes the project foundation and documentation. Environment setup, Docker, app initialization, and database work begin in later phases.

## Authoring Notes
- Keep all logic explainable and defendable.
- Prefer service-layer architecture and strong typing.
- Do not expand beyond the approved project scope.
