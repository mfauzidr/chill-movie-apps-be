# Repository Context

## Current implementation

This is a TypeScript Express 5 backend for a movie application. It uses Knex with the `mysql2` client, Pino for application logging, Morgan for HTTP logs, and bcrypt for user password hashing.

`src/app.ts` creates the Express app and installs JSON and URL-encoded parsing, Morgan, fixed-origin CORS, static `./public`, the shared router, and a root status response. The shared router applies request logging, mounts `/users`, `/genres`, and `/producers`, then mounts the global error handler. `server.ts` loads runtime environment settings and starts the listener; `api/index.ts` re-exports it.

## Implemented API conventions

`users`, `genres`, and `producers` are implemented HTTP modules. Their repositories execute parameterized raw SQL through `src/shared/config/knex.ts`; their services validate payloads and throw `AppError`; their handlers return response envelopes. User reads deliberately omit `password`.

The database schema also defines contents, casts, content relations, movies, packages, orders, payments, seasons, episodes, lists, and watch histories. These have no corresponding application modules yet. Their existence is not authorization to expose an API or infer its rules.

## Data conventions

Tables use snake_case fields, numeric auto-increment primary keys, and, where needed, database-generated `CHAR(36)` UUIDs. Foreign keys may reference UUIDs or numeric IDs according to each migration. `created_at` commonly defaults to the current timestamp; `updated_at` is nullable and repository updates currently set it explicitly with `NOW()`.

Migrations live in `src/shared/database/migrations`; seeds live beside them in `seeds`. The Knex CLI configuration currently exposes a `development` environment and TypeScript migration/seed files.

## Reliability notes

Treat source files and current migrations as authoritative over README and ignored build output. Empty collection responses, identifier validation, wording, and some type definitions vary across existing modules; distinguish compatibility requirements for existing endpoints from patterns chosen for new work. Database execution is always approval-gated.

