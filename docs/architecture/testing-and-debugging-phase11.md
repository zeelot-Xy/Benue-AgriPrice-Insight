# Phase 11: Testing and Debugging

## Purpose
This document summarizes the verification approach used for the completed system.

## Verification Areas
- frontend type checking and builds
- backend type checking and builds
- smoke-check workflow
- authentication flow
- analytics responses
- public submission flow
- admin moderation flow

## Typical Runtime Checks
1. Create `.env` from `.env.example`.
2. Start the stack.
3. Run `npm run smoke:check`.
4. Verify login.
5. Verify dashboard and analytics.
6. Verify public submission and admin review behavior.

## Key Edge Cases
- invalid CSV structure
- duplicate price rows
- invalid public submission rows
- unauthenticated access to protected admin actions
- admin approval and rejection handling

## Personal Actions Required
- Use this document together with the smoke-check script when preparing for defense.
