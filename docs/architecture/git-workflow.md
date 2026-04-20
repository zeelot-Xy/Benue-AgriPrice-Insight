# Git Workflow Discipline

## Purpose
This document defines the Git workflow for the project so that implementation remains organized, reviewable, and academically traceable.

## Workflow Goals
- maintain a readable commit history
- support phased delivery
- reduce accidental scope mixing
- make it easy to explain progress during supervision and defense

## Recommended Working Model
1. Start from a clean `main` branch.
2. Create a focused feature branch using the `codex/` prefix.
3. Make small, related commits with clear messages.
4. Verify the branch changes before merging back to `main`.
5. Keep the repository in a usable state after each completed phase.

## Branch Categories
### Phase Branches
Use for major supervised milestones.

Examples:
- `codex/phase-4-local-environment`
- `codex/phase-5-prisma-schema`

### Feature Branches
Use for bounded functional work inside a phase.

Examples:
- `codex/api-price-import`
- `codex/web-dashboard-layout`

### Fix Branches
Use for targeted bug corrections.

Examples:
- `codex/fix-duplicate-price-validation`
- `codex/fix-dashboard-filter-state`

## Commit Structure Guidance
### Good Commit Characteristics
- one logical concern
- clear intent
- no unrelated file churn
- easy to explain in review notes

### Recommended Sequence Within a Feature
1. documentation or design setup
2. data model or config changes
3. implementation
4. testing or polishing

This sequence is not mandatory, but it often produces the cleanest history for academic projects.

## When to Split Commits
Split commits when:
- documentation and code evolve separately
- reference data changes are independent from application code
- one file group defines contracts and another implements behavior
- a reviewer would benefit from seeing the changes in separate steps

## When Not to Split Excessively
Do not create tiny commits that are meaningless on their own. A commit should remain understandable and useful if viewed independently.

## Review and Merge Readiness Checklist
- branch solves one bounded problem
- commit history is readable
- relevant docs are updated
- no accidental scope expansion
- no unrelated local editor settings or artifacts are included

## Academic Defense Benefit
This workflow improves traceability. During supervision or defense, the commit history can demonstrate that the project progressed through structured analysis, controlled data preparation, and incremental implementation rather than ad hoc coding.

## Personal Actions Required
- If you later use GitHub pull requests for review, you may add a PR template, but this workflow remains valid even without one.
