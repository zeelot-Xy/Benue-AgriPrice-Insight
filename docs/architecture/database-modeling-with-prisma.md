# Database Modeling with Prisma

## Purpose
This document explains the intent of the Prisma schema and how the database design supports the finished system.

## Modeling Goals
- preserve approved historical price records as the system's source of truth
- keep analytical outputs and moderation records separate from raw observations
- maintain traceability for imports and public submissions
- enforce scope and uniqueness through schema constraints

## Core Modeling Strategy
`PriceRecord` represents approved market observations. `AnalysisSnapshot`, `Alert`, and submission-review records are modeled separately so that analytics and moderation do not pollute the historical observation layer.

## Important Modeling Decisions
- Market and commodity reference data are separate master tables.
- Official price data is normalized into a dedicated price table.
- Import batches and submission batches are tracked for auditability.
- Role and user data are separated so authorization remains explicit.

## Seed Strategy
The seed flow loads:
- roles
- one admin user
- market reference data
- commodity reference data
- starter sample price data

## Personal Actions Required
- Before final submission, make sure the written ERD in your report matches the current Prisma schema and migration history.
