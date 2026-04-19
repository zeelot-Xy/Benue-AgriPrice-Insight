# Phase Roadmap

## Delivery Principle
The project must progress in strict order so that the system remains feasible, explainable, and academically coherent. Each phase should end with clear outputs and a known readiness condition for the next phase.

## Phase 0: Project Definition, Academic Framing, and Repo Setup
- Outputs:
  - project identity
  - locked scope
  - monorepo scaffold
  - initial academic documents
- Exit criteria:
  - repository initialized
  - scope documented
  - project framing accepted

## Phase 1: Requirements Analysis, System Design, ERD, and Architecture
- Outputs:
  - requirements specification
  - use case model
  - system architecture
  - ERD and API boundary notes
- Exit criteria:
  - data model and service boundaries documented
  - roles and scope clarified

## Phase 2: Dataset Strategy and Data Preparation
- Outputs:
  - dataset sourcing approach
  - CSV format definition
  - sample and seed data strategy
  - data cleaning rules
- Dependencies:
  - requires stable scope and data model assumptions
- Exit criteria:
  - sample data strategy accepted
  - CSV shape defined for import

## Phase 3: Git Workflow Discipline and Monorepo Structure Refinement
- Outputs:
  - branch strategy
  - commit conventions
  - package organization refinement
- Exit criteria:
  - engineering workflow agreed
  - repo structure ready for service bootstrapping

## Phase 4: Local Environment Setup
- Outputs:
  - Docker Compose plan
  - bootstrapped frontend, backend, and ML service
  - environment file templates
- Exit criteria:
  - all services can start locally

## Phase 5: Database Modeling with Prisma Schema
- Outputs:
  - Prisma schema
  - initial migrations
  - seed strategy
- Exit criteria:
  - core tables exist
  - basic seed data load works

## Phase 6: Backend API Development
- Outputs:
  - auth endpoints
  - reference-data endpoints
  - price endpoints
  - reporting and analytics foundation
- Exit criteria:
  - API supports CRUD and filtered retrieval for core records

## Phase 7: Rule-Based Analysis Engine
- Outputs:
  - trend detection logic
  - alerts logic
  - seasonality summaries
  - market comparison service
- Exit criteria:
  - insights are generated with human-readable explanations

## Phase 8: ML Layer with FastAPI
- Outputs:
  - forecast endpoint
  - training and inference workflow
  - integration guardrails
- Exit criteria:
  - forecasts can be requested for eligible series

## Phase 9: Frontend UI Implementation
- Outputs:
  - themed interface
  - grid-and-gradient visual treatment
  - dashboard pages
  - admin data-entry views
- Exit criteria:
  - UI matches project theme and supports core flows

## Phase 10: Frontend-Backend Integration
- Outputs:
  - TanStack Query data integration
  - form submission flows
  - dashboard interaction with live backend data
- Exit criteria:
  - end-to-end data flow works from UI to persistence

## Phase 11: Testing, Edge Cases, and Debugging
- Outputs:
  - API tests
  - UI behavior checks
  - edge-case handling
  - import validation testing
- Exit criteria:
  - core features verified against expected behavior

## Phase 12: Documentation and Academic Mapping
- Outputs:
  - implementation write-up support
  - report-ready diagrams
  - updated supervisor log
- Exit criteria:
  - project artifacts align with report chapters

## Phase 13: Final Polishing and Defense Preparation
- Outputs:
  - final screenshots
  - polished branding assets
  - defense narrative and demo flow
- Exit criteria:
  - system is presentation-ready and academically defensible

## Personal Actions Required
- Update this roadmap if your supervisor changes the order of write-up expectations, but keep implementation phases logically consistent.
