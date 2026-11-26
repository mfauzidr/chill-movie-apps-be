---
name: "code-analysis"
description: "Read-only repository analysis workflow for assessing implementation quality, risks, and a focused improvement plan."
---

# Code Analysis

## Purpose

Provide a reusable, analysis-only workflow for repository questions and proposed changes. Do not implement recommendations as part of this skill.

## Workflow

1. Explore the relevant source files and their surrounding routes, handlers, services, repositories, models, migrations, shared helpers, configuration, and tests as applicable. Read the closest established equivalents before drawing conclusions.
2. Identify repository conventions and distinguish them from known technical debt. Follow `AGENTS.md` and applicable skills; do not treat debt as a required pattern.
3. Evaluate implementation correctness, maintainability, security, scope alignment, and architectural consistency. Base conclusions on repository evidence and do not invent requirements or business rules.
4. Report no more than three findings, ordered by importance. For each finding, give the evidence and practical impact; cite relevant files and lines when available. If there are no findings, say so.
5. Recommend one preferred improvement and explain concretely why it addresses the most important issue with the smallest coherent change.
6. Identify expected affected files and a focused validation plan. Describe checks to run if the recommendation is implemented; do not make changes or execute database or other state-changing checks.
7. State assumptions, missing evidence, and blockers clearly. Do not present an inference as a repository fact.

## Boundaries

- Read only. Never create, edit, or delete files.
- Do not run migrations, seeds, database writes, destructive commands, or other state-changing operations.
- Do not install dependencies, commit, push, merge, or deploy.
- Do not access restricted credential files or secret values. Follow the sensitive-file rules in `AGENTS.md`.
- Do not expand the requested scope or invent product behavior. Preserve the approval boundaries in `AGENTS.md`.
- Apply Caveman communication principles and Ponytail engineering principles when evaluating options.

## Response format

Use these sections in this order:

1. **Assessment** — concise overall conclusion and scope reviewed.
2. **Findings** — up to three items, ordered by importance, with evidence and impact.
3. **Recommended improvement** — one preferred improvement with concrete reasoning.
4. **Expected affected files** — likely files and their roles; identify uncertainty.
5. **Validation plan** — focused, non-destructive checks appropriate to the change.
6. **Assumptions and blockers** — assumptions, unavailable evidence, and anything that prevents a reliable assessment.
