# Phase 9: Frontend UI Foundation

## Purpose
Phase 9 transforms the frontend from a bootstrap placeholder into a realistic product interface for BAPI. The emphasis is on clarity, visual quality, and an API-ready structure that can connect to live backend data in Phase 10 without a redesign.

## Design Principles Applied
- the interface follows the locked BAPI visual direction:
  - Evergreen `#0F3A2F`
  - Jade `#34C9A2`
  - Mint `#A1E8C8`
  - Cream `#F8F7F2`
- the main surfaces use a subtle forest-grid background and soft gradients
- the layout is premium and calm rather than flashy
- charts are paired with explanatory text to support academic defense
- forecasting visuals clearly separate actual values from projected values

## Frontend Stack Used
- React 18
- Vite
- TypeScript
- Tailwind CSS v4
- React Router
- TanStack Query
- Recharts
- Lucide React

## Implemented Pages
- `Dashboard`
  - summary metrics
  - weekly price trend chart
  - alert cards
  - quick-action area
- `Markets`
  - representative market cards
  - comparison chart
  - seasonality note cards
- `Analytics`
  - trend-focused chart
  - alert logic cards
  - textual seasonality interpretation
- `Forecasts`
  - forecast chart with actual versus projected separation
  - forecast explanation panels
- `Admin`
  - controlled CSV import placeholder area
  - admin checklist and access-control framing
- `Login`
  - branded sign-in screen aligned with the final visual identity

## Architectural Choices

### App Shell
The shell includes:
- a branded sidebar
- route-aware navigation
- a high-level header
- shared glass-style panels

This creates visual consistency across all major views and makes later page expansion safer.

### Mock Query Layer
Phase 9 intentionally uses a mock service layer through TanStack Query:
- `src/services/mock-api.ts`
- `src/hooks/use-phase9-data.ts`

This keeps the component tree close to the final integrated structure while still respecting the phased plan. In Phase 10, these mock functions can be replaced by real HTTP clients with minimal UI churn.

### Shared Components
The UI uses reusable primitives such as:
- `BapiLogo`
- `MetricCard`
- `SectionCard`
- `StatusPill`
- `AppShell`

This reduces duplication and improves maintainability.

## Why This Phase Is Defendable
- it demonstrates intentional UI engineering rather than a last-minute theme layer
- it respects the locked academic scope
- it keeps business logic out of visual components
- it prepares clean integration points instead of hard-coding temporary demo logic into the page structure

## Known Limits in Phase 9
- authentication form submission is not yet connected
- CSV upload is still a UI placeholder
- charts use mock-query data rather than live backend data
- forecast visuals are presentation-ready, but live forecasting requests will be connected in Phase 10

## Verification
- frontend TypeScript typecheck passes
- Vite production build should pass when run outside sandbox restrictions

## Personal Review Checkpoint
This is the first strong visual review phase. After the local frontend is run, review:
- whether the grid-and-gradient background feels premium and calm
- whether the logo treatment feels strong enough in the sidebar and login page
- whether charts are readable on desktop and mobile
- whether the dashboard feels academically credible rather than overdesigned

## Personal Actions Required
- After running the UI locally, capture polished screenshots for later report and presentation use.
- If your supervisor prefers a slightly more formal or simpler login view, adjust that after visual review rather than before integration.
