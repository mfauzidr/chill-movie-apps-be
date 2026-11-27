# Chill Movie Apps Backend

TypeScript backend for the Chill Movie Apps project. It uses Express 5, Knex, MySQL2, and bcrypt.

## Setup

Requirements: Node.js, npm, and a MySQL database.

1. Install dependencies with `npm install`.
2. Configure the runtime environment with `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.
3. Apply the project migrations to the intended development database with `npm run migrate`.
4. Start the development server with `npm run dev`.
5. Verify endpoints manually with the provided Postman collection and inspect database changes in MySQL or DBeaver.

The server listens on port `8080` by default. `GET /` returns a status response.

## HTTP API

All routes are mounted at the root:

| Resource | Collection | Item parameter | Methods |
| --- | --- | --- | --- |
| Users | `/users` | UUID: `/users/:uuid` | `GET`, `POST`, `PATCH`, `DELETE` |
| Genres | `/genres` | Numeric ID: `/genres/:id` | `GET`, `POST`, `PATCH`, `DELETE` |
| Producers | `/producers` | Numeric ID: `/producers/:id` | `GET`, `POST`, `PATCH`, `DELETE` |
| Casts | `/casts` | Numeric ID: `/casts/:id` | `GET`, `POST`, `PATCH`, `DELETE` |

`GET` on a collection lists records; `GET` on an item retrieves one record. `POST` creates, `PATCH` updates, and `DELETE` removes. Success responses use `{ "success": true, "message": "...", "results"?: [...] }`; `results` is optional and DELETE responses omit it. Error responses use `{ "success": false, "message": "..." }`. User responses omit passwords.

## Project commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the development server |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Run the compiled server |
| `npm run typecheck` | Check types without emitting output |

Knex CLI scripts are available for migrations and seeds. Database commands change data; configure them only for the intended development database. Endpoint checks use Postman, and database verification can be done in MySQL or DBeaver. This repository does not include an automated test suite.
