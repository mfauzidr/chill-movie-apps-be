# Implementation Guidance

Use the existing route -> handler -> service -> repository flow when it fits the task. Keep SQL in repositories, business rules in services, and HTTP serialization in handlers. A module does not need extra layers just to match a template.

Use `AppError` for expected client errors and preserve the current success and failure response envelopes. Validate required input and database column limits; add other validation only when the mission or an existing business rule requires it.

Parameterize SQL values and allowlist dynamic column names. Do not return user passwords. Check schema, mounted routes, and the closest existing module before changing those areas.

See [AGENTS.md](AGENTS.md) for scope and safety rules, and [CONTEXT.md](CONTEXT.md) for current project facts.
