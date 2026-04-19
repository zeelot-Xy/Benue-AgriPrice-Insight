# Requirements Specification

## Purpose
This document defines the software requirements for BAPI in a traceable, implementation-oriented, and academically defendable form.

## Scope Context
The requirements in this document apply only to the approved Benue State project scope, four markets, eight commodities, and the two-user-role model.

## Stakeholders
- Farmers and producers
- Commodity traders
- Policymakers and analysts
- Admin operator
- Project supervisor and examiners

## User Roles
### Admin
- Authenticated manager of master data and price records
- Responsible for uploads, manual entry, corrections, and operational review

### Viewer/Farmer
- Read-only consumer of dashboards and insight outputs
- Does not modify stored records

## Functional Requirements
### FR-01 Admin Authentication
- The system shall allow an admin to log in with valid credentials.
- The system shall deny access to protected routes when a valid token is absent.
- Acceptance note: unauthenticated requests to admin-only endpoints must be rejected.

### FR-02 Role-Based Access Control
- The system shall separate write privileges from read-only access.
- The system shall ensure that viewers cannot modify system data.

### FR-03 Market Reference Management
- The system shall store and expose the four approved markets.
- The system shall prevent duplicate market definitions.
- The system shall support activation or deactivation if needed without deleting historical records.

### FR-04 Commodity Reference Management
- The system shall store and expose the eight approved commodities.
- The system shall prevent duplicate commodity definitions.
- The system shall support metadata such as slug and default unit.

### FR-05 Manual Price Entry
- The system shall allow admins to enter a price record manually.
- Each price record shall include commodity, market, date, price, unit, and optional source note.
- The system shall reject incomplete or invalid price records.

### FR-06 CSV Import
- The system shall allow admins to upload CSV files for batch import.
- The system shall validate CSV headers and row-level field values.
- The system shall report total rows, successful rows, and failed rows.
- The system shall preserve import-batch traceability.

### FR-07 Historical Record Query
- The system shall provide filtered retrieval of price records by market, commodity, and date range.
- The system shall support chronological views suitable for charts and reports.

### FR-08 Dashboard Summary
- The system shall display summary cards and charts based on stored records.
- The system shall allow users to view selected markets and commodities over time.

### FR-09 Market Comparison
- The system shall compare prices of the same commodity across the four markets.
- The system shall compute and display highest, lowest, spread, and state average values.

### FR-10 Trend Detection
- The system shall classify price movement as upward, downward, or stable using explainable rules.
- The system shall provide the compared values and the reason for the classification.

### FR-11 Alerts
- The system shall generate alerts when a configured week-over-week threshold is exceeded.
- The system shall explain which values triggered the alert.

### FR-12 Seasonality Insight
- The system shall summarize recurring monthly or seasonal patterns when sufficient historical records exist.
- The system shall avoid claiming seasonality when available data is insufficient.

### FR-13 State Average
- The system shall compute a state average price for each commodity using the four selected markets.

### FR-14 Forecast Request
- The system shall support optional forecast generation through the ML microservice.
- The system shall keep forecast outputs separate from observed historical data.
- The system shall show explanatory context with forecast output.

### FR-15 Reporting Support
- The system shall provide outputs suitable for screenshots, demos, and final report discussion.

## Non-Functional Requirements
### NFR-01 Explainability
- Every rule-based result shall include text that explains the result.
- Forecast outputs shall be clearly labeled as estimates.

### NFR-02 Maintainability
- The system shall use layered architecture and service-oriented separation.
- Code shall remain readable and strongly typed.

### NFR-03 Security
- Authentication shall protect administrative functions.
- Request validation and secure headers shall be applied to the backend.

### NFR-04 Performance
- The system shall respond smoothly for the project-scale dataset.
- Dashboard queries shall remain practical for local use and demo scenarios.

### NFR-05 Usability
- The UI shall be clear to non-technical users.
- Charts and summaries shall use readable labels and visually consistent styling.

### NFR-06 Portability
- The application stack shall be runnable locally through Docker Compose in later phases.

### NFR-07 Scope Discipline
- The implementation shall not extend beyond the approved domain scope without formal review.

## Assumptions
- Historical data will be manually curated or imported from CSV.
- Weekly updates will be entered by an admin.
- Users will access the system through standard web browsers.

## Constraints
- No real-time scraping
- No mobile app
- No IoT devices
- No uncontrolled AI-generated recommendations
- No geographic expansion beyond Benue State for this project

## Traceability Note
Each requirement ID is intentionally implementation-ready so later testing, API design, and acceptance checks can refer back to this document directly.

## Personal Actions Required
- If your supervisor or department requires a formal SRS template, you may remap these sections into that template without changing the underlying requirements.
