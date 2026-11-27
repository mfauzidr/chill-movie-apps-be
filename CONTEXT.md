# Project Context

This is a TypeScript and Express 5 backend using Knex, MySQL2, Pino, Morgan, and bcrypt. `src/app.ts` configures the app; `server.ts` loads the runtime environment and starts the listener.

## Current HTTP modules

The shared router mounts `/users`, `/genres`, `/producers`, and `/casts`. Each currently supports list, read-one, create, update, and delete routes. Users use UUID path parameters; genres, producers, and casts use numeric IDs. The root `GET /` returns a status response. There is no `/api/v1/health` route.

The repositories use parameterized raw SQL. User reads omit passwords. Success responses use `{ success: true, message, results? }`; failures use `{ success: false, message }`.

## Schema and source

Migrations in `src/shared/database/migrations` define the database schema and constraints. Other domain tables do not imply that their APIs are in scope. Prefer source and migrations over ignored `dist/` output and stale documentation.

Runtime database settings use `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`. Endpoint behavior is checked manually through Postman; database state can be verified with MySQL or DBeaver. The repository has no automated test database configuration.
