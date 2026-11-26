# AI Agent Harness

## Operating mode

Use **BALANCED MODE**: work autonomously inside the user's approved task scope, while pausing for approval before actions with broader or hard-to-reverse impact.

## Default policies

- **Caveman** is mandatory for every response. Apply `.agents/skills/caveman/SKILL.md`.
- **Ponytail** is the default for implementation tasks. Apply `.agents/skills/ponytail/SKILL.md`.
- These policies complement, and do not weaken, the repository-specific workflow, approval boundaries, architecture, security, typing, and API-contract rules below.

## Required workflow

For every implementation task, follow this order:

1. **Explore** the relevant repository code, routes, models, migrations, configuration, and existing changes.
2. **Plan** the smallest change that satisfies the request. State material assumptions and risks.
3. **Implement** only the approved scope.
4. **Validate** with `npm.cmd run typecheck` and focused checks appropriate to the change.
5. **Report** changed files, validation results, and unresolved concerns.

Do not infer conventions from generic best practice when repository evidence is available. Read existing equivalents before adding a module, route, migration, seed, or shared behavior.

## Approval boundaries

Obtain explicit user approval before:

- architecture or API-contract changes beyond the requested feature;
- database schema changes, migrations, rollbacks, resets, or seed execution;
- destructive operations or data deletion;
- installing, upgrading, or removing dependencies;
- Git commit, push, merge, rebase, or history changes;
- deployment or changes to deployment configuration.

Do not modify unrelated files or overwrite user changes. Do not create application features when the request is only for analysis, review, or documentation.

## Repository facts

- Runtime is TypeScript, Express 5, Knex, MySQL2, Pino, and bcrypt.
- `src/app.ts` configures middleware and routes. `server.ts` loads runtime environment settings and starts the listener; `api/index.ts` re-exports it for deployment integration.
- Implemented HTTP modules are `users`, `genres`, and `producers`; other domain tables presently have migrations/seeds but no modules.
- Actual route bases are `/users`, `/genres`, and `/producers`; do not rely on the stale README's `/api/v1/health` claim.
- TypeScript validation command: `npm.cmd run typecheck` on Windows PowerShell environments.

## Established implementation conventions

- Module layout: `model`, `repository`, `service`, `handler`, and `router` files under `src/modules/<module>/`.
- Request flow: router -> handler -> service -> repository -> MySQL.
- Models use `I`-prefixed interfaces and snake_case API/database field names.
- Services own input validation, normalization, duplicate checks, and business errors.
- Repositories use the shared Knex instance, parameterized `db.raw` SQL, and explicit writable-column allowlists.
- Expected client errors use `AppError`; handlers serialize success responses.
- Success responses use `{ success: true, message, results? }`; errors use `{ success: false, message }`.
- Migrations are timestamp-prefixed TypeScript files with `up`/`down`, explicit constraints, and named indexes/foreign keys.

## Known debt: do not copy without an approved corrective change

- `server.ts` starts listening as an import side effect; do not extend this coupling for new deployment code.
- Runtime and migration environment loading differ; do not assume all `DB_*` values are validated consistently.
- `dist/` is ignored and may contain stale output; do not treat it as source of truth.
- Seed implementations are mixed and some episode seeds use hard-coded numeric IDs; new seeds should resolve stable parent identifiers and state their idempotency behavior.
- README routes and startup claims are stale.
- Existing validation/typing and response wording are not fully consistent. Preserve the public contract for touched endpoints, but do not reproduce a weakness in new code solely for symmetry.

## Sensitive Files & Credentials

Treat credentials and secret-bearing files as restricted resources.

- Do not read, open, print, display, or inspect the contents of `.env`, `.env.*` (except explicitly approved example templates), private keys (`*.pem`, `*.key`), credentials files, database dumps, or other files likely to contain secrets.
- Do not use commands that expose secret values, including `cat`, `type`, `Get-Content`, `grep`, or equivalent commands against restricted files.
- Do not copy, log, summarize, or include credentials in terminal output, reports, commits, or generated documentation.
- You may inspect filenames, paths, and environment variable names without accessing secret values when necessary.
- Use `.env.example` or documented variable names as references, provided they contain no real credentials.
- If access to a restricted file is genuinely necessary, stop and request explicit user approval before accessing it.
- Never transmit credentials to external services or include them in prompts, logs, or tool arguments.
