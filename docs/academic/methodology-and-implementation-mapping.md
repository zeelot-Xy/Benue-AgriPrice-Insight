# Methodology and Implementation Mapping

## Purpose
This document explains how the project methodology maps to the actual implementation work in the repository. It helps defend the project academically by showing that the system was built through a deliberate engineering process rather than by ad hoc coding.

## Recommended Methodology Positioning
For this project, the most defensible methodology description is:
- requirements-driven incremental development
- layered system design
- phased implementation with verification at each major stage

This can be described in report language as a practical software engineering methodology combining:
- system analysis
- design
- implementation
- iterative verification

## Methodology-to-Phase Mapping

### 1. Problem Definition and Scope Control
Evidence:
- `docs/academic/project-charter.md`
- `docs/academic/scope-and-constraints.md`
- `docs/academic/objectives-and-research-alignment.md`

Academic justification:
- the project begins with a clearly bounded problem
- feasibility is treated as an engineering decision
- stakeholders and system users are defined early

### 2. Requirements Analysis
Evidence:
- `docs/academic/requirements-specification.md`
- `docs/academic/use-case-model.md`

Academic justification:
- the system requirements were documented before implementation
- the Admin and Viewer roles were separated clearly
- functional and non-functional requirements were considered

### 3. System Design
Evidence:
- `docs/architecture/system-architecture.md`
- `docs/architecture/erd.md`
- `docs/architecture/api-boundaries.md`
- `docs/architecture/repository-structure.md`

Academic justification:
- the project uses a documented architecture
- the data model is normalized and scoped
- subsystem boundaries are clear and defendable

### 4. Data Preparation
Evidence:
- `docs/academic/dataset-strategy.md`
- `docs/architecture/csv-import-spec.md`
- `data/raw/*.csv`

Academic justification:
- the dataset was curated intentionally
- import structure and validation rules were defined
- the project avoids unrealistic claims such as live nationwide real-time data

### 5. Implementation
Evidence:
- backend files in `apps/api`
- frontend files in `apps/web`
- ML files in `apps/ml`
- Prisma files in `prisma`
- implementation notes in `docs/architecture/*`

Academic justification:
- implementation followed the earlier design
- service layers and validation rules were used consistently
- explainability was preserved throughout the implementation

### 6. Verification and Testing
Evidence:
- `docs/architecture/testing-and-debugging-phase11.md`
- `scripts/smoke-check.mjs`

Academic justification:
- the system includes a repeatable verification process
- testing was considered part of the engineering workflow, not an afterthought
- runtime blockers are documented honestly

## Why Explainability Is Central to the Methodology
The methodology deliberately prioritizes:
- rule-based analysis before machine learning
- plain-language explanations alongside numeric outputs
- forecasting as an enhancement rather than the sole analytical method

This is academically strong because it makes the system:
- easier to defend
- easier to evaluate
- more appropriate for the project scope and available data

## Suggested Methodology Wording for the Report
Suggested concise description:

The project adopted a requirements-driven and incremental software engineering methodology. The work progressed through project definition, system analysis, architectural design, dataset preparation, phased implementation, integration, and verification. Core monitoring and explainable rule-based analysis were completed before introducing the forecasting layer, ensuring that the system remained functional, maintainable, and academically defendable even without machine learning.

## Personal Actions Required
- Adjust the wording of the methodology section to match your department’s preferred format.
- If your school requires a named methodology model, present this as an incremental development approach grounded in analysis, design, implementation, and testing.
