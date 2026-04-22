# Contributing Guide

## Purpose
This document defines the engineering workflow for BAPI so development remains disciplined, explainable, and easy to review throughout the final-year project lifecycle.

## Core Working Rules
- Keep all work inside the approved project scope.
- Make changes in small, reviewable increments.
- Prefer one clear concern per commit whenever practical.
- Document design decisions before implementing major changes.
- Keep explainability ahead of unnecessary complexity.

## Branch Strategy
### Primary Branch
- `main` is the stable integration branch.

### Feature Branch Naming
Use the `codex/` prefix followed by a short descriptive suffix.

Examples:
- `codex/phase-4-environment-setup`
- `codex/backend-auth-foundation`
- `codex/frontend-dashboard-shell`

### Branch Rules
- Create a new branch for each major phase or bounded feature set.
- Do not mix unrelated work on the same branch.
- Merge only after the scope of the branch is complete and reviewed.

## Commit Message Convention
Use a short lowercase type prefix followed by a concise description.

Recommended types:
- `chore`
- `docs`
- `data`
- `feat`
- `fix`
- `refactor`
- `test`
- `style`

Examples:
- `docs: add dataset strategy and csv import specification`
- `feat: add admin login endpoint`
- `fix: prevent duplicate price record import`

## Commit Discipline
- Keep each commit focused on one logical change set.
- Do not combine documentation, data, and feature code in one commit unless they are tightly coupled.
- Prefer multiple small commits over one broad commit.
- Ensure the repository remains understandable from commit history alone.

## Pull Request Discipline
If pull requests are used later, each pull request should:
- have a clear title
- describe the problem addressed
- summarize what changed
- identify any documents updated
- mention any data, schema, or API implications

## Repository Ownership Guidance
- `frontend`: frontend UI, pages, state, and route handling
- `backend`: backend API, validation, services, and database access
- `docs`: non-code project artifacts
- `data`: curated CSV inputs and processed data

## Before Committing
Use this quick checklist:
- Is the change still inside scope?
- Is the commit message precise?
- Are the affected docs updated if the behavior changed?
- Are unrelated files left untouched?
- Is the change small enough to explain in a few sentences?

## Personal Actions Required
- If your supervisor asks for a stricter branch or submission workflow, update this guide before team-wide use.
