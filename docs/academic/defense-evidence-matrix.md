# Defense Evidence Matrix

## Purpose
This document maps likely defense questions to concise answers and repo evidence.

## Question and Evidence Table
| Likely Question | Short Answer | Evidence Source |
| --- | --- | --- |
| Why did you choose only four markets and eight commodities? | The strict scope keeps the project feasible, testable, and academically defendable. | `docs/academic/scope-and-constraints.md` |
| Why is the system web-based instead of mobile or sensor-based? | A web platform is sufficient for the approved final-year scope and supports local demonstration more reliably. | `docs/academic/project-charter.md` |
| Why did you remove forecasting from the final implementation? | The final system was simplified to improve maintainability, developer ownership, runtime reliability, and academic clarity while preserving the core aim of monitoring and explainable analysis. | `README.md`, `docs/architecture/decision-log.md` |
| How do you prevent poor public submissions from corrupting official statistics? | Public submissions go into a review queue and only affect official statistics after admin approval. | `docs/academic/use-case-model.md`, `docs/architecture/api-boundaries.md` |
| Why is the analytics layer rule-based? | Rule-based analytics are deterministic, explainable, and appropriate for the approved project scope. | `docs/architecture/rule-based-analysis-engine.md` |
| Why did you use a separate frontend and backend structure? | It improves clarity, ownership, debugging, and maintenance while preserving a clean service boundary. | `docs/architecture/system-architecture.md`, `docs/architecture/repository-structure.md` |

## Evidence to Prepare for Defense
- screenshots of dashboard, analytics, upload, admin, and login pages
- ERD and system architecture diagrams
- sample CSV structure and import results
- analytics outputs with explanation text
- admin review queue showing pending and approved submissions

## Suggested Demo Order
1. Show login and explain admin-only access.
2. Show dashboard and market comparison.
3. Show analytics and explain rule-based outputs.
4. Show public upload flow.
5. Show admin review and approval flow.

## Personal Actions Required
- Replace or expand any answer here if your supervisor emphasizes a different line of questioning.
- Keep the evidence list aligned with your final screenshots and diagrams.
