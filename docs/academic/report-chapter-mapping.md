# Report Chapter Mapping

## Purpose
This document maps the implemented BAPI system and the repository documentation to a conventional final-year project report structure. Its purpose is to reduce duplication during report writing and help ensure that every major chapter is supported by actual project evidence.

## Recommended Report Structure

### Chapter One: Introduction
Use these sources:
- `docs/academic/project-charter.md`
- `docs/academic/scope-and-constraints.md`
- `docs/academic/objectives-and-research-alignment.md`
- `README.md`

Key content to write:
- background of the study
- statement of the problem
- aim and objectives
- research questions
- significance of the study
- scope and limitations
- operational definitions if required by your department

### Chapter Two: Literature Review
Use these repo sources only as structural guides, not as literature citations:
- `docs/academic/objectives-and-research-alignment.md`
- `docs/academic/requirements-specification.md`
- `docs/architecture/system-architecture.md`

Key content to write yourself:
- scholarly literature on agricultural market information systems
- literature on price monitoring systems
- literature on data visualization and analytical dashboards
- literature on rule-based analysis and time-series forecasting
- identified gap that BAPI addresses

Important note:
- this chapter still requires external academic references and citations
- the repository does not replace your literature review sources

### Chapter Three: System Analysis and Design
Use these sources:
- `docs/academic/requirements-specification.md`
- `docs/academic/use-case-model.md`
- `docs/architecture/system-architecture.md`
- `docs/architecture/erd.md`
- `docs/architecture/api-boundaries.md`
- `docs/architecture/repository-structure.md`
- `docs/architecture/csv-import-spec.md`

Key content to write:
- existing system analysis if required
- proposed system overview
- functional and non-functional requirements
- use-case descriptions
- architecture diagram explanation
- database design
- input and output design

### Chapter Four: System Implementation
Use these sources:
- `docs/architecture/backend-api-development.md`
- `docs/architecture/rule-based-analysis-engine.md`
- `docs/architecture/ml-forecasting-service.md`
- `docs/architecture/frontend-ui-phase9.md`
- `docs/architecture/frontend-backend-integration-phase10.md`
- `docs/architecture/database-modeling-with-prisma.md`
- `docs/architecture/local-environment-setup.md`

Key content to write:
- development tools and environment
- backend implementation
- database implementation
- analytics implementation
- forecasting implementation
- frontend implementation
- screenshots and interface walkthrough

### Chapter Five: Testing, Results, Summary, Conclusion, and Recommendations
Use these sources:
- `docs/architecture/testing-and-debugging-phase11.md`
- `scripts/smoke-check.mjs`
- `docs/references/document-edit-actions.md`

Key content to write:
- testing strategy
- smoke checks and functional verification
- observed results
- limitations encountered
- summary of contributions
- conclusion
- recommendations for future improvement

## Mapping of Implemented Phases to Report Chapters
| Project Phase | Main Report Chapter(s) Supported | Primary Evidence |
| --- | --- | --- |
| Phase 0 | Chapter One | charter, scope, title, roadmap |
| Phase 1 | Chapters One and Three | requirements, use cases, architecture, ERD |
| Phase 2 | Chapters Three and Four | dataset strategy, CSV specification, sample data |
| Phase 3 | Chapter Four | Git discipline, monorepo governance, workflow notes |
| Phase 4 | Chapter Four | environment setup, Docker, service bootstrapping |
| Phase 5 | Chapters Three and Four | Prisma schema, migration, seed logic |
| Phase 6 | Chapter Four | backend API implementation |
| Phase 7 | Chapters Four and Five | rule-based analysis and explainability |
| Phase 8 | Chapter Four | ML forecasting layer |
| Phase 9 | Chapter Four | frontend visual implementation |
| Phase 10 | Chapters Four and Five | frontend-backend integration |
| Phase 11 | Chapter Five | testing and debugging workflow |

## Personal Actions Required
- Fill Chapter Two with proper academic literature and citations from external sources.
- Add final screenshots from the completed system into Chapter Four and Chapter Five where needed.
- Adjust chapter naming if your department uses a slightly different report structure.
