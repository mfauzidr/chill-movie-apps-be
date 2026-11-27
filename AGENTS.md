# Agent Instructions

## Scope and sources

- Follow the user's mission requirements. Use migrations for schema facts and mounted routes and current handlers for API behavior. Do not infer features or business rules.
- Make the smallest change that satisfies the request. Preserve unrelated worktree changes and existing API contracts.
- Read [CONTEXT.md](CONTEXT.md) for current project facts and [INSTRUCTION.md](INSTRUCTION.md) for implementation conventions.

## Safety and approvals

- Never read secret files or values. This includes `.env`, private keys, credentials, and database dumps. `.env.example` may be read only when it contains no real credentials.
- Do not run migrations, seeds, database writes, resets, or other database operations without explicit approval.
- Get explicit approval before schema changes, dependency changes, destructive actions, API or architecture changes beyond the request, Git history/remote operations, and deployment changes.
- Do not commit or push unless asked.

## Core conventions

- Existing request flow is router -> handler -> service -> repository. Use the five-file module layout when it fits the task; do not add boilerplate layers for small changes.
- Keep SQL in repositories, parameterize values, and allowlist dynamic column names. Put requirement-backed validation and business rules in services.
- Preserve response envelopes and keep user passwords out of reads and responses.
- Prefer existing dependencies and patterns. Avoid speculative features, abstractions, and validation rules.

## Validation

- Run the checks requested by the user. Use TypeScript type checking and the production build for code changes when requested. Verify endpoint behavior manually through Postman and database state through MySQL or DBeaver when that is part of the task; do not run database operations without approval.
- This repository has no automated test suite. Do not add automated testing infrastructure unless the user requests it.
