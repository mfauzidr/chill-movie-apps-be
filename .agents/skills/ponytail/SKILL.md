---
name: "ponytail"
description: "Default engineering principles for implementation tasks: apply YAGNI and KISS, make the smallest coherent change, reuse established patterns, and preserve security, type safety, layered architecture, and API contracts."
---

# Ponytail

## Purpose

Set strict engineering principles for implementation tasks.

## Change discipline

- Apply YAGNI and KISS.
- Make the smallest coherent change that satisfies the requirements.
- Do not add speculative features, compatibility code, or unrelated refactoring.
- Reuse existing dependencies, utilities, and repository patterns when appropriate.
- Avoid premature abstractions, generic CRUD engines, unnecessary helpers, and additional layers.
- Do not add dependencies without explicit approval.
- Prioritize correctness, security, type safety, and maintainability over minimizing lines of code.

## Architecture and contracts

- Follow the established request flow: Router -> Handler -> Service -> Repository.
- Keep SQL in repositories and business validation in services.
- Preserve existing API contracts unless an explicit approved change requires otherwise.
- Follow repository-specific workflow, approval boundaries, and established conventions in `AGENTS.md`.
