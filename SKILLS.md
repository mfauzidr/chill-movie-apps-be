# Skill Selection

Follow [AGENTS.md](AGENTS.md) for repository workflow, priority, and approval boundaries. Detailed reusable skill rules live in their `SKILL.md` files; this page only helps select them.

| Use when | Guidance |
| --- | --- |
| Every response | **Caveman** — concise, direct communication. See [`.agents/skills/caveman/SKILL.md`](.agents/skills/caveman/SKILL.md). |
| Implementing or reviewing code | **Ponytail** — smallest coherent change; preserve security, types, architecture, and API contracts. See [`.agents/skills/ponytail/SKILL.md`](.agents/skills/ponytail/SKILL.md). |
| Read-only review or repository assessment | **Code analysis** — inspect relevant code and diffs, assess scope, SQL safety, validation, passwords, API compatibility, errors, and schema/seed ordering; report evidence and risks without implementing. See [`.agents/skills/code-analysis/SKILL.md`](.agents/skills/code-analysis/SKILL.md). |
| Adding or changing a module | Follow [INSTRUCTION.md](INSTRUCTION.md) for the five-layer module structure, validation, errors, and response contracts. |
| Changing API errors or responses | Follow the error and response rules in [INSTRUCTION.md](INSTRUCTION.md); preserve existing contracts unless approved. |
| Adding migrations or seeds | Follow [AGENTS.md](AGENTS.md) approval boundaries and conventions. Check dependency order, constraints, stable parent identifiers, and rerun behavior. Do not infer schema from future API wishes or execute database changes without approval. |
| Adding endpoint tests | Add tests when requested or supported by established infrastructure. Use actual mounted routes, validation paths, and response envelopes; prefer isolated checks, and use disposable data only with approval. Run typecheck and report results and unrun checks. |

