# Scope and Constraints

## Scope Statement
This project is a focused information system for monitoring and analyzing agricultural commodity prices in Benue State. It is not intended to model every market, every commodity, or every method of data acquisition. The restricted scope is deliberate and central to the quality of the final-year project.

## Geographic Scope
- State: Benue State, Nigeria
- Markets:
  - Makurdi
  - Gboko
  - Zaki Biam
  - Otukpo

These markets are treated as representative coverage rather than exhaustive statewide coverage.

## Commodity Scope
- Yam
- Cassava
- Rice
- Maize
- Beans
- Soybean
- Millet
- Sorghum

No additional commodities are to be introduced unless there is a formal supervisor-approved scope change.

## User Scope
### Admin
- Manages market price data
- Imports CSV files
- Reviews system outputs

### Viewer/Farmer
- Consumes dashboards and insights
- Does not edit records

## Functional Scope
- Admin authentication
- Market and commodity reference management
- Historical and weekly price storage
- CSV import and manual entry
- Dashboard analytics and charts
- Market comparisons
- State average calculation
- Trend detection
- Alerts for unusual price change
- Seasonal pattern summaries
- Optional short-term forecasting

## Data Scope
- Data source type: manually curated or admin-uploaded CSV records
- Update frequency: weekly for routine operational updates
- Historical data: curated imports for retrospective analysis

## Technology Scope
- Web-only system
- Frontend, backend, database, and separate ML microservice
- Docker Compose local orchestration

## Hard Constraints
- No live web scraping
- No sensor networks or IoT collection
- No mobile app
- No nationwide deployment target for this academic project
- No opaque analysis output without reasoning text

## Feasibility Rationale
The project must be completed, defended, and demonstrated within a final-year academic timeline. A smaller but rigorous scope is more academically credible than a broad but incomplete system. This scope makes the following possible:
- Better data quality control
- Clearer explanation of system behavior
- Stronger backend and analytics quality
- Higher chance of full end-to-end completion

## Defense Position
If questioned about the narrowness of scope, the appropriate defense is:
- the project prioritizes depth over breadth
- the selected markets are representative enough for a prototype and case study
- the selected commodities are agriculturally relevant and sufficient for meaningful comparison
- the system is intentionally designed for explainability and successful completion

## Non-Negotiable Boundary Reminder
All future features, documents, and implementations must remain inside this scope unless your supervisor formally approves a change and it is recorded in the meeting log.

## Personal Actions Required
- If your department requires a formal “scope and limitation” wording style, adapt the headings without expanding the actual project boundary.
- If your supervisor approves any variation to scope, record it first in `docs/meetings/supervisor-log.md` and then update this document.
