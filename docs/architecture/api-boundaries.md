# API Boundaries

## Purpose
This document defines the main backend resource areas and their responsibilities.

## Boundary Principles
- The backend remains the authority for validation and publication.
- Public submission and admin moderation are explicit workflow boundaries.
- Analytics consume approved records only.

## Resource Areas

### Authentication
Responsibilities:
- log in admins
- return current admin session data

Typical endpoints:
- `POST /api/auth/login`
- `GET /api/auth/me`

### Markets
Responsibilities:
- expose approved market metadata
- allow admin maintenance of market records

### Commodities
Responsibilities:
- expose approved commodity metadata
- allow admin maintenance of commodity records

### Prices
Responsibilities:
- create and update official price records
- support admin CSV import
- return chart-ready and report-ready historical records

### Analytics
Responsibilities:
- expose trends, alerts, market comparisons, seasonality summaries, and state averages
- return explanatory text with analytic results

### Reports
Responsibilities:
- expose dashboard overview data
- support report-friendly aggregations

### Submissions
Responsibilities:
- accept public CSV and guided-form submissions
- store proposed rows in a moderation queue
- expose review and approval actions to admins

Initial endpoint sequence:
- `POST /api/submissions/csv`
- `POST /api/submissions/manual`
- `GET /api/submissions/pending`
- `POST /api/submissions/:id/approve`
- `POST /api/submissions/:id/reject`

## Validation Rules
- Requests must stay within the approved four-market and eight-commodity scope.
- Price values must be numeric and positive.
- Duplicate official price rows should be rejected.
- Submission responses must clearly label pending versus approved status.

## Delivery Order
1. auth
2. markets
3. commodities
4. prices
5. analytics and reports
6. submissions

## Personal Actions Required
- If you produce an API appendix later, you may expand this document into a fuller endpoint catalogue without changing the service boundaries.
