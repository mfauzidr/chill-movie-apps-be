# Implementation Instructions

## Scope discipline

Start by locating the nearest implemented analogue and inspect its model, repository, service, handler, router, schema, and callers. Confirm actual route registration in `src/shared/routes/index.ts` and actual schema in migrations before changing code.

Make the smallest coherent change. Do not add authentication, pagination, schema validation libraries, response wrappers, logging systems, or inferred business rules unless the user explicitly requests them.

## Module work

For a new or changed CRUD module, retain the existing five-layer structure:

1. Define TypeScript request/entity/parameter interfaces in `<module>.model.ts`.
2. Keep SQL access in `<module>.repository.ts`; parameterize values and whitelist any dynamic columns.
3. Put input validation, trimming/normalization where justified, uniqueness checks, and `AppError` decisions in `<module>.service.ts`.
4. Keep `<module>.handler.ts` focused on HTTP parameters, status codes, and response serialization.
5. Register routes in `<module>.router.ts`, then mount them centrally only when route exposure is in scope.

Do not expose user passwords in query results or API responses. Do not invent identifier formats: use the relevant schema and existing module behavior as evidence.

## Errors and responses

Use `AppError(code, message, statusCode)` for anticipated validation, conflict, and not-found cases. Let the global error middleware handle database errors and unexpected failures. Preserve the current public envelope:

```json
{ "success": true, "message": "...", "results": [] }
```

For failures, preserve `{ "success": false, "message": "..." }` unless the user approves an API-wide contract change. Do not silently introduce new error-response fields.

## Validation and reporting

After code changes, run `npm.cmd run typecheck`. Also run focused, non-destructive checks that directly cover the change; state any check that could not be run and why. Do not run migrations, seeds, database resets, or production-like commands without explicit approval.

Report the outcome first, then list files changed, validation performed, and any follow-up decision needed from the user.

