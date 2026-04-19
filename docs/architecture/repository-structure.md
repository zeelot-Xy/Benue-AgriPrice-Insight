# Repository Structure Guide

## Purpose
This repository is organized as a monorepo so the frontend, backend, ML service, shared configuration, and documentation evolve together under one version-controlled project.

## Top-Level Directories
- `apps/web`: frontend application
- `apps/api`: backend API
- `apps/ml`: forecasting microservice
- `packages/config`: shared configuration packages
- `packages/ui`: optional shared design tokens or UI utilities
- `prisma`: schema and migrations
- `scripts`: project utilities and data scripts
- `data/raw`: source CSV files and manually prepared input data
- `data/processed`: cleaned or transformed datasets
- `tests`: integration, system, and later end-to-end tests
- `docs`: academic and engineering documentation

## Rule
Application logic belongs inside `apps/*`. Shared concerns should move into `packages/*` only when reuse is real and proven.

## Discipline
- Keep infrastructure setup separate from business logic.
- Keep service-layer logic separate from route/controller code.
- Keep analysis logic explainable and testable.
