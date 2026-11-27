---
name: "code-analysis"
description: "Read-only repository analysis focused on correctness, scope, risks, and practical improvements."
---

# Code Analysis

Use for repository reviews and audits. Read the relevant implementation, routes, schema, tests, and current changes. Separate repository facts from assumptions and avoid inventing requirements.

Remain read-only: do not edit files, run database operations, or perform other state-changing actions. Do not access secrets. Follow the safeguards in AGENTS.md.

Report findings and recommendations in the format and level of detail requested by the user. Include evidence, likely affected files, material risks, and checks appropriate if changes are later approved.
