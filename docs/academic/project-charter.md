# Project Charter

## Project Name
BAPI - Benue AgriPrice Insight

## Official Title
Design and Implementation of a Web-Based Agricultural Market Price Monitoring and Analysis System for Benue State

## Background
Benue State is widely recognized for strong agricultural activity, yet access to organized and comparable market price information remains limited for many stakeholders. Farmers often sell with incomplete knowledge of market conditions, traders rely on fragmented local observations, and analysts may lack a focused local tool for understanding how prices move across representative markets over time.

## Problem Statement
There is no focused, explainable, and practically scoped web-based system dedicated to monitoring, comparing, and analyzing the prices of selected agricultural commodities across representative markets in Benue State using structured historical and weekly records.

## Project Justification
This project is justified on technical, practical, and academic grounds:
- It addresses a real local information gap in agricultural market monitoring.
- It demonstrates full-stack software engineering using a clear frontend-backend architecture.
- It balances utility and feasibility by using a strict domain scope.
- It emphasizes explainable analytics instead of opaque decision-making.
- It supports public contribution while preserving data quality through administrative review.

## Aim
To design and implement a web-based agricultural market price monitoring and analysis system for Benue State that supports structured data capture, moderated public submission, visualization, and explainable analytical insight generation.

## Objectives
1. Design a secure and maintainable web platform for agricultural market price management.
2. Capture historical and weekly commodity prices for selected markets in Benue State.
3. Provide dashboards for market comparison, trend visualization, and state-average summaries.
4. Implement explainable rule-based analysis for trends, alerts, and seasonal patterns.
5. Support public price submission with administrative review before approval into live statistics.
6. Produce a system that is academically credible, practically demonstrable, and feasible within a final-year project timeline.

## Stakeholders
- Farmers and producers seeking market awareness
- Commodity traders comparing local market conditions
- Policymakers and agricultural analysts
- Public contributors submitting observations
- System administrator responsible for data management and moderation
- Project supervisor and examiners

## In Scope
- Benue State only
- Four markets: Makurdi, Gboko, Zaki Biam, Otukpo
- Eight commodities: Yam, Cassava, Rice, Maize, Beans, Soybean, Millet, Sorghum
- Historical records and weekly price updates
- Admin manual entry and CSV import
- Public price submission through guided form or CSV, subject to review
- Public dashboard access
- Rule-based analysis only

## Out of Scope
- Real-time scraping from web sources
- IoT sensor integration
- Mobile application development
- Expansion beyond the four selected markets
- Expansion beyond the eight selected commodities
- Fully autonomous recommendation systems
- Forecasting or machine-learning prediction in the final project baseline

## Expected Deliverables
- Web frontend for dashboards and user interaction
- Backend API for data management, moderation, and analytics
- PostgreSQL database with structured market-price records
- Academic documentation and defense materials

## Risks and Mitigations
| Risk | Likely Effect | Mitigation |
| --- | --- | --- |
| Poor data quality in manual or CSV input | Misleading analysis | Validate inputs, restrict format, report errors clearly |
| Unreviewed public submissions | Misleading official statistics | Require admin moderation before publication |
| Scope expansion | Delayed delivery | Keep strict scope in all documents and code |
| UI over-polish before core features | Lost implementation time | Prioritize data, backend, and analytics first |

## Success Metrics
- The system supports complete price management for the approved dataset scope.
- Dashboard users can compare markets and view historical price movements.
- Rule-based insights are generated with clear explanations.
- Public submissions enter a review queue and do not alter official analytics until approved.
- The final implementation is demonstrable locally via Docker-based setup.

## Governance Rules
- All later changes must align with the locked scope.
- Business logic should remain explainable and maintainable.
- Technical decisions must preserve academic defensibility.
- New features should be added only if they reinforce, not dilute, the approved problem definition.

## Personal Actions Required
- Replace any institution-specific wording if your department uses a prescribed charter format.
- Align this document with your supervisor's preferred wording if required.
- Record any scope refinements approved by your supervisor in `docs/meetings/supervisor-log.md`.
